import React, { useState, useEffect } from 'react';
import { parsePassageReference } from '../data/bibleData';
import { BookOpen, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface VerseData {
  pk: number;
  verse: number;
  text: string;
}

interface BibleTextViewerProps {
  passage: string;
  defaultTranslation?: 'SCH' | 'LUT';
  onTranslationChange?: (trans: 'SCH' | 'LUT') => void;
}

export const BibleTextViewer: React.FC<BibleTextViewerProps> = ({
  passage,
  defaultTranslation = 'SCH',
  onTranslationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translation, setTranslation] = useState<'SCH' | 'LUT'>(() => {
    const saved = localStorage.getItem('lightflow_bible_trans');
    return saved === 'LUT' || saved === 'SCH' ? saved : defaultTranslation;
  });
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError('Bibeltext konnte nicht geladen werden (Offline oder Netzwerk blockiert).');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, translation, parsed.bookNumber, parsed.chapter]);

  // Gefilterte Verse basierend auf Start- und Endvers
  const displayVerses = verses.filter((v) => {
    if (parsed.startVerse && parsed.endVerse) {
      return v.verse >= parsed.startVerse && v.verse <= parsed.endVerse;
    }
    if (parsed.startVerse) {
      return v.verse >= parsed.startVerse;
    }
    return true;
  });

  return (
    <div className="mb-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-stone-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm overflow-hidden transition-all duration-300">
      {/* Header / Toggle-Leiste */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-amber-500/5 transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-[#E09F3E]/15 text-[#E09F3E]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold font-serif text-stone-800 dark:text-stone-200">
                📖 Bibeltext anzeigen ({parsed.book.name} {parsed.chapter})
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-slate-700">
                {translation === 'SCH' ? 'Schlachter 1951' : 'Luther 1912'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              100% gemeinfrei & rechtssicher direkt in der App nachlesen
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </div>
      </div>

      {/* Ausgeklappter Volltext-Bereich */}
      {isOpen && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-stone-200/60 dark:border-slate-800/60 animate-in fade-in duration-200">
          {/* Übersetzungs-Umschalter */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-slate-800 text-xs">
            <span className="text-stone-500 dark:text-stone-400 text-[11px]">
              Übersetzung wählen:
            </span>
            <div className="flex items-center space-x-1.5 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl">
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
            <div className="py-8 flex flex-col items-center justify-center space-y-2 text-stone-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-[#E09F3E]" />
              <span>Lade gemeinfreien Text ({translation === 'SCH' ? 'Schlachter 1951' : 'Luther 1912'})...</span>
            </div>
          )}

          {/* Fehleranzeige */}
          {!loading && error && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              {error}
            </div>
          )}

          {/* Bibeltext-Verse */}
          {!loading && !error && displayVerses.length > 0 && (
            <div className="space-y-2 text-stone-800 dark:text-stone-200 font-serif leading-relaxed text-sm sm:text-base max-h-[380px] overflow-y-auto pr-2 selection:bg-[#E09F3E]/20">
              {displayVerses.map((v) => (
                <p key={v.pk} className="flex items-start gap-2">
                  <span className="text-[11px] font-sans font-semibold text-[#E09F3E] select-none pt-0.5 shrink-0 w-6 text-right">
                    {v.verse}
                  </span>
                  <span className="flex-1">{v.text}</span>
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-stone-400">
            <span>Gemeinfrei (Public Domain)</span>
            <span>{parsed.book.name} {parsed.chapter}{parsed.startVerse ? `:${parsed.startVerse}${parsed.endVerse ? `-${parsed.endVerse}` : ''}` : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};
