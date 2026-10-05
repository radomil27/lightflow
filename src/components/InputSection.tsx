import React, { useState } from 'react';
import { Search, Sparkles, Droplets, ArrowRight, Zap, RefreshCw, Feather, ChevronUp, Edit3 } from 'lucide-react';
import { UserProfile } from '../types';

interface InputSectionProps {
  passage: string;
  setPassage: (val: string) => void;
  selectedMood: string;
  setSelectedMood: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  profile: UserProfile;
  onOpenPicker: () => void;
  hasActiveReport?: boolean;
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
  setSelectedMood,
  onSubmit,
  isLoading,
  profile,
  onOpenPicker,
  hasActiveReport = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(hasActiveReport);

  // Synchronisiere Collapse-Status, wenn ein neuer Report generiert wurde
  React.useEffect(() => {
    if (hasActiveReport) {
      setIsCollapsed(true);
    }
  }, [hasActiveReport]);

  const hasPassage = passage.trim().length > 0;
  const hasMood = selectedMood && selectedMood.trim().length > 0;
  const isCtaReady = hasPassage && hasMood && !isLoading;

  // Wenn ein aktiver Report vorliegt und der Nutzer den Bereich eingeklappt hat: Kompakter Header
  if (hasActiveReport && isCollapsed) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2 animate-in fade-in duration-300">
        <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-white/80 dark:bg-[#151B22]/80 border border-stone-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 truncate">
            <span className="font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
              📖 {passage}
            </span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="px-2 py-0.5 rounded-lg bg-[#E09F3E]/15 text-[#B45309] dark:text-[#FDE68A] text-xs font-medium whitespace-nowrap">
              🌿 {selectedMood || 'Tagesstimmung'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-500/15 text-stone-600 hover:text-[#B45309] dark:bg-slate-800/80 dark:hover:bg-amber-500/20 dark:text-stone-300 dark:hover:text-[#FDE68A] text-xs font-medium transition-colors shrink-0 ml-2 cursor-pointer"
            title="Bibelstelle oder Stimmung neu anpassen"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span className="hidden sm:inline">Neu anpassen</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      {/* Wenn Report existiert, aber Bereich ausgeklappt ist: Möglichkeit zum Wieder-Zuklappen */}
      {hasActiveReport && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Kompaktansicht anzeigen</span>
          </button>
        </div>
      )}

      {/* Sanfter Banner zur Kern-Metapher */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1E293B]/5 via-[#E09F3E]/10 to-[#3E6B56]/5 dark:from-slate-900/60 dark:via-[#E09F3E]/10 dark:to-slate-900/60 border border-[#E09F3E]/20 text-xs text-stone-600 dark:text-stone-300">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2.5">
            <span className="p-1 rounded-lg bg-[#E09F3E]/20 text-[#E09F3E] shrink-0 mt-0.5">
              <Droplets className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-semibold text-stone-800 dark:text-stone-100 font-serif text-sm">
                „Lightflow – Angeschlossen an die Quelle.“
              </p>
              <p className="mt-0.5 leading-relaxed text-stone-600 dark:text-stone-400">
                Der Alltag fühlt sich oft an wie das Arbeiten tief unter Wasser – voller Druck und Lärm. Lightflow liefert frischen Sauerstoff und klares Licht passgenau in dein Gewerk: <strong className="text-stone-800 dark:text-stone-200">{profile.profession}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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

            {/* Trennlinie mit dezentem Lichtstrom-Glow */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E09F3E]/30 to-transparent my-1"></div>

            {/* Schnellauswahl der Tagesverfassung als PFLICHTFELD */}
            <div className={`pt-2 px-3 pb-2 rounded-2xl transition-all duration-300 ${
              hasPassage && !hasMood 
                ? 'ring-2 ring-[#E09F3E]/50 bg-amber-500/5 animate-pulse' 
                : ''
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#E09F3E]" />
                  Heutige Tagesverfassung <span className="text-amber-500 font-bold">*</span>
                </span>
                
                {hasPassage && !hasMood ? (
                  <span className="text-[11px] text-[#B45309] dark:text-[#FDE68A] font-semibold animate-bounce">
                    👉 Wie geht es dir heute? Bitte wähle deine Stimmung:
                  </span>
                ) : (
                  <span className="text-[11px] text-[#B45309] dark:text-[#FDE68A] font-medium">
                    {selectedMood || 'Noch keine Stimmung gewählt'}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {MOOD_CHIPS.map((mood) => {
                  const active = selectedMood === mood;
                  return (
                    <button
                      type="button"
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold shadow-sm scale-105'
                          : 'bg-stone-100/70 dark:bg-slate-800/60 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-slate-700/60 hover:border-[#E09F3E]/50 hover:bg-stone-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aktions-Button: Lichtfluss starten (Disabled, solange keine Stimmung gewählt) */}
            <div className="mt-3 pt-2 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-stone-400 dark:text-stone-500 pl-1">
                {!hasMood && hasPassage && (
                  <span className="text-amber-600 dark:text-amber-400">
                    Wähle oben eine Stimmung, um die Auslegung freizugeben.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isCtaReady}
                className={`relative w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2.5 overflow-hidden shadow-lg ${
                  isLoading
                    ? 'bg-slate-800 text-amber-200 cursor-wait'
                    : !isCtaReady
                    ? 'bg-stone-200 dark:bg-slate-800/80 text-stone-400 dark:text-stone-500 border border-stone-300/50 dark:border-slate-700/50 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#E09F3E] via-[#F59E0B] to-[#E09F3E] hover:from-[#D97706] hover:to-[#B45309] text-slate-950 shadow-[#E09F3E]/25 hover:shadow-[#E09F3E]/40 hover:scale-[1.01] cursor-pointer'
                }`}
              >
                {/* Fließende Kontur-Animation beim Laden (als würde eine Leitung befüllt) */}
                {isLoading && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-200/40 to-amber-500/20 animate-pulse"></span>
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FDE68A] to-transparent animate-light-pulse"></span>
                  </>
                )}

                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Versorgungsleitung wird befüllt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auslegung generieren</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
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
