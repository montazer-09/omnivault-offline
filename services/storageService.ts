
import { UserSettings } from '../types';

const BASE_STORAGE_KEY = 'omnivault_data_';
const BASE_SETTINGS_KEY = 'omnivault_settings_';

// Helper to get keys based on current user
const getKeys = (userId: string) => ({
  data: `${BASE_STORAGE_KEY}${userId}`,
  settings: `${BASE_SETTINGS_KEY}${userId}`
});

export const storageService = {
  saveData: (userId: string, data: any) => {
    if (!userId) return;
    localStorage.setItem(getKeys(userId).data, JSON.stringify(data));
  },
  
  loadData: (userId: string): any => {
    if (!userId) return null;
    const data = localStorage.getItem(getKeys(userId).data);
    return data ? JSON.parse(data) : {
      tasks: [],
      notes: [{
        id: '1',
        title: 'مرحباً بك في الخزنة',
        content: '<div>هذه مساحتك الخاصة والآمنة. ابدأ بإضافة مهامك أو ملاحظاتك السرية.</div>',
        updatedAt: Date.now(),
        attachments: []
      }],
      habits: [],
      files: [],
      goals: [],
      voiceNotes: [],
      points: 0
    };
  },

  saveSettings: (userId: string, settings: UserSettings) => {
    if (!userId) return;
    localStorage.setItem(getKeys(userId).settings, JSON.stringify(settings));
  },

  loadSettings: (userId: string): UserSettings => {
    if (!userId) return {
      userName: "Agent",
      theme: 'neon',
      fontSize: 'medium',
      fontStyle: 'modern',
      language: 'ar' // Default to Arabic if unknown
    };
    
    const settings = localStorage.getItem(getKeys(userId).settings);
    // Default to Arabic ('ar') for new users for better UX based on request
    return settings ? JSON.parse(settings) : {
      userName: "العميل",
      theme: 'neon',
      fontSize: 'medium',
      fontStyle: 'modern',
      language: 'ar'
    };
  },

  exportVault: (userId: string) => {
    const data = storageService.loadData(userId);
    const settings = storageService.loadSettings(userId);
    const blob = new Blob([JSON.stringify({ data, settings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnivault_backup_${userId.substring(0, 6)}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }
};
