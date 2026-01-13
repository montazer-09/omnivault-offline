
import { supabase } from './supabase';
import { storageService } from './storageService';

export const authService = {
  async signUp(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    return { data, error };
  },

  async signIn(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  
  // حفظ الجلسة محلياً للسرعة في حالة عدم استخدام Supabase
  setLocalSession(user: any) {
    localStorage.setItem('omnivault_session', JSON.stringify(user));
  },

  getLocalSession() {
    const session = localStorage.getItem('omnivault_session');
    return session ? JSON.parse(session) : null;
  },

  clearLocalSession() {
    localStorage.removeItem('omnivault_session');
  }
};
