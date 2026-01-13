
import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';
import { getTranslation } from '../services/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiAssistant: React.FC<{ context?: string, lang: string }> = ({ context, lang }) => {
  const t = (key: any) => getTranslation(lang, key);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('secure_line') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAssistantResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "Protocol failure." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Communication error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] px-5 py-4 text-sm leading-relaxed ${
              m.role === 'user' 
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/10' 
              : 'bg-white/5 text-white/90 border border-white/10'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 flex space-x-1.5 rtl:space-x-reverse">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="relative pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('intel_request')}
          className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-6 text-emerald-500 hover:text-emerald-400 disabled:opacity-30 transition-colors`}
        >
          <i className={`fas ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xl`}></i>
        </button>
      </form>
    </div>
  );
};
