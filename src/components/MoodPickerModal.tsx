import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface MoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMood: (mood: string) => void;
  passage?: string;
}

export interface MoodOption {
  label: string;
  icon: string;
  subtitle: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    label: 'Dankbar & Erfüllt',
    icon: '🌿',
    subtitle: 'Erfolge feiern, Freude teilen, Segen sehen',
  },
  {
    label: 'Tatendrang & Fokus',
    icon: '⚡',
    subtitle: 'Morgens/Tagsüber: Kraft für anstehende Aufgaben, klare Ausrichtung',
  },
  {
    label: 'Erschöpft & Unter Druck',
    icon: '🛡️',
    subtitle: 'Müde, Akku leer, Feierabend, Lasten ablegen',
  },
  {
    label: 'Orientierung & Rat',
    icon: '🧭',
    subtitle: 'Suche nach Klarheit, offene Fragen, Entscheidungen',
  },
];

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMood,
  passage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md flex flex-col rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex items-start justify-between bg-white/70 dark:bg-slate-900/60 backdrop-blur">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Schritt 2 von 2 • Tagesverfassung
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9] mt-0.5">
              Wie geht es dir heute?
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              Wähle deine heutige Verfassung, damit das Wort genau dort ansetzt, wo du gerade stehst.
            </p>
            {passage && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-mono font-medium border border-amber-500/20">
                <span>📖</span>
                <span>{passage}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Schlanke Kacheln: Passt komplett ohne Scrollen auf jedes Smartphone */}
        <div className="p-3.5 sm:p-4 space-y-2.5">
          {MOOD_OPTIONS.map((mood) => (
            <button
              type="button"
              key={mood.label}
              onClick={() => {
                onSelectMood(mood.label);
                onClose();
              }}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E] hover:bg-amber-500/5 dark:hover:bg-amber-500/10 text-left transition-all duration-150 flex items-center space-x-3.5 group cursor-pointer shadow-sm hover:shadow active:scale-[0.98] select-none"
            >
              <span className="text-2xl shrink-0 p-2 rounded-xl bg-stone-100 dark:bg-slate-800 group-hover:bg-[#E09F3E]/20 transition-colors">
                {mood.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold font-serif text-stone-800 dark:text-stone-100 group-hover:text-[#B45309] dark:group-hover:text-[#FDE68A] transition-colors truncate">
                  {mood.label}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {mood.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-stone-100/60 dark:bg-slate-900/40 border-t border-stone-200 dark:border-slate-800 text-center text-[10px] text-stone-400 dark:text-stone-500">
          Ein Fingertipp startet die Auslegung sofort.
        </div>

      </div>
    </div>
  );
};
