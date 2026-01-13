
import React, { useState } from 'react';
import { Goal } from '../types';
import { getTranslation } from '../services/i18n';

interface GoalsWidgetProps {
  goals: Goal[];
  points: number;
  onUpdate: (goals: Goal[], points: number) => void;
  lang: string;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ goals, points, onUpdate, lang }) => {
  const [input, setInput] = useState("");
  const [type, setType] = useState<'daily' | 'weekly'>('daily');
  const t = (key: any) => getTranslation(lang, key);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: input,
      type,
      completed: false,
      createdAt: Date.now()
    };
    onUpdate([newGoal, ...goals], points);
    setInput("");
  };

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const isNowCompleted = !goal.completed;
    const newPoints = points + (isNowCompleted ? (goal.type === 'daily' ? 10 : 50) : (goal.type === 'daily' ? -10 : -50));
    const newGoals = goals.map(g => g.id === id ? { ...g, completed: isNowCompleted } : g);
    onUpdate(newGoals, Math.max(0, newPoints));
  };

  const deleteGoal = (id: string) => {
    onUpdate(goals.filter(g => g.id !== id), points);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('points')}</span>
        <span className="text-xl font-black text-white">{points}</span>
      </div>

      <div className="flex space-x-2 mb-2 rtl:space-x-reverse">
        <button onClick={() => setType('daily')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${type === 'daily' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30'}`}>{t('daily_goals')}</button>
        <button onClick={() => setType('weekly')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${type === 'weekly' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30'}`}>{t('weekly_goals')}</button>
      </div>

      <form onSubmit={addGoal} className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('goal_placeholder')}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500"
        />
        <button type="submit" className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-3.5 text-emerald-500`}><i className="fas fa-plus-circle text-2xl"></i></button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {goals.filter(g => g.type === type).length === 0 ? (
          <p className="text-center py-8 text-white/10 italic">{t('no_goals')}</p>
        ) : (
          goals.filter(g => g.type === type).map(goal => (
            <div key={goal.id} className="flex items-center bg-white/5 p-4 rounded-2xl border border-white/5 group">
              <button onClick={() => toggleGoal(goal.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${goal.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                {goal.completed && <i className="fas fa-check text-[10px] text-white"></i>}
              </button>
              <span className={`mx-4 flex-1 text-sm ${goal.completed ? 'text-white/20 line-through' : 'text-white/80'}`}>{goal.text}</span>
              <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-500 transition-all"><i className="fas fa-trash-alt"></i></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
