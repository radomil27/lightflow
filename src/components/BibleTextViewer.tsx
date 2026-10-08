import React, { useState, useEffect, useMemo } from 'react';
import { parsePassageReference } from '../data/bibleData';
import { getChapterPericopes, Pericope } from '../data/pericopesData';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface VerseData {
  pk: number;
  verse: number;
  text: string;
}

interface BibleTextViewerProps {
  passage: string;
  defaultTranslation?: 'SCH' | 'LUT';
  onTranslationChange?: (trans: 'SCH' | 'LUT') => void;
  onGenerateKlarblick?: (passageWithTitle: string, selectedText?: string) => void;
}

export const BibleTextViewer: React.FC<BibleTextViewerProps> = ({
  passage,
  defaultTranslation = 'SCH',
  onTranslationChange,
  onGenerateKlarblick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translation, setTranslation] = useState<'SCH' | 'LUT'>(() => {
    const saved = localStorage.getItem('lightflow_bible_trans');
    return saved === 'LUT' || saved === 'SCH' ? saved : defaultTranslation;
  });
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Mehrfachauswahl einzelner Verse für den flexiblen Fallback
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());

  const parsed = parsePassageReference(passage);

  const handleSelectTranslation = (newTrans: 'SCH' | 'LUT') => {
    setTranslation(newTrans);
    localStorage.setItem('lightflow_bible_trans', newTrans);
    if (onTranslationChange) {
      onTranslationChange(newTrans);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchUrl = `https://bolls.life/get-chapter/${translation}/${parsed.bookNumber}/${parsed.chapter}/`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: VerseData[]) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setVerses(data);
        } else {
          throw new Error('Kein Bibeltext verfügbar.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Bibeltext Abruffehler:', err);
        setError('Bibeltext konnte nicht geladen werden (Offline oder Netzwerk-Verbindung gestört).');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, translation, parsed.bookNumber, parsed.chapter, reloadTrigger]);

  // Perikopen für das geladene Kapitel berechnen
  const chapterPericopes = useMemo(() => {
    const totalCount = verses.length > 0 ? verses.length : 35;
    const all = getChapterPericopes(parsed.bookNumber, parsed.chapter, totalCount, parsed.book.name);

    // Wenn der Nutzer bereits eine spezifische Versspanne gewählt hat,
    // filtern wir auf jene Perikopen, die mit dieser Spanne überlappen
    if (!parsed.isFullChapter && parsed.startVerse !== undefined) {
      const s = parsed.startVerse;
      const e = parsed.endVerse ?? parsed.startVerse;
      const filtered = all.filter((p) => p.endVerse >= s && p.startVerse <= e);
      if (filtered.length > 0) return filtered;
    }

    return all;
  }, [parsed.bookNumber, parsed.chapter, parsed.book.name, parsed.isFullChapter, parsed.startVerse, parsed.endVerse, verses.length]);

  // Vers-Klick Toggle für Einzelversauswahl
  const toggleVerseSelection = (verseNum: number) => {
    setSelectedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNum)) {
        next.delete(verseNum);
      } else {
        next.add(verseNum);
      }
      return next;
    });
  };

  const clearVerseSelection = () => {
    setSelectedVerses(new Set());
  };

  // Generierung für einen kompletten Sinnabschnitt anstoßen
  const handleGeneratePericope = (pericope: Pericope) => {
    if (!onGenerateKlarblick) return;

    const passageRef = `${parsed.book.name} ${parsed.chapter}:${pericope.startVerse}-${pericope.endVerse}`;
    const fullReferenceWithTitle = `${passageRef} (${pericope.title})`;

    const pericopeVersesText = verses
      .filter((v) => v.verse >= pericope.startVerse && v.verse <= pericope.endVerse)
      .map((v) => `${v.verse}. ${v.text}`)
      .join(' ');

    onGenerateKlarblick(fullReferenceWithTitle, pericopeVersesText);
  };

  // Generierung für manuell markierte Einzelverse anstoßen
  const handleGenerateSelectedVerses = () => {
    if (!onGenerateKlarblick || selectedVerses.size === 0) return;

    const sorted = Array.from(selectedVerses).sort((a, b) => a - b);
    const minV = sorted[0];
    const maxV = sorted[sorted.length - 1];

    const spanText = sorted.length === 1 || minV === maxV ? `${minV}` : `${minV}–${maxV}`;
    const passageRef = `${parsed.book.name} ${parsed.chapter}:${spanText}`;
    const label = `${passageRef} (${sorted.length} ausgewählte Verse)`;

    const selectedText = verses
      .filter((v) => selectedVerses.has(v.verse))
      .map((v) => `${v.verse}. ${v.text}`)
      .join(' ');

    onGenerateKlarblick(label, selectedText);
    clearVerseSelection();
  };

  return (
    <div className="mb-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-stone-200/90 dark:border-slate-800/90 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 relative">
      {/* Header / Toggle-Leiste */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between cursor-pointer select-none hover:bg-amber-500/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#E09F3E]/15 text-[#E09F3E]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                📖 Kapitelansicht & Sinnabschnitte ({parsed.formattedDisplay})
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-slate-700">
                {translation === 'SCH' ? 'Schlachter 1951' : 'Luther 1912'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Gegliedert in abgeschlossene Geschichten für optimalen Klarblick
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-stone-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-stone-400" />
          )}
        </div>
      </div>

      {/* Ausgeklappter Perikopen- & Textbereich */}
      {isOpen && (
        <div className="px-4 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-stone-200/60 dark:border-slate-800/60 animate-in fade-in duration-200">
          
          {/* Übersetzungs-Umschalter & Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-5 border-b border-stone-100 dark:border-slate-800 text-xs gap-2">
            <span className="text-stone-500 dark:text-stone-400 text-[11px] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#E09F3E]" />
              Wähle einen Sinnabschnitt oder markiere einzelne Verse:
            </span>
            <div className="flex items-center space-x-1.5 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTranslation('SCH');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  translation === 'SCH'
                    ? 'bg-white dark:bg-slate-700 text-[#B45309] dark:text-[#FDE68A] shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Schlachter 1951
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTranslation('LUT');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  translation === 'LUT'
                    ? 'bg-white dark:bg-slate-700 text-[#B45309] dark:text-[#FDE68A] shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Luther 1912
              </button>
            </div>
          </div>

          {/* Ladezustand */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-stone-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-[#E09F3E]" />
              <span>Lade Sinnabschnitte & Verse ({translation === 'SCH' ? 'Schlachter 1951' : 'Luther 1912'})...</span>
            </div>
          )}

          {/* Fehleranzeige mit Retry-Button */}
          {!loading && error && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setReloadTrigger((prev) => prev + 1)}
                className="px-3.5 py-1.5 bg-[#E09F3E] text-slate-950 font-semibold rounded-xl hover:bg-[#D97706] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
              >
                Erneut laden
              </button>
            </div>
          )}

          {/* Sinnabschnitt-Karten (Perikopen) */}
          {!loading && !error && verses.length > 0 && (
            <div className="space-y-5">
              {chapterPericopes.map((pericope, idx) => {
                const pericopeVerses = verses.filter(
                  (v) => v.verse >= pericope.startVerse && v.verse <= pericope.endVerse
                );

                if (pericopeVerses.length === 0) return null;

                const hasSelectedInPericope = pericopeVerses.some((v) =>
                  selectedVerses.has(v.verse)
                );

                return (
                  <div
                    key={`${pericope.startVerse}-${pericope.endVerse}-${idx}`}
                    className={`rounded-2xl border transition-all duration-300 p-4 sm:p-5 ${
                      hasSelectedInPericope
                        ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 shadow-md shadow-amber-500/5'
                        : 'bg-white/95 dark:bg-slate-900/90 border-stone-200/80 dark:border-slate-800/80 hover:border-amber-500/30 shadow-xs'
                    }`}
                  >
                    {/* Karten-Header mit Titel & Versspanne */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-slate-800/80 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-amber-500/10 text-[#E09F3E] text-xs font-bold">
                            § {idx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                            {pericope.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pl-7 sm:pl-7">
                          {parsed.book.name} {parsed.chapter}, Verse {pericope.startVerse}–{pericope.endVerse}
                        </span>
                      </div>

                      {/* Prominenter Aktionsbutton pro Karte */}
                      {onGenerateKlarblick && (
                        <button
                          type="button"
                          onClick={() => handleGeneratePericope(pericope)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E09F3E] to-amber-500 hover:from-amber-400 hover:to-[#E09F3E] text-slate-950 font-bold text-xs shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                          title="Fokussiert die KI auf genau diese Geschichte für den 3-Sätze-Klarblick"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Klarblick für diesen Abschnitt</span>
                        </button>
                      )}
                    </div>

                    {/* Vers-Inhalt des Abschnitts */}
                    <div className="space-y-1.5 font-serif text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
                      {pericopeVerses.map((v) => {
                        const isChecked = selectedVerses.has(v.verse);
                        return (
                          <div
                            key={v.pk}
                            onClick={() => toggleVerseSelection(v.verse)}
                            className={`flex items-start gap-2.5 p-1.5 rounded-xl cursor-pointer select-none transition-colors ${
                              isChecked
                                ? 'bg-amber-500/20 dark:bg-amber-500/25 text-stone-950 dark:text-stone-50 font-medium'
                                : 'hover:bg-stone-100/70 dark:hover:bg-slate-800/50'
                            }`}
                            title="Tippen zum Auswählen / Abwählen dieses Einzelverses"
                          >
                            <span
                              className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 transition-colors ${
                                isChecked
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-stone-100 dark:bg-slate-800 text-[#B45309] dark:text-[#FDE68A]'
                              }`}
                            >
                              {isChecked ? '✓ ' : ''}{v.verse}
                            </span>
                            <span className="flex-1">{v.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-stone-400">
            <span>Gemeinfrei (Public Domain)</span>
            <span>{parsed.formattedDisplay}</span>
          </div>
        </div>
      )}

      {/* Schwebende Aktionsleiste (Floating Action Bar) bei Einzelvers-Auswahl */}
      {selectedVerses.size > 0 && onGenerateKlarblick && (
        <div className="sticky bottom-3 mx-3 sm:mx-6 my-2 p-3 sm:p-4 rounded-2xl bg-slate-950/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300 z-30">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
              {selectedVerses.size}
            </span>
            <div>
              <div className="font-semibold text-stone-100">
                {selectedVerses.size === 1 ? '1 Vers ausgewählt' : `${selectedVerses.size} Verse ausgewählt`}
              </div>
              <div className="text-[11px] text-stone-400">
                {parsed.book.name} {parsed.chapter}:
                {Array.from(selectedVerses).sort((a, b) => a - b).join(', ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={clearVerseSelection}
              className="px-3 py-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-slate-800 text-xs transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleGenerateSelectedVerses}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E09F3E] to-amber-500 hover:from-amber-400 hover:to-[#E09F3E] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Klarblick für Auswahl</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
