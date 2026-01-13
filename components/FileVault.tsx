
import React, { useState } from 'react';
import { VaultFile } from '../types';
import { getTranslation } from '../services/i18n';

interface FileVaultProps {
  files: VaultFile[];
  onUpdate: (files: VaultFile[]) => void;
  lang: string;
}

export const FileVault: React.FC<FileVaultProps> = ({ files, onUpdate, lang }) => {
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const t = (key: any) => getTranslation(lang, key);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newFile: VaultFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target?.result as string,
        createdAt: Date.now()
      };
      onUpdate([newFile, ...files]);
    };
    reader.readAsDataURL(file);
  };

  const deleteFile = (id: string) => {
    onUpdate(files.filter(f => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-emerald-500/30 transition-all group cursor-pointer relative shrink-0">
        <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <i className="fas fa-upload text-emerald-500 text-xl"></i>
        </div>
        <p className="text-white font-bold">{t('add_asset')}</p>
        <p className="text-white/30 text-[10px] mt-1 uppercase tracking-widest">{t('vault_support')}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-2 gap-4">
          {files.map(file => (
            <div key={file.id} onClick={() => setPreviewFile(file)} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col relative group cursor-pointer hover:bg-white/10 transition-all">
              <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} w-7 h-7 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10`}>
                <i className="fas fa-times text-xs"></i>
              </button>
              
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3">
                <i className={`fas ${file.type.startsWith('video/') ? 'fa-play-circle' : file.type.startsWith('image/') ? 'fa-image' : 'fa-file-alt'} text-emerald-500 text-lg`}></i>
              </div>
              
              <p className="text-white text-xs font-bold truncate w-full mb-1">{file.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[9px] uppercase">{(file.size / 1024).toFixed(1)} KB</span>
                <span className="text-emerald-500/40 text-[9px] font-black">{t('encrypted')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-emerald-500 uppercase tracking-widest">{previewFile.name}</h3>
            <button onClick={() => setPreviewFile(null)} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
              <i className="fas fa-times text-white text-lg"></i>
            </button>
          </div>
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center p-4">
            {previewFile.type.startsWith('image/') ? (
              <img src={previewFile.data} alt={previewFile.name} className="max-w-full max-h-full object-contain rounded-2xl" />
            ) : previewFile.type.startsWith('video/') ? (
              <video src={previewFile.data} controls className="max-w-full max-h-full rounded-2xl" />
            ) : (
              <div className="text-center p-12">
                <i className="fas fa-file-shield text-8xl text-emerald-500/20 mb-6"></i>
                <p className="text-white/60 italic text-lg mb-8">{t('preview_unavailable')}</p>
                <a href={previewFile.data} download={previewFile.name} className="inline-block px-10 py-5 bg-emerald-600 rounded-[2rem] text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-600/20">
                  {t('download_decrypted')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
