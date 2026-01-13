
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  attachments?: string[]; // Base64 or IDs
  isLocked?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO dates
  streak: number;
}

export interface Goal {
  id: string;
  text: string;
  type: 'daily' | 'weekly';
  completed: boolean;
  createdAt: number;
}

export interface VoiceNote {
  id: string;
  title: string;
  audioData: string; // Base64
  duration: number;
  createdAt: number;
}

export interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64
  createdAt: number;
}

export type View = 'dashboard' | 'tasks' | 'notes' | 'habits' | 'vault' | 'pomodoro' | 'voice' | 'stats' | 'settings' | 'goals';

export type Language = 'en' | 'ar' | 'fr';

export type ThemeType = 'neon' | 'arctic' | 'midnight' | 'sepia' | 'gold';

export type FontStyle = 'modern' | 'mono' | 'classic';

export interface UserAccount {
  username: string;
  passwordHash: string;
  createdAt: number;
  data: {
    tasks: Task[];
    notes: Note[];
    habits: Habit[];
    files: VaultFile[];
    goals: Goal[];
    voiceNotes: VoiceNote[];
    points: number;
  };
}

export interface UserSettings {
  userName: string;
  theme: ThemeType;
  fontSize: 'small' | 'medium' | 'large';
  fontStyle: FontStyle;
  language: Language;
}
