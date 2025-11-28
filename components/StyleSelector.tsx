import React from 'react';
import { StyleModifier } from '../types';
import { Sparkles, Zap, Cloud, Sun, Video, Palette } from 'lucide-react';

interface StyleSelectorProps {
  selected: StyleModifier[];
  onChange: (selected: StyleModifier[]) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selected, onChange }) => {
  
  const toggleStyle = (style: StyleModifier) => {
    if (selected.includes(style)) {
      onChange(selected.filter(s => s !== style));
    } else {
      onChange([...selected, style]);
    }
  };

  const styles = [
    { id: StyleModifier.ACTION, label: '动作 / 打戏', icon: Zap, color: 'text-yellow-400', border: 'hover:border-yellow-400/50' },
    { id: StyleModifier.VFX, label: '特效 / 魔法', icon: Sparkles, color: 'text-purple-400', border: 'hover:border-purple-400/50' },
    { id: StyleModifier.ATMOSPHERE, label: '氛围 / 情绪', icon: Cloud, color: 'text-cyan-400', border: 'hover:border-cyan-400/50' },
    { id: StyleModifier.LIGHTING, label: '灯光 / 光影', icon: Sun, color: 'text-orange-400', border: 'hover:border-orange-400/50' },
    { id: StyleModifier.CAMERA, label: '镜头 / 运镜', icon: Video, color: 'text-green-400', border: 'hover:border-green-400/50' },
    { id: StyleModifier.GENERAL, label: '通用 / 润色', icon: Palette, color: 'text-pink-400', border: 'hover:border-pink-400/50' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">增强方向</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => {
          const isSelected = selected.includes(style.id);
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`
                relative flex items-center gap-2 p-3 rounded-lg border text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-slate-800 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 ' + style.border}
              `}
            >
              <Icon size={16} className={isSelected ? style.color : 'text-slate-500'} />
              <span className={isSelected ? 'text-slate-100 font-medium' : ''}>{style.label}</span>
              {isSelected && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;