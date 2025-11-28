import React, { useRef } from 'react';
import { Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { ImageReference } from '../types';

interface ImageUploaderProps {
  label: string;
  image: ImageReference | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  heightClass?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  image, 
  onUpload, 
  onRemove,
  heightClass = "h-48"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      
      {image ? (
        <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-700 group`}>
          <img 
            src={image.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
              onClick={onRemove}
              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-transform transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDrop}
          className={`w-full ${heightClass} border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group`}
        >
          <div className="p-3 rounded-full bg-slate-800 group-hover:bg-blue-500/20 mb-3 transition-colors">
            <UploadCloud className="text-slate-400 group-hover:text-blue-400" size={24} />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-200">点击或拖拽上传图片</span>
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;