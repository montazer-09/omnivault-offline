
import React, { useState, useEffect } from 'react';
import { getTranslation } from '../services/i18n';

export const ClockWidget: React.FC<{ userName: string, lang: string }> = ({ userName, lang }) => {
  const [time, setTime] = useState(new Date());
  const t = (key: any) => getTranslation(lang, key);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const hour = time.getHours();
  const greeting = hour < 12 ? t('good_morning') : hour < 18 ? t('good_afternoon') : t('good_evening');

  return (
    <div className="flex flex-col items-center md:items-start justify-center h-full space-y-2">
      <div className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums leading-none">
        {formatTime(time)}
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-500/60 font-black text-xs uppercase tracking-widest">
        <span>{formatDate(time)}</span>
        <span className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
        <span>Secure Session</span>
      </div>
      <div className="mt-4 text-xl font-light text-white/70">
        {greeting}, <span className="font-bold text-white">{userName}</span>
      </div>
    </div>
  );
};
