import React, { useState, useRef, useEffect } from 'react';
import { LightflowReport } from '../types';
import {
  X,
  Bookmark,
  Trash2,
  ArrowRight,
  Search,
  Clock,
  Briefcase,
  Share2,
  RotateCcw,
  Check
} from 'lucide-react';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: LightflowReport[];
  onSelectReport: (report: LightflowReport) => void;
  onDeleteReport: (id: string) => void;
  onRestoreReport?: (report: LightflowReport) => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onRestoreReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Swipe State Management
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletedReportForUndo, setDeletedReportForUndo] = useState<LightflowReport | null>(null);

  // Touch tracking refs
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const activeReportRef = useRef<LightflowReport | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const filtered = reports.filter((r) => {
    const summary = r.lichtfunke || r.coreConduit || '';
    const matchesSearch =
      r.passage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.profileSnapshot.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = onlyFavorites ? r.favorite : true;
    return matchesSearch && matchesFav;
  });

  const showToast = (message: string, undoReport?: LightflowReport) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    if (undoReport) {
      setDeletedReportForUndo(undoReport);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setDeletedReportForUndo(null);
    }, 4000);
  };

  const handleShare = async (report: LightflowReport) => {
    const textToShare = `LIGHTFLOW REPORT: ${report.passage}\n${report.lichtfunke || report.coreConduit}\n— Ausgelegt mit Lightflow`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lightflow – ${report.passage}`,
          text: textToShare,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      showToast('In Zwischenablage kopiert 📋');
    } catch {
      showToast('Kopieren fehlgeschlagen');
    }
  };

  const handleUndoDelete = () => {
    if (deletedReportForUndo && onRestoreReport) {
      onRestoreReport(deletedReportForUndo);
      setDeletedReportForUndo(null);
      setToastMessage(null);
    }
  };

  // Touch Handlers for horizontal swipe
  const handleTouchStart = (e: React.TouchEvent, report: LightflowReport) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    activeReportRef.current = report;
    setSwipingId(report.id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipingId) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Richtungserkennung bei den ersten Bewegungen
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // Wenn es ein vertikales Scrollen ist, abbrechen
    if (isHorizontalSwipeRef.current === false) {
      setSwipeOffset(0);
      return;
    }

    // Horizontales Wischen mit Dämpfung über 140px
    if (isHorizontalSwipeRef.current === true) {
      // Begrenzung zwischen -140px und +140px
      const clamped = Math.max(-140, Math.min(140, deltaX));
      setSwipeOffset(clamped);
    }
  };

  const handleTouchEnd = () => {
    if (!swipingId || !activeReportRef.current) {
      setSwipingId(null);
      setSwipeOffset(0);
      return;
    }

    const currentReport = activeReportRef.current;
    const threshold = 75; // Schwellenwert in Pixeln

    if (swipeOffset > threshold) {
      // SWIPE NACH RECHTS ➔ TEILEN
      handleShare(currentReport);
    } else if (swipeOffset < -threshold) {
      // SWIPE NACH LINKS ➔ LÖSCHEN
      onDeleteReport(currentReport.id);
      showToast(`Lichtfluss „${currentReport.passage}“ gelöscht`, currentReport);
    }

    // Zurückgleiten
    setSwipeOffset(0);
    setSwipingId(null);
    activeReportRef.current = null;
    isHorizontalSwipeRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#0C0F17] border border-amber-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] text-stone-100 p-5 sm:p-6 overflow-hidden max-w-full touch-pan-y animate-luxury-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#E09F3E]" />
            <h2 className="text-xl font-bold font-serif text-white tracking-tight">
              Gespeicherte Lichtflüsse ({reports.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe-Tipp für Smartphones */}
        <div className="hidden sm:flex items-center justify-between px-1 pt-2 text-[11px] text-stone-400 dark:text-stone-500">
          <span>Tipp auf Karte zum Öffnen</span>
          <span>Wische rechts zum Teilen ↗️ • Wische links zum Löschen 🗑️</span>
        </div>

        {/* Filter & Suche */}
        <div className="py-3.5 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nach Bibelstelle, Thema oder Beruf filtern..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOnlyFavorites(false)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                !onlyFavorites
                  ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                  : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
              }`}
            >
              Alle ({reports.length})
            </button>
            <button
              onClick={() => setOnlyFavorites(true)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                onlyFavorites
                  ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                  : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
              }`}
            >
              Favoriten ({reports.filter((r) => r.favorite).length})
            </button>
          </div>
        </div>

        {/* Liste mit Swipe-Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 overflow-x-hidden touch-pan-y">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-xs">
              Keine passenden Berichte gefunden.
            </div>
          ) : (
            filtered.map((r) => {
              const isCurrentSwiping = swipingId === r.id;
              const currentOffset = isCurrentSwiping ? swipeOffset : 0;

              return (
                <div
                  key={r.id}
                  className="relative rounded-2xl overflow-hidden select-none bg-stone-100 dark:bg-stone-950/60"
                >
                  {/* Hintergrund-Aktionen beim Wischen */}
                  
                  {/* LINKS sichtbar beim Wischen nach RECHTS ➔ TEILEN (Blau / Smaragd) */}
                  <div
                    className="absolute inset-y-0 left-0 w-full flex items-center px-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold text-xs transition-opacity"
                    style={{
                      opacity: currentOffset > 10 ? Math.min(1, currentOffset / 60) : 0,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 animate-pulse" />
                      <span>{currentOffset > 75 ? 'Loslassen zum Teilen' : 'Teilen'}</span>
                    </div>
                  </div>

                  {/* RECHTS sichtbar beim Wischen nach LINKS ➔ LÖSCHEN (Rot) */}
                  <div
                    className="absolute inset-y-0 right-0 w-full flex items-center justify-end px-5 bg-gradient-to-l from-rose-600 to-red-700 text-white font-semibold text-xs transition-opacity"
                    style={{
                      opacity: currentOffset < -10 ? Math.min(1, Math.abs(currentOffset) / 60) : 0,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{currentOffset < -75 ? 'Loslassen zum Löschen' : 'Löschen'}</span>
                      <Trash2 className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  {/* Vordergrund-Kachel mit CSS-Transform */}
                  <div
                    onTouchStart={(e) => handleTouchStart(e, r)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      transform: `translateX(${currentOffset}px)`,
                      transition: isCurrentSwiping ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="relative z-10 group p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#E09F3E]/50 transition-colors shadow-sm flex items-start justify-between gap-3 w-full max-w-full break-words"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        if (Math.abs(currentOffset) < 5) {
                          onSelectReport(r);
                          onClose();
                        }
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                        <span className="font-semibold text-stone-800 dark:text-stone-100 font-serif text-sm">
                          {r.passage}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <Briefcase className="w-3 h-3 text-[#E09F3E] shrink-0" />
                          <span className="truncate">{r.profileSnapshot.profession}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 shrink-0" />
                          {new Date(r.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic font-serif leading-relaxed">
                        „{r.lichtfunke || r.coreConduit}“
                      </p>
                    </div>

                    {/* Standard-Buttons für Desktop / Klick */}
                    <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(r);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-blue-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Teilen"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteReport(r.id);
                          showToast(`Lichtfluss „${r.passage}“ gelöscht`, r);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Bericht löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectReport(r);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-[#E09F3E] hover:bg-[#E09F3E]/10 transition-colors cursor-pointer"
                        title="Öffnen"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Toast-Benachrichtigung mit Rückgängig-Button am unteren Rand */}
        {toastMessage && (
          <div className="absolute bottom-5 left-5 right-5 z-30 p-3 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 text-white border border-stone-700/60 shadow-xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="flex items-center gap-2 truncate">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{toastMessage}</span>
            </span>
            {deletedReportForUndo && onRestoreReport && (
              <button
                type="button"
                onClick={handleUndoDelete}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rückgängig</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
