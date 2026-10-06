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
    subtitle: 'Erfolge feiern, Freude teilen, das Gelungene würdigen',
  },
  {
    label: 'Kraftvoll & Bereit',
    icon: '⚡',
    subtitle: 'Voller Tatendrang, Fokus schärfen, mutig vorangehen',
  },
  {
    label: 'Zur Ruhe kommen',
    icon: '🕊️',
    subtitle: 'Gedanken abschalten, Feierabend finden, Ballast ablegen',
  },
  {
    label: 'Klarheit finden',
    icon: '⚓',
    subtitle: 'Verwirrung lichten, Wahrheit suchen, feste Orientierung',
  },
  {
    label: 'Druck abbauen',
    icon: '🛡️',
    subtitle: 'Erwartungen loslassen, durchatmen, Schutz vor Überlastung',
  },
  {
    label: 'Erschöpfung überwinden',
    icon: '🔋',
    subtitle: 'Leere Akkus füllen, neue Kraft schöpfen, getragen werden',
  },
  {
    label: 'Entscheidung treffen',
    icon: '🎯',
    subtitle: 'Weichen stellen, Klarheit für den nächsten Schritt',
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-start justify-between bg-white/70 dark:bg-slate-900/60 backdrop-blur">
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

        {/* Mood Grid: 1 Tipp genügt für direkten Start */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 max-h-[60vh] sm:max-h-[500px]">
          {MOOD_OPTIONS.map((mood) => (
            <button
              type="button"
              key={mood.label}
              onClick={() => {
                onSelectMood(mood.label);
                onClose();
              }}
              className="w-full p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E] hover:bg-amber-500/5 dark:hover:bg-amber-500/10 text-left transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-2xl bg-stone-100 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                  {mood.icon}
                </span>
                <div>
                  <div className="text-sm font-bold font-serif text-stone-800 dark:text-stone-100 group-hover:text-[#B45309] dark:group-hover:text-[#FDE68A] transition-colors">
                    {mood.label}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                    {mood.subtitle}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 group-hover:bg-[#E09F3E] group-hover:text-slate-950 transition-all shrink-0 ml-2">
                Starten →
              </span>
            </button>
          ))}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-stone-100/60 dark:bg-slate-900/40 border-t border-stone-200 dark:border-slate-800 text-center text-[11px] text-stone-500 dark:text-stone-400">
          Ein Klick auf deine Stimmung startet die Auslegung sofort.
        </div>

      </div>
    </div>
  );
};
