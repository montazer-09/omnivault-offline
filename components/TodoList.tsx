
import React, { useState } from 'react';
import { Task } from '../types';
import { getTranslation } from '../services/i18n';

interface TodoListProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  lang: string;
}

export const TodoList: React.FC<TodoListProps> = ({ tasks, onUpdate, lang }) => {
  const [input, setInput] = useState("");
  const t = (key: any) => getTranslation(lang, key);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      createdAt: Date.now(),
    };
    onUpdate([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('task_placeholder')}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        <button type="submit" className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-3.5 text-emerald-400 hover:text-emerald-300`}>
          <i className="fas fa-plus-circle text-2xl"></i>
        </button>
      </form>
      
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-white/20 italic">
            {t('no_tasks')}
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center group bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all animate-fadeIn"
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-emerald-400'
                }`}
              >
                {task.completed && <i className="fas fa-check text-[10px] text-white"></i>}
              </button>
              <span className={`mx-4 flex-1 text-sm md:text-base ${task.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
                {task.text}
              </span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
