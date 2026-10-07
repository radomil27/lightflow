/**
 * Lightflow Storage Service
 * Verwaltet das lokale Verbindungsprofil, gespeicherte Reports und Einstellungen
 * im Browser-localStorage (keine Cloud-/Registrierungspflicht).
 */

import { UserProfile, LightflowReport, AppSettings } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'lightflow_user_profile_v1',
  REPORTS: 'lightflow_saved_reports_v1',
  SETTINGS: 'lightflow_app_settings_v1',
  ONBOARDING: 'lightflow_onboarding_completed_v1',
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  displayName: '',
  gender: 'male',
  faithStage: 'disciple',
  journeyStage: 'Mitten im Alltag & Nachfolge',
  profession: 'Handwerk, Montage & Bau',
  professionDetail: '',
  mindset: 'Lösungsorientiert & Pragmatisch',
  relationshipStatus: 'Single / Alleinlebend',
  dailyMood: 'Unter Druck / Erschöpft',
  hasCompletedOnboarding: false,
};

export function normalizeFaithStage(stage?: string | null): 'seeker' | 'disciple' | 'exhausted' {
  if (!stage) return 'disciple';
  const lower = stage.toLowerCase();
  if (lower === 'seeker' || lower.includes('such') || lower.includes('zweifel')) return 'seeker';
  if (lower === 'exhausted' || lower.includes('müde') || lower.includes('ausgebrannt') || lower.includes('ausgelaugt')) return 'exhausted';
  return 'disciple';
}

export function getStoredOnboardingStatus(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  } catch {
    return false;
  }
}

export function setStoredOnboardingStatus(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, completed ? 'true' : 'false');
  } catch (e) {
    console.error('Fehler beim Speichern des Onboarding-Status:', e);
  }
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  fontSize: 'md',
  bibleTranslation: 'SCH',
  apiProvider: 'gemini',
  selectedModel: 'gemini-1.5-flash',
  speechEnabled: false,
  speechProvider: 'google',
  speechApiKey: '',
};

// Profil abrufen
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    const profile = { ...DEFAULT_USER_PROFILE, ...parsed };
    // Sicherheitsprüfung: Niemals leeres Profil oder fehlerhaftes IT-Mock verwenden
    if (!profile.profession || profile.profession.trim().length === 0) {
      profile.profession = DEFAULT_USER_PROFILE.profession;
      profile.professionDetail = DEFAULT_USER_PROFILE.professionDetail;
    }
    return profile;
  } catch (e) {
    console.warn('Konnte Profil nicht aus localStorage laden:', e);
    return DEFAULT_USER_PROFILE;
  }
}

// Profil speichern
export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Fehler beim Speichern des Profils:', e);
  }
}

// Gespeicherte Reports laden
export function getStoredReports(): LightflowReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Konnte Berichte nicht aus localStorage laden:', e);
    return [];
  }
}

// Report speichern oder aktualisieren
export function saveReport(report: LightflowReport): void {
  try {
    const existing = getStoredReports();
    const index = existing.findIndex((r) => r.id === report.id);
    let updated: LightflowReport[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = report;
    } else {
      updated = [report, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Fehler beim Speichern des Reports:', e);
  }
}

// Report löschen
export function deleteReport(id: string): void {
  try {
    const existing = getStoredReports();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Fehler beim Löschen des Reports:', e);
  }
}

// Einstellungen abrufen
export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

// Einstellungen speichern
export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Fehler beim Speichern der Settings:', e);
  }
}
