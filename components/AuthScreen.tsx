
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { getTranslation } from '../services/i18n';

interface AuthScreenProps {
  onLogin: (user: any) => void;
  lang: string;
  setLang: (lang: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, lang, setLang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = (key: any) => getTranslation(lang, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Try Supabase first
        const { data, error } = await authService.signIn(email, password);
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await authService.signUp(email, password);
        if (error) throw error;
        if (data.user) onLogin(data.user);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback for demo purposes if Supabase keys are invalid
      if (err.message.includes('API key') || err.message.includes('fetch')) {
         setError(lang === 'ar' ? 'وضع غير متصل (Offline Demo)' : 'Offline Mode Active');
         // Simulate login with a fake user ID generated from email
         setTimeout(() => onLogin({ id: btoa(email), email }), 1000);
      } else {
         setError(lang === 'ar' ? 'فشل التحقق: تأكد من البيانات' : 'Authentication Failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05080d] p-6 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative z-10">
        
        {/* Language Toggle */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <div className="flex space-x-2 rtl:space-x-reverse">
                <button onClick={() => setLang('ar')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${lang === 'ar' ? 'bg-emerald-500 text-white' : 'text-white/30'}`}>AR</button>
                <button onClick={() => setLang('en')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-emerald-500 text-white' : 'text-white/30'}`}>EN</button>
            </div>
            <i className="fas fa-shield-halved text-emerald-500/20 text-2xl"></i>
        </div>

        <div className="mt-12 text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
            <i className="fas fa-fingerprint text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">OMNIVAULT</h1>
          <p className="text-white/40 text-sm font-medium">{t('system_access')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">{t('username')}</label>
            <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-all text-left"
                  placeholder="agent@omnivault.com"
                  required
                />
                <i className={`fas fa-user absolute top-5 text-white/30 ${lang === 'ar' ? 'right-5' : 'left-5'}`}></i>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">{t('password')}</label>
            <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-all text-left"
                  placeholder="••••••••"
                  required
                />
                <i className={`fas fa-lock absolute top-5 text-white/30 ${lang === 'ar' ? 'right-5' : 'left-5'}`}></i>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? t('syncing') : (isLogin ? t('login') : t('create_account'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-white/40 text-xs font-bold hover:text-emerald-500 transition-colors uppercase tracking-widest"
          >
            {isLogin ? t('no_account') : t('already_account')}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Secure Encryption Protocol</p>
        </div>
      </div>
    </div>
  );
};
