import React, { useState } from 'react';
import { AppMode } from './types';
import SingleFrameView from './views/SingleFrameView';
import StartEndView from './views/StartEndView';
import MultiRefView from './views/MultiRefView';
import { Layers, Film, Users, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.SINGLE_FRAME);

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.SINGLE_FRAME:
        return <SingleFrameView />;
      case AppMode.START_END:
        return <StartEndView />;
      case AppMode.MULTI_REF:
        return <MultiRefView />;
      default:
        return <SingleFrameView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-900/40">
              <Zap className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
              AI 视频提示词大师
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <nav className="flex flex-col sm:flex-row p-1 bg-slate-900 rounded-xl border border-slate-800 gap-1 sm:gap-0">
          <button
            onClick={() => setActiveMode(AppMode.SINGLE_FRAME)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeMode === AppMode.SINGLE_FRAME 
                ? 'bg-slate-800 text-blue-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Layers size={18} />
            <span>单帧润色</span>
          </button>
          
          <button
            onClick={() => setActiveMode(AppMode.START_END)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeMode === AppMode.START_END 
                ? 'bg-slate-800 text-purple-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Film size={18} />
            <span>首尾帧补全</span>
          </button>

          <button
            onClick={() => setActiveMode(AppMode.MULTI_REF)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeMode === AppMode.MULTI_REF 
                ? 'bg-slate-800 text-emerald-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Users size={18} />
            <span>多图参考</span>
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px] relative">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} AI Video Prompt Alchemist. 专为 GenAI 视频模型优化.
        </div>
      </footer>
    </div>
  );
};

export default App;