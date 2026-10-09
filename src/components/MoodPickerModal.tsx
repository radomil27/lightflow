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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md flex flex-col rounded-3xl bg-[#0C0F17] border border-amber-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] text-stone-100 overflow-hidden animate-luxury-modal">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-start justify-between bg-[#0E131F]/90">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Schritt 2 von 2 • Tagesverfassung
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight mt-0.5">
              Wie geht es dir heute?
            </h2>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Wähle deine heutige Verfassung, damit das Wort genau dort ansetzt, wo du gerade stehst.
            </p>
            {passage && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-[#FDE68A] text-xs font-mono font-medium border border-amber-500/20">
                <span>📖</span>
                <span>{passage}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0 ml-2"
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
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 hover:bg-amber-500/10 text-left transition-all duration-150 flex items-center space-x-3.5 group cursor-pointer shadow-xs active:scale-[0.98] select-none"
            >
              <span className="text-2xl shrink-0 p-2 rounded-xl bg-white/[0.04] group-hover:bg-[#E09F3E]/20 transition-colors">
                {mood.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold font-serif text-stone-100 group-hover:text-[#FDE68A] transition-colors truncate">
                  {mood.label}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                  {mood.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-white/[0.02] border-t border-white/[0.06] text-center text-[10px] text-stone-500">
          Ein Fingertipp startet die Auslegung sofort.
        </div>

      </div>
    </div>
  );
};

