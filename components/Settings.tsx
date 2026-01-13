
import React, { useState } from 'react';
import { UserSettings, ThemeType, FontStyle, UserAccount } from '../types';
import { getTranslation } from '../services/i18n';

interface SettingsProps {
  settings: UserSettings;
  currentUser: UserAccount | null;
  onUpdate: (s: UserSettings) => void;
  onDataExport: () => void;
  onDataImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lang: string;
}

export const Settings: React.FC<SettingsProps> = ({ settings, currentUser, onUpdate, onDataExport, onDataImport, lang }) => {
  const [showQR, setShowQR] = useState(false);
  const t = (key: any) => getTranslation(lang, key);

  const qrUrl = currentUser ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ u: currentUser.username, p: currentUser.passwordHash }))}` : '';

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12">
      <section>
        <h3 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[11px] mb-6">{t('theme')}</h3>
        <div className="grid grid-cols-5 gap-3">
          {(['neon', 'arctic', 'midnight', 'sepia', 'gold'] as ThemeType[]).map(theme => (
            <button key={theme} onClick={() => onUpdate({ ...settings, theme })} className={`h-16 rounded-2xl border-2 transition-all capitalize text-[10px] font-bold ${settings.theme === theme ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
              {theme}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[11px] mb-6">{t('font_style')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['modern', 'mono', 'classic'] as FontStyle[]).map(style => (
            <button key={style} onClick={() => onUpdate({ ...settings, fontStyle: style })} className={`py-4 rounded-2xl border-2 transition-all capitalize text-[10px] font-bold ${settings.fontStyle === style ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
              {style}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
        <button onClick={onDataExport} className="py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center">
          <i className="fas fa-file-export mr-3"></i> {t('export_data')}
        </button>
        <label className="py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer">
          <i className="fas fa-file-import mr-3"></i> {t('import_data')}
          <input type="file" className="hidden" onChange={onDataImport} accept=".json" />
        </label>
        <button onClick={() => setShowQR(true)} className="col-span-2 py-5 bg-emerald-600 rounded-3xl text-white font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
          <i className="fas fa-qrcode mr-3"></i> {t('qr_share')}
        </button>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-fadeIn">
          <div className="bg-white p-6 rounded-[3rem] shadow-2xl mb-8">
             <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Vault Secure Access Token</p>
          <button onClick={() => setShowQR(false)} className="px-12 py-5 bg-white/10 rounded-3xl text-white font-black uppercase tracking-widest hover:bg-white/20">Close Matrix</button>
        </div>
      )}
      
      {/* Ad Placeholder for "Free" feeling */}
      <div className="mt-12 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center space-x-6 rtl:space-x-reverse opacity-50 grayscale hover:grayscale-0 transition-all">
         <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center"><i className="fas fa-ad text-emerald-500"></i></div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sponsored Upgrade</p>
            <p className="text-xs text-white/20 italic">"Security is paramount. Secure your cloud backup now."</p>
         </div>
      </div>
    </div>
  );
};
