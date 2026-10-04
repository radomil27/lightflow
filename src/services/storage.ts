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
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  profession: 'Küchenmonteur / Handwerk',
  mindset: 'Lösungsorientiert & Analytisch',
  relationshipStatus: 'Single / Alleinlebend',
  faithStage: 'Im Zweifel & Sucht Antworten',
  journeyStage: 'Im Zweifel & Sucht Antworten',
  dailyMood: 'Unter Druck / Erschöpft',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  apiProvider: 'gemini',
  selectedModel: 'gemini-1.5-flash',
};

// Profil abrufen
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
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
