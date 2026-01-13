
import React, { useState } from 'react';
import { Habit } from '../types';
import { getTranslation } from '../services/i18n';

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
  lang: string;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onUpdate, lang }) => {
  const [newHabit, setNewHabit] = useState("");
  const t = (key: any) => getTranslation(lang, key);
  const today = new Date().toISOString().split('T')[0];

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      completedDays: [],
      streak: 0
    };
    onUpdate([...habits, habit]);
    setNewHabit("");
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDays.includes(today);
        const newDays = isCompleted 
          ? h.completedDays.filter(d => d !== today)
          : [...h.completedDays, today];
        return { ...h, completedDays: newDays, streak: newDays.length };
      }
      return h;
    });
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <form onSubmit={addHabit} className="flex space-x-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder={t('habit_placeholder')}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 rounded-2xl transition-colors">
          <i className="fas fa-plus"></i>
        </button>
      </form>

      <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar">
        {habits.map(habit => {
          const isDone = habit.completedDays.includes(today);
          return (
            <div key={habit.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{habit.name}</h4>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">{t('streak')}: {habit.streak} {t('days')}</span>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < habit.streak % 5 ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleHabit(habit.id)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isDone ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <i className={`fas fa-check text-lg ${isDone ? 'text-white' : 'text-white/10'}`}></i>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
