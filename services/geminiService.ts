import { GoogleGenAI } from "@google/genai";
import { AppMode, ImageReference, PromptRequest, StyleModifier } from "../types";

const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateOptimizedPrompt = async (request: PromptRequest): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Use gemini-2.5-flash for multimodal tasks
    const modelId = "gemini-2.5-flash"; 

    // Updated instructions for Chinese output and conciseness
    let systemInstruction = "你是 AI 视频提示词专家。你的目标是将用户的输入（描述和图片）转化为适用于视频生成模型的高质量提示词。\n\n请遵循以下原则：\n1. **输出结果必须是中文**。\n2. **保持简练、精准**，严格控制字数，避免冗长的修饰。\n3. 结合用户的简单描述进行润色，精准描述动作、运镜、光影等核心要素。\n4. 去除无意义的废话，直击画面核心。";

    let userContentPrompt = "";
    const parts: any[] = [];

    // 1. Prepare Images
    for (const img of request.images) {
      const imgPart = await fileToPart(img.file);
      parts.push(imgPart);
    }

    // 2. Construct Prompt based on Mode
    const modifierText = request.modifiers.length > 0 
      ? `\n\n风格增强方向 (请融入提示词中): ${request.modifiers.join(', ')}.` 
      : "";

    if (request.mode === AppMode.SINGLE_FRAME) {
      userContentPrompt = `
      我提供了一张图片。
      我的简单构思是: "${request.userPrompt}"。
      
      任务:
      1. 分析图片内容。
      2. 基于构思，写一段**简练**的中文视频提示词，让画面动起来。
      3. 重点描述动作和关键视觉元素。
      4. **字数控制在 100 字左右**，不要太长。
      ${modifierText}
      `;
    } else if (request.mode === AppMode.START_END) {
      // Logic for ease in / ease out
      const easeInstructions: string[] = [];
      if (request.easeOptions?.easeIn) {
        easeInstructions.push("- **缓入 (Ease In)**: 描述动作或运镜从静止或缓慢状态开始，然后平滑加速。不要从第一帧就剧烈运动。");
      }
      if (request.easeOptions?.easeOut) {
        easeInstructions.push("- **缓出 (Ease Out)**: 描述动作或运镜在接近尾声时平滑减速，自然地过渡到静止或平稳状态，避免突然截断或急停。");
      }
      
      const easePromptSection = easeInstructions.length > 0
        ? `\n\n关键动态要求 (消除刹车感/顿挫感):\n${easeInstructions.join('\n')}\n请在提示词中明确体现这种速度变化，使视频衔接更流畅。`
        : "";

      userContentPrompt = `
      我提供了两张图片：
      - 第一张是起始帧 (START)。
      - 第二张是结束帧 (END)。
      
      我对过渡的简单构思是: "${request.userPrompt}"。
      
      任务:
      1. 写一段**简练**的中文视频提示词，连接这两个状态。
      2. 描述从起始帧到结束帧的关键变化。
      3. 保持语言紧凑。
      ${easePromptSection}
      ${modifierText}
      `;
    } else if (request.mode === AppMode.MULTI_REF) {
      const mapping = request.images.map((img, idx) => `图片 ${idx + 1} 代表: "${img.name || '主体 ' + (idx + 1)}" `).join('\n');
      
      userContentPrompt = `
      我提供了多张参考图片，并指定了它们的内容：
      ${mapping}
      
      我的故事/构思是: "${request.userPrompt}"。
      
      任务:
      1. 写一段**简练**的中文视频生成提示词，融合这些特定的角色/物体。
      2. 确保角色外观描述准确但简洁。
      3. 重点描述互动和剧情。
      ${modifierText}
      `;
    }

    parts.push({ text: userContentPrompt });

    // 3. Call API
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Creativity balance
      }
    });

    return response.text || "生成失败，未返回内容。";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "生成提示词失败");
  }
};