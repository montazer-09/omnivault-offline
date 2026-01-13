
import React from 'react';
import { Task, Habit } from '../types';
import { getTranslation } from '../services/i18n';

export const Analytics: React.FC<{ tasks: Task[], habits: Habit[], lang: string }> = ({ tasks, habits, lang }) => {
  const t = (key: any) => getTranslation(lang, key);
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  return (
    <div className="p-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">{t('stats_tasks')}</h4>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="439.6" strokeDashoffset={439.6 - (439.6 * taskRate) / 100} strokeLinecap="round" className="text-emerald-500 transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{Math.round(taskRate)}%</span>
            </div>
          </div>
          <p className="mt-6 text-white/40 text-xs font-bold uppercase">{completedTasks} / {tasks.length} Completed</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 text-center">{t('stats_habits')}</h4>
          <div className="space-y-4">
            {habits.slice(0, 4).map(h => (
              <div key={h.id}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-white/60">{h.name}</span>
                  <span className="text-emerald-500">{h.streak} Days</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(h.streak * 10, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
