import React from 'react';
import { UserProfile } from '../types';
import { Moon, Sun, User, Bookmark, Settings } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  darkMode,
  onToggleDarkMode,
  onOpenProfile,
  onOpenSaved,
  onOpenSettings,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200 safe-area-header">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-0 min-h-16 flex items-center justify-between">
        
        {/* Logo & Marken-Metapher */}
        <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-1.5 shadow-md shadow-[#E09F3E]/10 flex items-center justify-center border border-[#E09F3E]/30 overflow-hidden">
            {/* Sanftes Glühen im Hintergrund */}
            <div className="absolute inset-0 bg-[#E09F3E]/10 blur-sm rounded-xl"></div>
            
            {/* Feine vertikale Lichtleiter-Linie */}
            <svg viewBox="0 0 40 40" className="w-full h-full relative z-10" fill="none">
              <path
                d="M 20 4 C 20 12, 24 16, 24 22 C 24 28, 16 30, 16 34"
                stroke="url(#headerWaveGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="4" r="1.5" fill="#FFFBEB" />
              <circle cx="16" cy="34" r="3" fill="#F59E0B" className="animate-light-pulse" />
              <circle cx="16" cy="34" r="1.5" fill="#FFFBEB" />
              <defs>
                <linearGradient id="headerWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#FFFBEB" />
                  <stop offset="60%" stop-color="#F59E0B" />
                  <stop offset="100%" stop-color="#E09F3E" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#F1F5F9]">
                Lightflow
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E09F3E]/15 text-[#E09F3E] border border-[#E09F3E]/30 hidden sm:inline-block">
                PWA
              </span>
            </div>
            
            {/* Live-Status: Verbunden mit der Quelle */}
            <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
              </span>
              <span className="text-[11px] font-medium text-[#B45309] dark:text-[#FDE68A]">
                Verbunden mit der Quelle
              </span>
            </div>
          </div>
        </div>

        {/* Rechte Navigation & Interaktions-Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Profil Button mit Kurzbeschreibung */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-200/60 dark:bg-slate-800/80 hover:bg-[#E09F3E]/15 dark:hover:bg-slate-700/80 text-stone-700 dark:text-stone-200 border border-stone-300/60 dark:border-slate-700/80 transition-all cursor-pointer"
            title="Verbindungsprofil anpassen"
          >
            <User className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span className="hidden md:inline max-w-[130px] truncate">
              {profile.profession || 'Profil'}
            </span>
            <span className="md:hidden">Profil</span>
          </button>

          {/* Gespeicherte Berichte */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Gespeicherte Lichtfluss-Berichte"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#E09F3E] text-[10px] font-bold text-slate-900 shadow-sm">
                {savedCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Heller Sandweiß-Modus' : 'Dunkler Tiefsee-Modus'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Einstellungen */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Einstellungen & API-Schlüssel"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
