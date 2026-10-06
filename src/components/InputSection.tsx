import React, { useState } from 'react';
import { Search, Sparkles, Zap, RefreshCw, ChevronUp } from 'lucide-react';
import { UserProfile } from '../types';

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

export const MOOD_CHIPS = [
  'Dankbar & Erfüllt',
  'Kraftvoll & Bereit',
  'Zur Ruhe kommen',
  'Druck abbauen',
  'Klarheit finden',
  'Erschöpfung überwinden',
  'Entscheidung treffen',
];

const INSPIRATION_PASSAGES = [
  {
    passage: 'Matthäus 12:1-14',
    title: 'Sabbat & Richtlinien',
    note: 'Sinn von Normen vs. Notfalleingriff am Ruhetag',
  },
  {
    passage: 'Matthäus 11:28-30',
    title: 'Die leichte Last',
    note: 'Sauerstoffmaske für Mühselige und Beladene',
  },
  {
    passage: 'Johannes 15:1-5',
    title: 'Der Weinstock',
    note: 'Nicht aus eigener Kraft krampfen, sondern angeschlossen sein',
  },
  {
    passage: 'Philipper 4:6-7',
    title: 'Friede statt Panik',
    note: 'Schutzmechanismus für Herz und Gedanken',
  },
  {
    passage: 'Psalm 23',
    title: 'Frische Wasser',
    note: 'Auftanken ohne Leistungsdruck mitten im Tal',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({
  passage,
  setPassage,
  selectedMood,
  onOpenMoodPicker,
  isLoading,
  onOpenPicker,
  hasActiveReport = false,
  isEditing = false,
  onCancelEdit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(hasActiveReport && !isEditing);

  // Synchronisiere Collapse-Status, wenn ein neuer Report generiert oder Edit-Modus geändert wurde
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

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-4">
      {/* Wenn Report existiert, aber Bereich ausgeklappt ist: Möglichkeit zum Wieder-Zuklappen */}
      {hasActiveReport && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Zum Report zurückkehren</span>
          </button>
        </div>
      )}

      <form onSubmit={handleCtaClick} className="space-y-4">
        {/* Haupt-Eingabefeld mit Klick-Trigger für Bibel-Navigator */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E09F3E]/30 via-[#F59E0B]/20 to-[#3E6B56]/30 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
          
          <div className="relative rounded-3xl bg-white/95 dark:bg-[#151B22]/95 backdrop-blur-xl border border-stone-200/80 dark:border-slate-800 p-2 sm:p-2.5 shadow-xl transition-all">
            <div
              onClick={onOpenPicker}
              className="flex items-center px-3 pt-1 cursor-pointer group/search"
              title="Klicken, um Bücher, Kapitel und Verse auszuwählen"
            >
              <Search className="w-5 h-5 text-[#E09F3E] shrink-0 mr-3 group-hover/search:scale-110 transition-transform" />
              <input
                type="text"
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                readOnly
                onClick={onOpenPicker}
                placeholder="Tippe hier, um Buch, Kapitel & Vers zu wählen..."
                className="w-full py-3.5 text-base sm:text-lg bg-transparent border-none focus:outline-none text-[#1E293B] dark:text-[#F1F5F9] placeholder-stone-400 font-serif cursor-pointer"
              />
              <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#E09F3E]/15 text-[#B45309] dark:text-[#FDE68A] border border-[#E09F3E]/30 whitespace-nowrap">
                Bibel-Navigator ➔
              </span>
            </div>

            {/* Trennlinie */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E09F3E]/30 to-transparent my-1"></div>

            {/* Schritt 1 Info & CTA: Weiter zur Tagesverfassung */}
            <div className="pt-2 px-2 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
                <span className="w-2 h-2 rounded-full bg-[#E09F3E]"></span>
                <span>
                  Schritt 1: Bibelstelle • {selectedMood ? `Zuletzt: ${selectedMood}` : 'Tagesform wird im nächsten Schritt gewählt'}
                </span>
              </div>

              <button
                type="submit"
                disabled={!isCtaReady}
                className={`relative w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden shadow-lg ${
                  isLoading
                    ? 'bg-slate-800 text-amber-200 cursor-wait'
                    : !isCtaReady
                    ? 'bg-stone-200 dark:bg-slate-800/80 text-stone-400 dark:text-stone-500 border border-stone-300/50 dark:border-slate-700/50 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#E09F3E] via-[#F59E0B] to-[#E09F3E] hover:from-[#D97706] hover:to-[#B45309] text-slate-950 shadow-[#E09F3E]/25 hover:shadow-[#E09F3E]/40 hover:scale-[1.01] cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Wird generiert...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Weiter zur Tagesverfassung →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Schnellstart-Vorschläge / Inspirationen */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
            <Zap className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span>Klassische Durchfluss-Passagen</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {INSPIRATION_PASSAGES.map((item) => (
              <button
                type="button"
                key={item.passage}
                onClick={() => {
                  setPassage(item.passage);
                  onOpenMoodPicker();
                }}
                className="text-left p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-stone-200/70 dark:border-slate-800/80 hover:border-[#E09F3E]/50 hover:bg-white dark:hover:bg-slate-900 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-serif font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#E09F3E]">
                  <span>{item.title}</span>
                  <span className="text-[10px] font-sans font-normal text-stone-400">
                    {item.passage}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {item.note}
                </div>
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
};
