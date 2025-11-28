import React, { useState } from 'react';
import { AppMode, ImageReference, StyleModifier } from '../types';
import { generateOptimizedPrompt } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import OutputDisplay from '../components/OutputDisplay';
import { Send, Eraser } from 'lucide-react';

const SingleFrameView: React.FC = () => {
  const [image, setImage] = useState<ImageReference | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImage({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl
    });
  };

  const handleGenerate = async () => {
    if (!image) {
      setError("请上传一张参考图片。");
      return;
    }
    if (!prompt.trim()) {
      setError("请简单描述您的想法。");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedText = await generateOptimizedPrompt({
        mode: AppMode.SINGLE_FRAME,
        images: [image],
        userPrompt: prompt,
        modifiers: [], 
      });
      setResult(generatedText);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPrompt('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Input Section */}
        <div className="space-y-6">
          <ImageUploader 
            label="参考画面"
            image={image}
            onUpload={handleUpload}
            onRemove={() => setImage(null)}
            heightClass="h-64"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">您的构思</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：赛博朋克侦探在雨夜的霓虹街道上行走，看着全息图..."
              className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="清空"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !image || !prompt}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all shadow-lg
                ${loading || !image || !prompt 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20'
                }
              `}
            >
              {loading ? '生成中...' : (
                <>
                  <span>生成提示词</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="h-full">
        <OutputDisplay isLoading={loading} result={result} error={error} />
      </div>
    </div>
  );
};

export default SingleFrameView;