import React, { useState } from 'react';
import {
  BibleBook,
  OLD_TESTAMENT_BOOKS,
  NEW_TESTAMENT_BOOKS,
  getVerseCount,
} from '../data/bibleData';
import { X, Search, ChevronLeft, Sparkles, Check, Bookmark, ArrowRight } from 'lucide-react';

interface BiblePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: string, autoSubmit?: boolean) => void;
  currentPassage?: string;
}

type PickerStep = 'book' | 'chapter' | 'verse';

export const BiblePickerModal: React.FC<BiblePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const [step, setStep] = useState<PickerStep>('book');
  const [testamentTab, setTestamentTab] = useState<'NT' | 'AT'>('NT');
  const [searchTerm, setSearchTerm] = useState('');

  // Ausgewählte Elemente
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [startVerse, setStartVerse] = useState<number | null>(null);
  const [endVerse, setEndVerse] = useState<number | null>(null);

  // Dragging-Zustand für Wisch-Geste (z. B. von Vers 1 bis Vers 20 fahren)
  const isDraggingRef = React.useRef(false);
  const dragOriginVerseRef = React.useRef<number | null>(null);
  const didDragRef = React.useRef(false);

  if (!isOpen) return null;

  // Letzte Vorschläge
  const recentPassages = [
    'Matthäus 12:1-14',
    'Matthäus 11:28-30',
    'Johannes 15:1-5',
    'Philipper 4:6-7',
    'Psalm 23',
    'Römer 8:31-39',
  ];

  // Gefilterte Bücher (unterstützt Suche nach Name, Kurzform und allen Aliasen)
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

  // Buch auswählen
  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setStartVerse(null);
    setEndVerse(null);
    setStep('chapter');
  };

  // Kapitel auswählen
  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setStartVerse(null);
    setEndVerse(null);
    setStep('verse');
  };

  // Vers anklicken: Tippen (Startvers -> Endvers) oder Einzelvers
  const handleVerseClick = (verse: number) => {
    // Wenn gerade eine Wischgeste stattfand, Click nicht erneut auswerten
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (startVerse === null) {
      // 1. Tippen: Startvers setzen
      setStartVerse(verse);
      setEndVerse(verse);
    } else if (startVerse === verse && (endVerse === null || endVerse === verse)) {
      // Erneuter Klick auf denselben einzelnen Vers: Abwählen / Reset
      setStartVerse(null);
      setEndVerse(null);
    } else if (endVerse !== null && startVerse !== endVerse) {
      // Wenn bereits ein Bereich gewählt war und man tippt: Neuen Startvers beginnen
      setStartVerse(verse);
      setEndVerse(verse);
    } else {
      // 2. Tippen auf einen anderen Vers: Bereich von startVerse bis verse aufspannen!
      const min = Math.min(startVerse, verse);
      const max = Math.max(startVerse, verse);
      setStartVerse(min);
      setEndVerse(max);
    }
  };

  // Touch/Drag Geste: Element unter Berührung ermitteln
  const getVerseFromTouch = (clientX: number, clientY: number): number | null => {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const button = el.closest('[data-verse]');
    if (!button) return null;
    const vStr = button.getAttribute('data-verse');
    if (!vStr) return null;
    const v = parseInt(vStr, 10);
    return isNaN(v) ? null : v;
  };

  // Touch Start (Wischgeste vorbereiten)
  const handleTouchStart = (verse: number) => {
    isDraggingRef.current = true;
    dragOriginVerseRef.current = verse;
    didDragRef.current = false;
  };

  // Touch Move über den Bildschirm (Wischen über Verse)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || dragOriginVerseRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;

    const currentV = getVerseFromTouch(touch.clientX, touch.clientY);
    if (currentV !== null) {
      const origin = dragOriginVerseRef.current;
      if (currentV !== origin) {
        didDragRef.current = true; // Erkennung als echte Wischbewegung
        setStartVerse(Math.min(origin, currentV));
        setEndVerse(Math.max(origin, currentV));
      }
    }
  };

  // Touch End
  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    dragOriginVerseRef.current = null;
    // didDragRef kurz aufrecht erhalten, damit der nachfolgende synthetische Klick ignoriert wird
    setTimeout(() => {
      didDragRef.current = false;
    }, 120);
  };

  // Zusammengebaute Stelle berechnen
  const getConstructedPassage = (): string => {
    if (!selectedBook) return '';
    if (!selectedChapter) return selectedBook.name;
    if (startVerse === null) return `${selectedBook.name} ${selectedChapter}`;
    if (endVerse === null || startVerse === endVerse) {
      return `${selectedBook.name} ${selectedChapter}:${startVerse}`;
    }
    return `${selectedBook.name} ${selectedChapter}:${startVerse}-${endVerse}`;
  };

  // Bestätigen & Lichtfluss starten
  const handleConfirm = (passageToSubmit?: string) => {
    const finalPassage = passageToSubmit || getConstructedPassage();
    if (!finalPassage) return;
    onSelectPassage(finalPassage, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header & Navigation */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-white/70 dark:bg-slate-900/60 backdrop-blur">
          <div className="flex items-center space-x-2">
            {step !== 'book' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'verse') setStep('chapter');
                  else if (step === 'chapter') setStep('book');
                }}
                className="p-1.5 rounded-xl hover:bg-stone-200/60 dark:hover:bg-slate-800 text-stone-600 dark:text-stone-300 transition-colors mr-1 cursor-pointer"
                title="Zurück"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#E09F3E] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {step === 'book' && 'Schritt 1: Buch wählen'}
                {step === 'chapter' && `${selectedBook?.name} • Kapitel wählen`}
                {step === 'verse' && `${selectedBook?.name} ${selectedChapter} • Verse markieren`}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                {step === 'book' && 'Bibel-Navigator'}
                {step === 'chapter' && selectedBook?.name}
                {step === 'verse' && `${selectedBook?.name} Kapitel ${selectedChapter}`}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            SCHRITT 1: BÜCHER (AT / NT Trennung)
            ======================================================== */}
        {step === 'book' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Suchfeld */}
            <div className="p-3 sm:p-4 border-b border-stone-200/70 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buch suchen (z. B. Matthäus, Römer, Psalm)..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
                  autoFocus
                />
              </div>

              {/* Testament Umschalter */}
              <div className="flex mt-3 p-1 rounded-xl bg-stone-200/60 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setTestamentTab('NT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    testamentTab === 'NT'
                      ? 'bg-white dark:bg-slate-900 text-[#B45309] dark:text-[#FDE68A] shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Neues Testament (27)
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentTab('AT')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    testamentTab === 'AT'
                      ? 'bg-white dark:bg-slate-900 text-[#B45309] dark:text-[#FDE68A] shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Altes Testament (39)
                </button>
              </div>
            </div>

            {/* Bücher-Liste */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-stone-100 dark:divide-slate-800/60">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleSelectBook(book)}
                  className="w-full py-3 px-3 text-left flex items-center justify-between hover:bg-stone-100/70 dark:hover:bg-slate-800/60 rounded-xl transition-all group cursor-pointer"
                >
                  <span className="font-serif text-base font-medium text-stone-800 dark:text-stone-200 group-hover:text-[#E09F3E] transition-colors">
                    {book.name}
                  </span>
                  <span className="text-xs text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300">
                    {book.chapters} Kap.
                  </span>
                </button>
              ))}
            </div>

            {/* Letzte / Häufige Schnellauswahl am Fuß */}
            <div className="p-3 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/40">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 mb-1.5 flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-[#E09F3E]" />
                Zuletzt / Häufig gewählt
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {recentPassages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleConfirm(p)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E] shrink-0 cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            SCHRITT 2: KAPITEL (Kachel-Raster 1..N)
            ======================================================== */}
        {step === 'chapter' && selectedBook && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 text-xs text-stone-500">
              <span className="font-serif font-medium text-stone-700 dark:text-stone-300">
                {selectedBook.name}
              </span>
              <button
                type="button"
                onClick={() => setStep('book')}
                className="text-[#E09F3E] hover:underline cursor-pointer"
              >
                Anderes Buch
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleSelectChapter(ch)}
                    className="aspect-square flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 font-serif text-base font-semibold text-stone-800 dark:text-stone-100 hover:bg-[#E09F3E] hover:text-slate-950 hover:border-[#E09F3E] transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Ganzes Buch bestätigen */}
            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => handleConfirm(`${selectedBook.name}`)}
                className="w-full py-2.5 text-xs font-semibold rounded-xl bg-stone-200/70 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-[#E09F3E]/20 hover:text-[#B45309] transition-colors"
              >
                Ganzes Buch „{selectedBook.name}“ durchfließen lassen
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCHRITT 3: VERSE
            ======================================================== */}
        {step === 'verse' && selectedBook && selectedChapter && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-5">
            
            {/* Vers-Kacheln (sauber ohne Erklärtexte) */}
            <div
              className="flex-1 overflow-y-auto pr-1 select-none"
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 touch-none">
                {Array.from({ length: getVerseCount(selectedBook, selectedChapter) }, (_, i) => i + 1).map((v) => {
                  const isSelected =
                    startVerse !== null &&
                    endVerse !== null &&
                    v >= startVerse &&
                    v <= endVerse;

                  return (
                    <button
                      key={v}
                      type="button"
                      data-verse={v}
                      onClick={() => handleVerseClick(v)}
                      onTouchStart={() => handleTouchStart(v)}
                      className={`aspect-square flex items-center justify-center rounded-2xl border font-serif text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer touch-none select-none ${
                        isSelected
                          ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] shadow-md shadow-[#E09F3E]/20 font-bold scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 border-stone-200/90 dark:border-slate-800 text-stone-800 dark:text-stone-100 hover:border-[#E09F3E]/60'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bestätigungs-Leiste */}
            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 mt-2 space-y-2">
              <button
                type="button"
                onClick={() => handleConfirm()}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E09F3E] to-[#F59E0B] text-slate-950 font-bold text-sm shadow-lg shadow-[#E09F3E]/25 hover:shadow-[#E09F3E]/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  Auswählen & Weiter ({getConstructedPassage()})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleConfirm(`${selectedBook.name} ${selectedChapter}`)}
                className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                Ganzes Kapitel {selectedChapter} auswählen
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
