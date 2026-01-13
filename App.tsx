
import React, { useState, useEffect } from 'react';
import { ClockWidget } from './components/ClockWidget';
import { TodoList } from './components/TodoList';
import { NotesWidget } from './components/NotesWidget';
import { GeminiAssistant } from './components/GeminiAssistant';
import { HabitTracker } from './components/HabitTracker';
import { FileVault } from './components/FileVault';
import { Settings } from './components/Settings';
import { GoalsWidget } from './components/GoalsWidget';
import { Widget } from './components/Widget';
import { AuthScreen } from './components/AuthScreen';
import { View, UserSettings, UserAccount, Task, Note, Goal } from './types';
import { getTranslation } from './services/i18n';
import { storageService } from './services/storageService';
import { getVaultInsights } from './services/geminiService';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [view, setView] = useState<View>('dashboard');
  const [userData, setUserData] = useState<UserAccount['data'] | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
      userName: "Agent", theme: 'neon', fontSize: 'medium', fontStyle: 'modern', language: 'ar'
  });
  const [insights, setInsights] = useState<string>("");

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      // Check local session first for speed
      const localUser = authService.getLocalSession();
      if (localUser) {
        handleLoginSuccess(localUser);
      } else {
        // Check Supabase session
        const sbUser = await authService.getUser();
        if (sbUser) {
          handleLoginSuccess(sbUser);
        } else {
          setLoading(false);
        }
      }
    };
    initAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    authService.setLocalSession(loggedInUser);
    
    // Load User Data
    const loadedSettings = storageService.loadSettings(loggedInUser.id);
    const loadedData = storageService.loadData(loggedInUser.id);
    
    setSettings(loadedSettings);
    setUserData(loadedData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.signOut();
    authService.clearLocalSession();
    setUser(null);
    setUserData(null);
  };

  const t = (key: any) => getTranslation(settings.language, key);
  const isRTL = settings.language === 'ar';

  // Persistence Effects
  useEffect(() => {
    if (user && userData) {
      storageService.saveData(user.id, userData);
    }
  }, [userData, user]);

  useEffect(() => {
    if (user && settings) {
      storageService.saveSettings(user.id, settings);
    }
  }, [settings, user]);

  // AI Insights
  useEffect(() => {
    if (userData) {
      const fetchInsights = async () => {
        const text = await getVaultInsights(userData.tasks, userData.habits);
        setInsights(text);
      };
      fetchInsights();
    }
  }, [userData?.tasks.length, userData?.habits.length]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080d] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Initializing Core...</p>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (!user || !userData) {
    return <AuthScreen onLogin={handleLoginSuccess} lang={settings.language} setLang={(l) => setSettings({...settings, language: l as any})} />;
  }

  const updateTasks = (newTasks: Task[]) => setUserData(p => p ? ({ ...p, tasks: newTasks }) : p);
  const updateNotes = (newNotes: Note[]) => setUserData(p => p ? ({ ...p, notes: newNotes }) : p);
  const updateGoals = (newGoals: Goal[], newPoints: number) => setUserData(p => p ? ({ ...p, goals: newGoals, points: newPoints }) : p);

  const navItems = [
    { id: 'dashboard', icon: 'fa-house', label: t('overview') },
    { id: 'tasks', icon: 'fa-list-check', label: t('tasks') },
    { id: 'notes', icon: 'fa-memo', label: t('notes') },
    { id: 'vault', icon: 'fa-vault', label: t('vault') },
    { id: 'settings', icon: 'fa-gear', label: t('settings') }
  ];

  return (
    <div className={`min-h-screen bg-[#05080d] text-white flex flex-col md:flex-row ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-24 lg:w-64 flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50">
        <div className="p-8 flex items-center justify-center lg:justify-start space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i className="fas fa-shield-halved text-white"></i>
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter text-emerald-500 italic">OMNIVAULT</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-4">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setView(item.id as View)}
              className={`w-full p-4 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse transition-all ${view === item.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4">
           <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
              <i className="fas fa-power-off lg:mr-2"></i> <span className="hidden lg:inline">{t('logout')}</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-24 md:pb-0">
        {/* Mobile Header */}
        <header className="px-6 py-6 md:px-12 md:py-8 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 shrink-0 z-40">
          <div>
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest-plus mb-1 opacity-70">
              {t('active_agent')}: {settings.userName}
            </h2>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter capitalize">{t(view as any)}</h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-black text-white/30 uppercase">{t('points')}</p>
              <p className="text-emerald-500 font-black text-lg">{userData.points}</p>
            </div>
            <button onClick={handleLogout} className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-red-400">
               <i className="fas fa-power-off text-sm"></i>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {view === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                {/* AI Insight Card */}
                <div className="md:col-span-12">
                  <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-l-4 border-emerald-500 active-glow">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                      <i className="fas fa-brain-circuit text-emerald-500 text-2xl"></i>
                    </div>
                    <div className="flex-1 text-center md:text-left rtl:md:text-right">
                      <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed italic">"{insights}"</p>
                      <div className="mt-2 flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Vault AI Assistant</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[9px] text-white/30 uppercase">Status: Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 h-[300px]">
                  <Widget title={t('chronos')} icon="fa-clock" className="h-full">
                    <ClockWidget userName={settings.userName} lang={settings.language} />
                  </Widget>
                </div>

                <div className="md:col-span-7 h-[300px]">
                  <Widget title={t('daily_goals')} icon="fa-bullseye">
                    <GoalsWidget goals={userData.goals} points={userData.points} onUpdate={updateGoals} lang={settings.language} />
                  </Widget>
                </div>

                <div className="md:col-span-8 h-auto min-h-[400px]">
                  <Widget title={t('tasks')} icon="fa-list-check">
                    <TodoList tasks={userData.tasks} onUpdate={updateTasks} lang={settings.language} />
                  </Widget>
                </div>

                <div className="md:col-span-4 h-auto min-h-[400px]">
                  <Widget title="VaultAI" icon="fa-comment">
                    <GeminiAssistant context={`Pending tasks: ${userData.tasks.filter(t=>!t.completed).length}`} lang={settings.language} />
                  </Widget>
                </div>
              </div>
            )}

            {view === 'tasks' && <div className="h-[75vh]"><Widget title={t('tasks')} icon="fa-list-check"><TodoList tasks={userData.tasks} onUpdate={updateTasks} lang={settings.language} /></Widget></div>}
            {view === 'notes' && <div className="h-[75vh]"><NotesWidget notes={userData.notes} files={userData.files} onUpdate={updateNotes} lang={settings.language} /></div>}
            {view === 'vault' && <div className="h-[75vh]"><Widget title={t('vault')} icon="fa-server"><FileVault files={userData.files} onUpdate={(f) => setUserData(p => p ? ({...p, files: f}) : p)} lang={settings.language} /></Widget></div>}
            {view === 'settings' && <div className="h-[75vh]"><Widget title={t('settings')} icon="fa-gear"><Settings settings={settings} onUpdate={setSettings} onDataExport={() => storageService.exportVault(user.id)} onDataImport={() => {}} lang={settings.language} currentUser={user} /></Widget></div>}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 nav-blur border-t border-white/10 px-6 py-4 flex items-center justify-between z-[100] safe-bottom">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id as View)}
            className={`bottom-nav-item ${view === item.id ? 'text-emerald-500 scale-110' : 'text-white/30'}`}
          >
            <i className={`fas ${item.icon} text-lg mb-1`}></i>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
