
import React, { useState, useEffect, useRef } from 'react';
import { getTranslation } from '../services/i18n';

interface PomodoroProps {
  lang: string;
  onComplete?: () => void;
}

export const Pomodoro: React.FC<PomodoroProps> = ({ lang, onComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const t = (key: any) => getTranslation(lang, key);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();
          if (onComplete) onComplete();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, minutes, seconds]);

  const switchMode = (m: 'focus' | 'short' | 'long') => {
    setMode(m);
    setIsActive(false);
    setSeconds(0);
    if (m === 'focus') setMinutes(25);
    else if (m === 'short') setMinutes(5);
    else setMinutes(15);
  };

  const progress = ((mode === 'focus' ? 25 : mode === 'short' ? 5 : 15) * 60 - (minutes * 60 + seconds)) / ((mode === 'focus' ? 25 : mode === 'short' ? 5 : 15) * 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-2xl rtl:space-x-reverse">
        <button onClick={() => switchMode('focus')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'focus' ? 'bg-emerald-500 text-white' : 'text-white/30'}`}>{t('pomodoro')}</button>
        <button onClick={() => switchMode('short')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'short' ? 'bg-emerald-500 text-white' : 'text-white/30'}`}>{t('short_break')}</button>
        <button onClick={() => switchMode('long')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'long' ? 'bg-emerald-500 text-white' : 'text-white/30'}`}>{t('long_break')}</button>
      </div>

      <div className="relative w-64 h-64 mb-10">
        <svg className="w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="120" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
          <circle cx="128" cy="128" r="120" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="753.6" strokeDashoffset={753.6 - (753.6 * progress) / 100} strokeLinecap="round" className="text-emerald-500 transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl font-black text-white tracking-tighter tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex space-x-4 rtl:space-x-reverse">
        <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}>
          <i className={`fas ${isActive ? 'fa-pause' : 'fa-play'} text-white text-2xl`}></i>
        </button>
        <button onClick={() => { setIsActive(false); switchMode(mode); }} className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
          <i className="fas fa-undo text-xl"></i>
        </button>
      </div>
    </div>
  );
};
