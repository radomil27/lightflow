import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BibleBook,
  OLD_TESTAMENT_BOOKS,
  NEW_TESTAMENT_BOOKS,
  ALL_BIBLE_BOOKS,
  parsePassageReference,
} from '../data/bibleData';
import { getChapterPericopes, Pericope } from '../data/pericopesData';
import {
  X,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface VerseData {
  pk: number;
  verse: number;
  text: string;
}

interface BibleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassage: string;
  onSelectPassageAndGenerate?: (passageWithTitle: string, selectedText?: string) => void;
}

type TabMode = 'reader' | 'bookPicker';

export const BibleReaderModal: React.FC<BibleReaderModalProps> = ({
  isOpen,
  onClose,
  initialPassage,
  onSelectPassageAndGenerate,
}) => {
  const [mode, setMode] = useState<TabMode>('reader');

  // Aktuell ausgewählte Bibelstelle im Reader
  const initialParsed = useMemo(() => parsePassageReference(initialPassage), [initialPassage]);
  const [currentBook, setCurrentBook] = useState<BibleBook>(initialParsed.book);
  const [currentChapter, setCurrentChapter] = useState<number>(initialParsed.chapter);
  const [highlightVerseStart, setHighlightVerseStart] = useState<number | undefined>(initialParsed.startVerse);
  const [highlightVerseEnd, setHighlightVerseEnd] = useState<number | undefined>(initialParsed.endVerse);

  // Buch-Auswahl Zustände
  const [testamentTab, setTestamentTab] = useState<'NT' | 'AT'>(initialParsed.book.testament);
  const [searchTerm, setSearchTerm] = useState('');

  // Bibeltext & API
  const [translation, setTranslation] = useState<'SCH' | 'LUT'>(() => {
    const saved = localStorage.getItem('lightflow_bible_trans');
    return saved === 'LUT' || saved === 'SCH' ? saved : 'SCH';
  });
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Mehrfachauswahl einzelner Verse
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());

  // Ref zum automatischen Hinscrollen zum relevanten Vers
  const versesContainerRef = useRef<HTMLDivElement>(null);

  // Wenn das Modal frisch mit einer neuen initialPassage geöffnet wird:
  useEffect(() => {
    if (isOpen) {
      const parsed = parsePassageReference(initialPassage);
      setCurrentBook(parsed.book);
      setCurrentChapter(parsed.chapter);
      setHighlightVerseStart(parsed.startVerse);
      setHighlightVerseEnd(parsed.endVerse);
      setTestamentTab(parsed.book.testament);
      setSelectedVerses(new Set());
      setMode('reader');
    }
  }, [isOpen, initialPassage]);

  // Bibeltext laden
  useEffect(() => {
    if (!isOpen || mode !== 'reader') return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchUrl = `https://bolls.life/get-chapter/${translation}/${currentBook.bookNumber}/${currentChapter}/`;

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
        setError('Bibeltext konnte nicht geladen werden (bitte Internetverbindung prüfen).');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, mode, translation, currentBook.bookNumber, currentChapter, reloadTrigger]);

  // Nach dem Laden sanft zum Startvers scrollen
  useEffect(() => {
    if (!loading && verses.length > 0 && highlightVerseStart && versesContainerRef.current) {
      const targetElement = document.getElementById(`bible-verse-${highlightVerseStart}`);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [loading, verses, highlightVerseStart]);

  if (!isOpen) return null;

  const handleSelectTranslation = (newTrans: 'SCH' | 'LUT') => {
    setTranslation(newTrans);
    localStorage.setItem('lightflow_bible_trans', newTrans);
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setHighlightVerseStart(undefined);
      setHighlightVerseEnd(undefined);
      setSelectedVerses(new Set());
    } else {
      // Vorheriges Buch
      const prevBookNumber = currentBook.bookNumber - 1;
      const prevBook = ALL_BIBLE_BOOKS.find((b) => b.bookNumber === prevBookNumber);
      if (prevBook) {
        setCurrentBook(prevBook);
        setCurrentChapter(prevBook.chapters);
        setHighlightVerseStart(undefined);
        setHighlightVerseEnd(undefined);
        setSelectedVerses(new Set());
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(currentChapter + 1);
      setHighlightVerseStart(undefined);
      setHighlightVerseEnd(undefined);
      setSelectedVerses(new Set());
    } else {
      // Nächstes Buch
      const nextBookNumber = currentBook.bookNumber + 1;
      const nextBook = ALL_BIBLE_BOOKS.find((b) => b.bookNumber === nextBookNumber);
      if (nextBook) {
        setCurrentBook(nextBook);
        setCurrentChapter(1);
        setHighlightVerseStart(undefined);
        setHighlightVerseEnd(undefined);
        setSelectedVerses(new Set());
      }
    }
  };

  // Buch auswählen
  const handleSelectBook = (book: BibleBook) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setHighlightVerseStart(undefined);
    setHighlightVerseEnd(undefined);
    setSelectedVerses(new Set());
    setMode('reader');
  };

  // Buch-Filter
  const currentBooks = testamentTab === 'NT' ? NEW_TESTAMENT_BOOKS : OLD_TESTAMENT_BOOKS;
  const filteredBooks = currentBooks.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      b.aliases.some((alias) => alias.toLowerCase().includes(q))
    );
  });

  // Vers-Klick Toggle
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

  // Perikopen für das geladene Kapitel berechnen
  const chapterPericopes = getChapterPericopes(
    currentBook.bookNumber,
    currentChapter,
    verses.length > 0 ? verses.length : 35,
    currentBook.name
  );

  const handleGeneratePericope = (pericope: Pericope) => {
    if (!onSelectPassageAndGenerate) return;
    const passageRef = `${currentBook.name} ${currentChapter}:${pericope.startVerse}-${pericope.endVerse}`;
    const fullReferenceWithTitle = `${passageRef} (${pericope.title})`;
    const pericopeVersesText = verses
      .filter((v) => v.verse >= pericope.startVerse && v.verse <= pericope.endVerse)
      .map((v) => `${v.verse}. ${v.text}`)
      .join(' ');

    onSelectPassageAndGenerate(fullReferenceWithTitle, pericopeVersesText);
    onClose();
  };

  const handleGenerateSelectedVerses = () => {
    if (!onSelectPassageAndGenerate || selectedVerses.size === 0) return;
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b);
    const minV = sorted[0];
    const maxV = sorted[sorted.length - 1];
    const spanText = sorted.length === 1 || minV === maxV ? `${minV}` : `${minV}–${maxV}`;
    const passageRef = `${currentBook.name} ${currentChapter}:${spanText}`;
    const label = `${passageRef} (${sorted.length} ausgewählte Verse)`;
    const selectedText = verses
      .filter((v) => selectedVerses.has(v.verse))
      .map((v) => `${v.verse}. ${v.text}`)
      .join(' ');

    onSelectPassageAndGenerate(label, selectedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[92vh] sm:h-[88vh] flex flex-col rounded-[32px] bg-[#0E131F] border border-amber-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(212,175,55,0.15)] text-stone-100 overflow-hidden animate-luxury-modal">
        
        {/* ========================================================
            MODAL HEADER: BUCH, KAPITEL & SCHNELLE BUCHAUSWAHL
            ======================================================== */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#121826] shrink-0 gap-3">
          
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {mode === 'bookPicker' ? (
              <button
                type="button"
                onClick={() => setMode('reader')}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 transition-colors cursor-pointer"
                title="Zurück zum Bibeltext"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-2 rounded-xl bg-amber-500/15 text-[#E09F3E]">
                <BookOpen className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'bookPicker' ? 'reader' : 'bookPicker')}
                  className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 hover:bg-amber-500/20 border border-amber-500/30 text-white font-serif font-bold text-base sm:text-lg transition-all cursor-pointer shadow-inner"
                  title="Anderes Buch oder Kapitel wählen"
                >
                  <span className="truncate">{currentBook.name} {currentChapter}</span>
                  <span className="text-xs text-[#E09F3E] group-hover:translate-y-0.5 transition-transform">
                    {mode === 'bookPicker' ? '▲' : '▼ Buch wählen'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 pl-1">
                {mode === 'bookPicker' ? 'Wähle aus allen 66 Büchern der Bibel' : 'Im Text lesen, nachschlagen & Abschnitte beleuchten'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Übersetzungsumschalter */}
            {mode === 'reader' && (
              <div className="flex items-center bg-black/40 border border-white/[0.08] p-0.5 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectTranslation('SCH')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    translation === 'SCH'
                      ? 'bg-[#E09F3E] text-slate-950 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Schlachter 1951"
                >
                  SCH
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTranslation('LUT')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    translation === 'LUT'
                      ? 'bg-[#E09F3E] text-slate-950 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Luther 1912"
                >
                  LUT
                </button>
              </div>
            )}

            {/* Schließen Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            MODUS 1: BUCH- & KAPITEL-AUSWAHL (Book Picker)
            ======================================================== */}
        {mode === 'bookPicker' && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0A0D15]">
            {/* Suchfeld & Testament-Tabs */}
            <div className="p-3 sm:p-4 border-b border-white/[0.08] shrink-0 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buch suchen (z. B. Matthäus, Römer, Psalm, 1Mo)..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-black/50 border border-white/[0.1] text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#E09F3E]"
                  autoFocus
                />
              </div>

              <div className="flex p-1 rounded-xl bg-black/40 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setTestamentTab('NT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    testamentTab === 'NT'
                      ? 'bg-[#E09F3E] text-slate-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Neues Testament (27 Bücher)
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentTab('AT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    testamentTab === 'AT'
                      ? 'bg-[#E09F3E] text-slate-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Altes Testament (39 Bücher)
                </button>
              </div>
            </div>

            {/* Bücher-Raster */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredBooks.map((book) => {
                  const isCurrent = book.id === currentBook.id;
                  return (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => handleSelectBook(book)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-500/60 text-[#FDE68A] shadow-md'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-amber-500/30 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm">{book.name}</span>
                        <span className="text-[10px] font-mono text-stone-400 bg-black/40 px-1.5 py-0.5 rounded">
                          {book.shortName}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 mt-1">
                        {book.chapters} {book.chapters === 1 ? 'Kapitel' : 'Kapitel'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODUS 2: VOLLTEXT-LESER & KAPITEL-NAVIGATION
            ======================================================== */}
        {mode === 'reader' && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0C0F18]">
            
            {/* Kapitel-Schnellwechsel Leiste */}
            <div className="px-4 py-2.5 bg-[#121826]/80 border-b border-white/[0.06] flex items-center justify-between text-xs shrink-0">
              <button
                type="button"
                onClick={handlePrevChapter}
                className="px-2.5 py-1 rounded-xl bg-black/40 hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/[0.06] transition-colors flex items-center gap-1 cursor-pointer"
                title="Vorheriges Kapitel"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vorheriges</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] py-0.5 px-1 scrollbar-none">
                {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setCurrentChapter(ch);
                      setHighlightVerseStart(undefined);
                      setHighlightVerseEnd(undefined);
                      setSelectedVerses(new Set());
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                      ch === currentChapter
                        ? 'bg-[#E09F3E] text-slate-950 font-bold shadow-xs'
                        : 'bg-black/30 text-stone-400 hover:text-white'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextChapter}
                className="px-2.5 py-1 rounded-xl bg-black/40 hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/[0.06] transition-colors flex items-center gap-1 cursor-pointer"
                title="Nächstes Kapitel"
              >
                <span className="hidden sm:inline">Nächstes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Haupt-Lesebereich mit Scrollbar */}
            <div ref={versesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Ladezustand */}
              {loading && (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 text-stone-400 text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E09F3E]" />
                  <span>Lade Bibeltext ({currentBook.name} {currentChapter})...</span>
                </div>
              )}

              {/* Fehlerzustand */}
              {!loading && error && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setReloadTrigger((p) => p + 1)}
                    className="px-3 py-1.5 rounded-xl bg-[#E09F3E] text-slate-950 font-bold"
                  >
                    Erneut versuchen
                  </button>
                </div>
              )}

              {/* Reeller Text & Perikopen-Gliederung */}
              {!loading && !error && verses.length > 0 && (
                <div className="space-y-6">
                  
                  {/* Hinweis zur Bedienung */}
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span>Tippe auf Verse zum Auswählen oder starte Klarblick für ganze Abschnitte:</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {translation === 'SCH' ? 'Schlachter 1951' : 'Luther 1912'}
                    </span>
                  </div>

                  {/* Abschnitte & Verse */}
                  {chapterPericopes.map((pericope, pIdx) => {
                    const pVerses = verses.filter(
                      (v) => v.verse >= pericope.startVerse && v.verse <= pericope.endVerse
                    );
                    if (pVerses.length === 0) return null;

                    return (
                      <div
                        key={`pericope-${pericope.startVerse}-${pIdx}`}
                        className="rounded-3xl p-4 sm:p-5 bg-black/40 border border-white/[0.07] hover:border-amber-500/30 transition-all space-y-3.5 shadow-sm"
                      >
                        {/* Abschnitts-Kopf */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-white/[0.08] gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-[#E09F3E] tracking-wider block">
                              Sinnabschnitt {pIdx + 1} • Verse {pericope.startVerse}–{pericope.endVerse}
                            </span>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                              {pericope.title}
                            </h3>
                          </div>

                          {onSelectPassageAndGenerate && (
                            <button
                              type="button"
                              onClick={() => handleGeneratePericope(pericope)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E09F3E] to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 self-start sm:self-auto active:scale-95"
                              title="Diesen Abschnitt direkt in den 7-Posten-Klarblick übergeben"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Abschnitt analysieren</span>
                            </button>
                          )}
                        </div>

                        {/* Verse des Abschnitts */}
                        <div className="space-y-2 font-serif text-sm sm:text-base leading-relaxed text-stone-200">
                          {pVerses.map((v) => {
                            const isSelected = selectedVerses.has(v.verse);
                            const isOriginalTarget =
                              highlightVerseStart !== undefined &&
                              v.verse >= highlightVerseStart &&
                              v.verse <= (highlightVerseEnd ?? highlightVerseStart);

                            return (
                              <div
                                key={v.pk}
                                id={`bible-verse-${v.verse}`}
                                onClick={() => toggleVerseSelection(v.verse)}
                                className={`flex items-start gap-3 p-2 rounded-xl transition-all cursor-pointer select-none ${
                                  isSelected
                                    ? 'bg-amber-500/25 border border-amber-500/50 text-white shadow-xs'
                                    : isOriginalTarget
                                    ? 'bg-amber-500/10 border border-amber-500/20 text-[#FDE68A]'
                                    : 'hover:bg-white/[0.04]'
                                }`}
                                title="Antippen zum Markieren"
                              >
                                <span
                                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 transition-colors ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950'
                                      : isOriginalTarget
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-white/[0.05] text-stone-400'
                                  }`}
                                >
                                  {isSelected ? '✓ ' : ''}{v.verse}
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
            </div>

            {/* Schwebende Aktionsleiste bei Mehrfachauswahl von Einzelversen */}
            {selectedVerses.size > 0 && onSelectPassageAndGenerate && (
              <div className="p-3 sm:p-4 bg-[#141B2A] border-t border-amber-500/30 flex items-center justify-between gap-3 shrink-0 shadow-2xl">
                <div className="text-xs">
                  <span className="font-bold text-white">
                    {selectedVerses.size} Vers{selectedVerses.size > 1 ? 'e' : ''} ausgewählt
                  </span>
                  <p className="text-[11px] text-stone-400">
                    {currentBook.name} {currentChapter}:{Array.from(selectedVerses).sort((a,b)=>a-b).join(', ')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVerses(new Set())}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    Abwählen
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateSelectedVerses}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E09F3E] via-[#F59E0B] to-[#E09F3E] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Klarblick für Auswahl</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
