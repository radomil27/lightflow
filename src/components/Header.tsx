import React from 'react';
import { UserProfile } from '../types';
import { Moon, Sun, User, Bookmark, Settings, Users, Flame } from 'lucide-react';
import { getCircadianTheme } from '../services/circadianService';

interface HeaderProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  onOpenCircle: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  darkMode,
  onToggleDarkMode,
  onOpenProfile,
  onOpenSaved,
  onOpenSettings,
  onOpenCircle,
  savedCount,
}) => {
  const circadian = getCircadianTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-stone-50/85 dark:bg-[#0B0F15]/85 border-b border-stone-200/70 dark:border-white/[0.06] transition-colors duration-[2000ms] safe-area-header">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 min-h-16 flex items-center justify-between">
        
        {/* Logo & circadiane Marken-Metapher */}
        <div 
          className="flex items-center space-x-3.5 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative">
            {/* Atmender Circadian-Lichtschein hinter dem Logo */}
            <div 
              className="absolute -inset-2 rounded-2xl animate-ambient-pulse pointer-events-none"
              style={{ backgroundColor: circadian.glowColor }}
            />
            
            <div className="relative w-10 h-10 rounded-2xl bg-white dark:bg-stone-900 p-1 shadow-md shadow-[#E09F3E]/10 flex items-center justify-center border border-stone-200/90 dark:border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <img
                src="/icon-192x192.png"
                alt="Lightflow Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Lightflow
              </span>
            </div>
            
            {/* Circadianer Subtitel: Organisch zur Tageszeit */}
            <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400">
              <Flame className="w-3 h-3 text-[#E09F3E]" />
              <span className="text-[11px] font-medium text-amber-800 dark:text-amber-200/80">
                {circadian.greeting} • {circadian.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Rechte Navigation & Interaktions-Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Circle of 4: Vertrauter Kreis */}
          <button
            onClick={onOpenCircle}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-[#B45309] dark:text-[#FDE68A] border border-amber-500/25 transition-all cursor-pointer"
            title="Vertrauter Kreis (Circle of 4)"
          >
            <Users className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span className="hidden sm:inline">Kreis</span>
          </button>

          {/* Profil Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-200/60 dark:bg-white/[0.05] hover:bg-[#E09F3E]/15 dark:hover:bg-white/[0.1] text-stone-700 dark:text-stone-200 border border-stone-300/60 dark:border-white/[0.08] transition-all cursor-pointer"
            title="Verbindungsprofil anpassen"
          >
            <User className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span className="hidden md:inline max-w-[120px] truncate">
              {profile.profession || 'Profil'}
            </span>
          </button>

          {/* Gespeicherte Berichte */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Gespeicherte Lichtfluss-Berichte"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#E09F3E] text-[10px] font-bold text-slate-950 shadow-sm">
                {savedCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title={darkMode ? 'Heller Sandweiß-Modus' : 'Dunkler Onyx-Modus'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Einstellungen */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Einstellungen & API-Schlüssel"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

