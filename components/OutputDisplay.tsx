import React, { useState } from 'react';
import { Copy, Check, Loader2, RefreshCw } from 'lucide-react';

interface OutputDisplayProps {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ isLoading, result, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-300 font-medium text-lg">正在炼制提示词...</p>
        <p className="text-slate-500 text-sm mt-2">正在分析画面并优化描述</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-red-900/30 p-8">
        <div className="p-3 bg-red-900/20 rounded-full text-red-500 mb-4">
          <RefreshCw size={32} />
        </div>
        <h3 className="text-red-400 font-bold text-lg mb-2">生成失败</h3>
        <p className="text-slate-400 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-8 text-center border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto">
          <SparklesIcon className="text-slate-600" size={32} />
        </div>
        <h3 className="text-slate-300 font-bold text-lg">准备创作</h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto">上传图片并描述您的构思，即可生成专业视频提示词。</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
           <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
           <h3 className="text-slate-100 font-semibold">优化后的提示词</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            copied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="text-sm font-medium">{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-300 font-light">
            {result}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const SparklesIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
)

export default OutputDisplay;