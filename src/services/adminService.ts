import { supabase, isSupabaseConfigured } from './supabase';
import { AppUser, AppFeedback, UserProfile } from '../types';
import { getOrCreateReferralCode, getStoredReferredBy, getStoredReports } from './storage';

const LOCAL_USERS_KEY = 'lightflow_users_v1';
const LOCAL_FEEDBACK_KEY = 'lightflow_feedbacks_v1';

// Seed-Demo-Nutzer für ein lebendiges Admin-Board falls noch keine Cloud/Daten vorhanden sind
const DEFAULT_DEMO_USERS: AppUser[] = [
  {
    id: 'usr_lukas',
    name: 'Lukas',
    referral_code: 'lukas101',
    referred_by_code: null,
    reports_count: 14,
    last_active_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'usr_sarah',
    name: 'Sarah',
    referral_code: 'sarah204',
    referred_by_code: 'lukas101',
    reports_count: 8,
    last_active_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'usr_matthias',
    name: 'Matthias',
    referral_code: 'matthi33',
    referred_by_code: 'sarah204',
    reports_count: 3,
    last_active_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'usr_miriam',
    name: 'Miriam',
    referral_code: 'miri77',
    referred_by_code: 'lukas101',
    reports_count: 19,
    last_active_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const DEFAULT_DEMO_FEEDBACKS: AppFeedback[] = [
  {
    id: 'fb_1',
    user_name: 'Sarah',
    message: 'Die Übertragung auf meinen Pflege-Alltag hat mich heute morgen extrem berührt. Danke für die ruhige Sprache!',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'new',
  },
  {
    id: 'fb_2',
    user_name: 'Lukas',
    message: 'Könnte man den Bibeltext im Posten 1 noch etwas größer anzeigen lassen? Sonst genial im Bauwagen.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'read',
  },
];

// 1. Lokale Fallback-Helfer
function getLocalUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

function saveLocalUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Lokale User konnten nicht gespeichert werden:', e);
  }
}

function getLocalFeedbacks(): AppFeedback[] {
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(DEFAULT_DEMO_FEEDBACKS));
      return DEFAULT_DEMO_FEEDBACKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_FEEDBACKS;
  }
}

function saveLocalFeedbacks(feedbacks: AppFeedback[]): void {
  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(feedbacks));
  } catch (e) {
    console.warn('Lokale Feedbacks konnten nicht gespeichert werden:', e);
  }
}

// 2. Synchronisation des aktuellen Nutzers (Heartbeat & Report-Counter)
export async function syncCurrentUser(profile: UserProfile): Promise<void> {
  const name = profile.displayName?.trim() || 'Anonym';
  const myCode = getOrCreateReferralCode(name);
  const referredBy = getStoredReferredBy();
  const reportsCount = getStoredReports().length;
  const now = new Date().toISOString();

  // A. Versuche Supabase falls konfiguriert
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('users').upsert(
        {
          id: myCode,
          name,
          referral_code: myCode,
          referred_by_code: referredBy,
          reports_count: reportsCount,
          last_active_at: now,
        },
        { onConflict: 'referral_code' }
      );
      if (!error) return;
      console.warn('Supabase User sync error, falling back to local:', error);
    } catch (e) {
      console.warn('Supabase connection error:', e);
    }
  }

  // B. Lokaler Fallback
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.referral_code === myCode);
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      name,
      reports_count: reportsCount,
      last_active_at: now,
      referred_by_code: referredBy || users[idx].referred_by_code,
    };
  } else {
    users.unshift({
      id: `usr_${myCode}`,
      name,
      referral_code: myCode,
      referred_by_code: referredBy,
      reports_count: reportsCount,
      last_active_at: now,
      created_at: now,
    });
  }
  saveLocalUsers(users);
}

// 3. Feedback absenden
export async function submitFeedback(userName: string, message: string): Promise<boolean> {
  if (!message.trim()) return false;
  const cleanName = userName.trim() || 'Freund';
  const now = new Date().toISOString();
  const newEntry: AppFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    user_name: cleanName,
    message: message.trim(),
    created_at: now,
    status: 'new',
  };

  // A. Versuche Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('feedbacks').insert({
        user_name: cleanName,
        message: message.trim(),
        created_at: now,
        status: 'new',
      });
      if (!error) return true;
      console.warn('Supabase Feedback error, using local:', error);
    } catch (e) {
      console.warn('Supabase connection error:', e);
    }
  }

  // B. Lokaler Fallback
  const feedbacks = getLocalFeedbacks();
  feedbacks.unshift(newEntry);
  saveLocalFeedbacks(feedbacks);
  return true;
}

// 4. Admin-Funktionen: Alle Nutzer abrufen
export async function fetchAdminUsers(): Promise<AppUser[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('last_active_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AppUser[];
      }
    } catch (e) {
      console.warn('Supabase fetchAdminUsers error:', e);
    }
  }
  return getLocalUsers();
}

// 5. Admin-Funktionen: Alle Feedbacks abrufen
export async function fetchAdminFeedbacks(): Promise<AppFeedback[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as AppFeedback[];
      }
    } catch (e) {
      console.warn('Supabase fetchAdminFeedbacks error:', e);
    }
  }
  return getLocalFeedbacks();
}

// 6. Admin-Funktionen: Feedback-Status aktualisieren / abhaken
export async function updateFeedbackStatus(
  id: string,
  status: 'new' | 'read' | 'resolved'
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('feedbacks').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateFeedbackStatus error:', e);
    }
  }

  const feedbacks = getLocalFeedbacks();
  const target = feedbacks.find((f) => f.id === id);
  if (target) {
    target.status = status;
    saveLocalFeedbacks(feedbacks);
  }
}

// 7. Admin-Funktionen: Feedback löschen
export async function deleteAdminFeedback(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('feedbacks').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteAdminFeedback error:', e);
    }
  }

  const feedbacks = getLocalFeedbacks().filter((f) => f.id !== id);
  saveLocalFeedbacks(feedbacks);
}
