
import React from 'react';

interface WidgetProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export const Widget: React.FC<WidgetProps> = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`glass-card p-6 flex flex-col h-full transition-all group hover:bg-white/[0.05] ${className}`}>
      <div className="flex items-center space-x-3 mb-6 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
          <i className={`fas ${icon} text-emerald-500 text-xs`}></i>
        </div>
        <h3 className="text-white/40 font-black text-[10px] uppercase tracking-widest-plus">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};
