import React from 'react';
import { AppSettings } from '../types';
import {
  X,
  User,
  Sun,
  Moon,
  Monitor,
  Bookmark,
  History,
  Info,
  ShieldCheck,
  ChevronRight,
  Settings,
  Type,
  RefreshCw,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenProfile,
  onOpenSaved,
  savedCount,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  const handleSelectTheme = (theme: 'light' | 'dark' | 'system') => {
    onThemeChange(theme);
    const updated = { ...settings, theme };
    onSaveSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#E09F3E]/15 text-[#E09F3E]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                Einstellungen
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Lightflow PWA • Deine Schaltzentrale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          
          {/* 1. Profil bearbeiten */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 transition-all shadow-sm flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#E09F3E] group-hover:bg-[#E09F3E] group-hover:text-slate-950 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                  Profil bearbeiten
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Beruf, Denkweise, Lebenssituation & Glaube
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#E09F3E] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* 2. Dark-, Lightmode oder Automatisch */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Erscheinungsbild
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectTheme('light')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Hell</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('dark')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dunkel</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('system')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <Monitor className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* 3. Schriftgröße (Ergonomie für ermüdete Augen) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Type className="w-4 h-4 text-[#E09F3E]" />
                <span>Schriftgröße</span>
              </div>
              <span className="text-[11px] text-stone-400">
                {settings.fontSize === 'sm' ? 'Kompakt' : settings.fontSize === 'lg' ? 'Groß (Feierabend)' : 'Standard'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const updated = { ...settings, fontSize: 'sm' as const };
                  onSaveSettings(updated);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  settings.fontSize === 'sm'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <span className="text-xs font-bold">A-</span>
                <span className="text-[10px]">14px</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const updated = { ...settings, fontSize: 'md' as const };
                  onSaveSettings(updated);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  (settings.fontSize || 'md') === 'md'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <span className="text-sm font-bold">A</span>
                <span className="text-[10px]">16px</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const updated = { ...settings, fontSize: 'lg' as const };
                  onSaveSettings(updated);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  settings.fontSize === 'lg'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                    : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                }`}
              >
                <span className="text-base font-bold">A+</span>
                <span className="text-[10px]">18px</span>
              </button>
            </div>
          </div>

          {/* 4. Bibliothek & Historie */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSaved();
              }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 text-left transition-all shadow-sm flex items-center space-x-2.5 group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#E09F3E] group-hover:bg-[#E09F3E] group-hover:text-slate-950 transition-colors">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                  Bibliothek
                </div>
                <div className="text-[10px] text-stone-400">
                  {savedCount} Favoriten
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSaved();
              }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 text-left transition-all shadow-sm flex items-center space-x-2.5 group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <History className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                  Historie
                </div>
                <div className="text-[10px] text-stone-400">
                  Letzte Flüsse
                </div>
              </div>
            </button>
          </div>

          {/* 5. Version der App */}
          <div className="p-3 rounded-2xl bg-stone-100/70 dark:bg-slate-900/50 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-stone-400" />
              <span>Version der App</span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-[#B45309] dark:text-[#FDE68A] bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              v1.8.0 (PWA Live)
            </span>
          </div>

          {/* 6. Wartung: App-Cache leeren & neu laden */}
          <div className="pt-1">
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Möchtest du den App-Cache leeren und Lightflow frisch neu laden? (Gespeicherte Favoriten bleiben erhalten)')) {
                  try {
                    // Caches leeren
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      await Promise.all(keys.map((k) => caches.delete(k)));
                    }
                    // Service Worker unregistrieren
                    if ('serviceWorker' in navigator) {
                      const registrations = await navigator.serviceWorker.getRegistrations();
                      for (const reg of registrations) {
                        await reg.unregister();
                      }
                    }
                    // Temporäre Caches im Storage bereinigen (Cache-Schlüssel der Reports)
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith('lf_cache_')) {
                        localStorage.removeItem(key);
                      }
                    });
                  } catch (e) {
                    console.warn('Cache-Bereinigung:', e);
                  }
                  window.location.reload();
                }
              }}
              className="w-full p-3 rounded-2xl bg-stone-100/80 hover:bg-red-500/10 text-stone-600 hover:text-red-600 dark:bg-slate-900/60 dark:hover:bg-red-500/20 dark:text-stone-400 dark:hover:text-red-400 border border-stone-200 dark:border-slate-800 hover:border-red-500/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>App-Cache leeren & neu laden</span>
            </button>
          </div>

          {/* 7. Zu unterst: Privat & werbefrei */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold">Privat und werbefrei:</span> Dein Verbindungsprofil und deine Notizen bleiben geschützt auf deinem Smartphone.
            </div>
          </div>

        </div>

        {/* Schließen Button */}
        <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] rounded-xl transition-all cursor-pointer shadow-sm text-center"
          >
            Fertig
          </button>
        </div>

      </div>
    </div>
  );
};
