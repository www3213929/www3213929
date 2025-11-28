import React, { useState } from 'react';
import { AppMode, ImageReference, StyleModifier } from '../types';
import { generateOptimizedPrompt } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import StyleSelector from '../components/StyleSelector';
import OutputDisplay from '../components/OutputDisplay';
import { Send, Eraser, ArrowRight, Activity, ChevronsRight, GitCommitHorizontal } from 'lucide-react';

const StartEndView: React.FC = () => {
  const [startImage, setStartImage] = useState<ImageReference | null>(null);
  const [endImage, setEndImage] = useState<ImageReference | null>(null);
  const [prompt, setPrompt] = useState('');
  const [modifiers, setModifiers] = useState<StyleModifier[]>([]);
  
  // New state for easing
  const [easeIn, setEaseIn] = useState(false);
  const [easeOut, setEaseOut] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (file: File, isStart: boolean) => {
    const previewUrl = URL.createObjectURL(file);
    const imgObj = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl
    };
    if (isStart) setStartImage(imgObj);
    else setEndImage(imgObj);
  };

  const handleGenerate = async () => {
    if (!startImage || !endImage) {
      setError("请上传起始帧和结束帧。");
      return;
    }
    if (!prompt.trim()) {
      setError("请描述这两帧之间的过渡效果。");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedText = await generateOptimizedPrompt({
        mode: AppMode.START_END,
        images: [startImage, endImage],
        userPrompt: prompt,
        modifiers: modifiers,
        easeOptions: { easeIn, easeOut }
      });
      setResult(generatedText);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setStartImage(null);
    setEndImage(null);
    setPrompt('');
    setModifiers([]);
    setEaseIn(false);
    setEaseOut(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Images Row */}
        <div className="grid grid-cols-2 gap-4 items-center relative">
          <ImageUploader 
            label="起始帧 (Start)"
            image={startImage}
            onUpload={(f) => handleUpload(f, true)}
            onRemove={() => setStartImage(null)}
            heightClass="h-40"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 rounded-full p-1 border border-slate-700">
             <ArrowRight size={20} className="text-slate-400" />
          </div>
          <ImageUploader 
            label="结束帧 (End)"
            image={endImage}
            onUpload={(f) => handleUpload(f, false)}
            onRemove={() => setEndImage(null)}
            heightClass="h-40"
          />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">过渡描述</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述这两个画面之间发生了什么，如何变化的..."
              className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24"
            />
        </div>

        {/* Easing Controls - New Section */}
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Activity size={14} className="text-blue-400" />
             <span>动态平滑控制 (减少刹车感)</span>
           </label>
           <div className="grid grid-cols-2 gap-3">
             <button
                onClick={() => setEaseIn(!easeIn)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group
                  ${easeIn 
                    ? 'bg-blue-900/30 border-blue-500/50 text-blue-200' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
             >
                <div className="flex items-center gap-2">
                  <ChevronsRight size={18} className={easeIn ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="font-medium">动态缓入 (Ease In)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                  ${easeIn ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-800'}`}>
                    {easeIn && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
             </button>

             <button
                onClick={() => setEaseOut(!easeOut)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group
                  ${easeOut 
                    ? 'bg-purple-900/30 border-purple-500/50 text-purple-200' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
             >
                <div className="flex items-center gap-2">
                  <GitCommitHorizontal size={18} className={easeOut ? 'text-purple-400' : 'text-slate-500'} />
                  <span className="font-medium">动态缓出 (Ease Out)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                  ${easeOut ? 'bg-purple-500 border-purple-500' : 'border-slate-600 bg-slate-800'}`}>
                    {easeOut && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
             </button>
           </div>
           <p className="text-xs text-slate-500 px-1">
             提示：勾选"缓入"使起步更柔和，勾选"缓出"使结束更平滑，避免视频循环或拼接时的突兀感。
           </p>
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
              disabled={loading || !startImage || !endImage || !prompt}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all shadow-lg
                ${loading || !startImage || !endImage || !prompt
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/20'
                }
              `}
            >
              {loading ? '分析中...' : (
                <>
                  <span>优化过渡效果</span>
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

export default StartEndView;