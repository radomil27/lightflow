import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, ChevronUp, Compass, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { getCircadianTheme } from '../services/circadianService';
import { useLiquidTransition } from './LiquidWaveTransition';

interface InputSectionProps {
  passage: string;
  setPassage: (val: string) => void;
  selectedMood: string;
  onOpenMoodPicker: () => void;
  isLoading: boolean;
  profile?: UserProfile;
  onOpenPicker: () => void;
  hasActiveReport?: boolean;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  passage,
  setPassage,
  selectedMood: _selectedMood,
  onOpenMoodPicker,
  isLoading,
  onOpenPicker,
  hasActiveReport = false,
  isEditing = false,
  onCancelEdit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(hasActiveReport && !isEditing);
  const circadian = getCircadianTheme();
  const { triggerTransition } = useLiquidTransition();

  const handleNav = (action: () => void, e?: React.MouseEvent) => {
    let origin;
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      origin = { x, y };
    }
    triggerTransition(action, origin);
  };

  // Synchronisiere Collapse-Status
  React.useEffect(() => {
    if (isEditing) {
      setIsCollapsed(false);
    } else if (hasActiveReport) {
      setIsCollapsed(true);
    }
  }, [hasActiveReport, isEditing]);

  const hasPassage = passage.trim().length > 0;
  const isCtaReady = hasPassage && !isLoading;

  const handleClose = () => {
    setIsCollapsed(true);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCtaClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPassage || isLoading) return;
    onOpenMoodPicker();
  };

  // Wenn ein aktiver Report vorliegt und der Nutzer den Bereich eingeklappt hat:
  if (hasActiveReport && isCollapsed) {
    return null;
  }

  const impulse = circadian.dailyImpulse;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      {/* Wenn Report existiert, aber Bereich ausgeklappt ist */}
      {hasActiveReport && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Zurück zum Report</span>
          </button>
        </div>
      )}

      <form onSubmit={handleCtaClick} className="space-y-5">
        {/* Haupt-Eingabefeld */}
        <div className="relative group">
          <div 
            className="absolute -inset-1 rounded-3xl blur-xl opacity-35 group-hover:opacity-65 transition-opacity pointer-events-none"
            style={{ backgroundColor: circadian.glowColor }}
          />
          
          <div className="relative rounded-3xl bg-white/95 dark:bg-[#111622]/95 backdrop-blur-2xl border border-stone-200/90 dark:border-white/[0.08] p-3 sm:p-3.5 shadow-xl transition-all">
            <div
              onClick={onOpenPicker}
              className="flex items-center px-2 sm:px-3 py-1 cursor-pointer group/search"
              title="Klicken, um Bibeltext zu wählen"
            >
              <Search className="w-5 h-5 text-[#E09F3E] shrink-0 mr-3 group-hover/search:scale-110 transition-transform" />
              <input
                type="text"
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                readOnly
                onClick={(e) => handleNav(onOpenPicker, e)}
                placeholder="Bibelstelle wählen (z. B. Lukas 7,11)..."
                className="w-full py-2.5 text-base sm:text-lg bg-transparent border-none focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 font-serif cursor-pointer"
              />
              <button
                type="button"
                onClick={(e) => handleNav(onOpenPicker, e)}
                className="shrink-0 p-2 rounded-xl text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors"
                title="Bibel-Navigator öffnen"
              >
                <Compass className="w-5 h-5" />
              </button>
            </div>

            {/* Trennlinie */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E09F3E]/25 to-transparent my-1.5" />

            {/* CTA zur Tagesverfassung */}
            <div className="pt-1 px-1 flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400 pl-1 font-medium">
                {circadian.subGreeting}
              </span>

              <button
                type="submit"
                disabled={!isCtaReady}
                className={`px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-300 flex items-center space-x-1.5 shadow-md cursor-pointer ${
                  isLoading
                    ? 'bg-slate-800 text-amber-200 cursor-wait'
                    : !isCtaReady
                    ? 'bg-stone-200 dark:bg-white/[0.05] text-stone-400 dark:text-stone-500 border border-stone-300/50 dark:border-white/[0.05] cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#E09F3E] via-[#F59E0B] to-[#E09F3E] hover:brightness-110 text-slate-950 shadow-[#E09F3E]/25 hover:scale-[1.01]'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Generiert...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Weiter →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Das Wort des Tages: Radikal reduzierter, einzelner Leitvers */}
        <div className="pt-1">
          <div 
            onClick={(e) => {
              setPassage(impulse.passage);
              handleNav(onOpenMoodPicker, e);
            }}
            className="p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-[#111622]/60 border border-stone-200/70 dark:border-white/[0.06] hover:border-amber-500/40 hover:bg-white dark:hover:bg-[#111622]/90 backdrop-blur-md transition-all group cursor-pointer shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-[#E09F3E] border border-amber-500/20">
                  {circadian.badgeLabel} • {impulse.dimension}
                </span>
                <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {impulse.passage}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#E09F3E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span className="hidden sm:inline">Beleuchten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-[#E09F3E] transition-colors">
              {impulse.title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              {impulse.note}
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

