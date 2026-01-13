
import React, { useEffect, useState } from 'react';
import { getDailyQuote } from '../services/geminiService';
import { getTranslation } from '../services/i18n';

export const DailyQuote: React.FC<{ lang: string }> = ({ lang }) => {
  const t = (key: any) => getTranslation(lang, key);
  const [quote, setQuote] = useState<string>(t('loading_quote'));

  useEffect(() => {
    const fetchQuote = async () => {
      const q = await getDailyQuote();
      setQuote(q);
    };
    fetchQuote();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <i className="fas fa-quote-left text-emerald-500/30 text-4xl mb-6"></i>
      <p className="text-white font-light text-xl md:text-2xl leading-relaxed mb-6 italic">
        {quote.split(' - ')[0]}
      </p>
      <span className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">
        {quote.split(' - ')[1] || "Anonymous"}
      </span>
    </div>
  );
};
