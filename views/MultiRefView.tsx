import React, { useState } from 'react';
import { AppMode, ImageReference, StyleModifier } from '../types';
import { generateOptimizedPrompt } from '../services/geminiService';
import StyleSelector from '../components/StyleSelector';
import OutputDisplay from '../components/OutputDisplay';
import { Send, Eraser, Plus, Trash2 } from 'lucide-react';

const MultiRefView: React.FC = () => {
  const [images, setImages] = useState<ImageReference[]>([]);
  const [prompt, setPrompt] = useState('');
  const [modifiers, setModifiers] = useState<StyleModifier[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImages([
        ...images,
        {
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          name: ''
        }
      ]);
    }
    // Reset input value to allow same file upload
    e.target.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleNameChange = (id: string, name: string) => {
    setImages(images.map(img => img.id === id ? { ...img, name } : img));
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError("请至少添加一张参考图片。");
      return;
    }
    if (!prompt.trim()) {
      setError("请描述您的视频故事。");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedText = await generateOptimizedPrompt({
        mode: AppMode.MULTI_REF,
        images: images,
        userPrompt: prompt,
        modifiers: modifiers,
      });
      setResult(generatedText);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImages([]);
    setPrompt('');
    setModifiers([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Dynamic Image List */}
        <div className="space-y-3">
           <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">角色/物品参考</label>
              <label className="cursor-pointer flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus size={16} />
                  <span>添加参考图</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAddImage} />
              </label>
           </div>
           
           <div className="space-y-3 min-h-[100px]">
              {images.length === 0 && (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500 text-sm">
                      暂无参考图。点击“添加参考图”上传角色或物体。
                  </div>
              )}
              {images.map((img, index) => (
                  <div key={img.id} className="flex gap-4 p-3 bg-slate-800 rounded-xl border border-slate-700 items-center animate-fadeIn">
                      <div className="w-16 h-16 shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
                          <img src={img.previewUrl} alt="Ref" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <label className="text-xs text-slate-500 ml-1">设定名称</label>
                          <input 
                              type="text" 
                              value={img.name}
                              onChange={(e) => handleNameChange(img.id, e.target.value)}
                              placeholder={`例如：主角、魔法剑...`}
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          />
                      </div>
                      <button 
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                          <Trash2 size={18} />
                      </button>
                  </div>
              ))}
           </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">故事/场景描述</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="使用上方设定的名称描述场景剧情..."
              className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24"
            />
        </div>

        <StyleSelector selected={modifiers} onChange={setModifiers} />

        <div className="flex gap-4 pt-2">
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || images.length === 0 || !prompt}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all shadow-lg
                ${loading || images.length === 0 || !prompt
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/20'
                }
              `}
            >
              {loading ? '编写中...' : (
                <>
                  <span>生成组合提示词</span>
                  <Send size={20} />
                </>
              )}
            </button>
        </div>
      </div>

      <div className="h-full">
        <OutputDisplay isLoading={loading} result={result} error={error} />
      </div>
    </div>
  );
};

export default MultiRefView;