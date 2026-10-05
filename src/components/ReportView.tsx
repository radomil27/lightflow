import React, { useState } from 'react';
import { LightflowReport } from '../types';
import { useSpeechPlayer } from '../hooks/useSpeechPlayer';
import {
  Sparkles,
  Wrench,
  Cpu,
  Home,
  Sprout,
  Wind,
  Bookmark,
  Copy,
  Check,
  Volume2,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Square,
  Loader2,
  Share2,
  Edit3,
} from 'lucide-react';
import { BibleTextViewer } from './BibleTextViewer';

interface ReportViewProps {
  report: LightflowReport;
  fontSize?: 'sm' | 'md' | 'lg';
  onToggleFavorite: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onFontSizeChange?: (size: 'sm' | 'md' | 'lg') => void;
  onEditPassage?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  fontSize = 'md',
  onToggleFavorite,
  onSaveNotes,
  onFontSizeChange,
  onEditPassage,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(report.notes || '');

  // Robuster Speech-Player mit Satz-Chunking und Per-Posten-Unterstützung
  const {
    isPlaying,
    currentPlayingStep,
    playSection,
    playFullReport,
    stopSpeech,
    isSupported: isSpeechSupported,
  } = useSpeechPlayer();

  // Accordion-State: Speichert welche Posten aufgeklappt sind (1-basiert: 1 bis 7)
  const [openSections, setOpenSections] = useState<number[]>([1]);
  const activeReportIdRef = React.useRef<string | null>(null);

  // Wenn ein Posten vorgelesen wird, klappe ihn automatisch auf
  React.useEffect(() => {
    if (currentPlayingStep !== null) {
      setOpenSections((prev) =>
        prev.includes(currentPlayingStep) ? prev : [...prev, currentPlayingStep]
      );
    }
  }, [currentPlayingStep]);

  React.useEffect(() => {
    // Bei neuem Report startet Posten 1 offen, Posten 2-7 bleiben geschlossen für ruhiges Lesen
    if (activeReportIdRef.current !== report.id) {
      activeReportIdRef.current = report.id;
      // Ältere Reports aus dem Archiv (vor mehr als 1 Minute gespeichert) komplett aufgeklappt anzeigen
      const isArchived = Date.now() - report.timestamp > 60000;
      if (isArchived) {
        setOpenSections([1, 2, 3, 4, 5, 6, 7]);
      } else {
        setOpenSections([1]);
      }
    }

    return () => {
      stopSpeech();
    };
  }, [report.id, report.timestamp, stopSpeech]);

  const toggleSection = (stepNum: number) => {
    setOpenSections((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  // Statusanzeige für sequentielle Hintergrund-Generierung (1 bis 7)
  const renderSectionStatus = (stepNum: number, textVal?: string) => {
    const state = report.sectionLoadingStates?.[stepNum];
    if (state === 'loading' || (!textVal && state !== 'ready' && report.sectionLoadingStates)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-[#B45309] dark:text-[#FDE68A] border border-amber-500/20 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin text-[#E09F3E]" />
          <span>Wird geladen...</span>
        </span>
      );
    }
    if (state === 'ready' || (textVal && textVal.trim().length > 0)) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="hidden sm:inline">Bereit</span>
        </span>
      );
    }
    return null;
  };

  // Dynamische CSS-Klassen für Schriftgröße (Feierabend-Ergonomie)
  const bodyTextClass =
    fontSize === 'sm'
      ? 'text-sm'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl font-normal leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  const lichtfunkeTextClass =
    fontSize === 'sm'
      ? 'text-base sm:text-lg'
      : fontSize === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-lg sm:text-xl';

  const handleCopySection = (stepNum: number, title: string, text: string) => {
    const sectionText = `LIGHTFLOW: ${report.passage}\n${title}\n\n${text}\n\n— Angeschlossen an die Quelle\nhttps://lightflow-app-two.vercel.app`;
    navigator.clipboard.writeText(sectionText).then(() => {
      setCopiedSection(stepNum);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  // Smart-Share-Funktion für WhatsApp, Telegram & Co. (mit Web-Share API & Clipboard-Fallback)
  const handleShareSection = async (stepNum: number, title: string, text: string) => {
    const shareText = `✨ Lightflow – ${report.passage}\n${title}:\n${text}\n\n🔗 https://lightflow-app-two.vercel.app`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lightflow – ${report.passage} (${title})`,
          text: shareText,
          url: 'https://lightflow-app-two.vercel.app',
        });
        return;
      } catch (err: any) {
        // AbortError tritt auf, wenn der Nutzer das Teilen-Fenster manuell schließt
        if (err.name === 'AbortError') return;
      }
    }
    // Fallback für Desktop / nicht unterstützte Browser
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedSection(stepNum);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  // Text in Zwischenablage kopieren
  const handleCopy = () => {
    const fullText = `LIGHTFLOW REPORT: ${report.passage}
Verbindungsprofil: ${report.profileSnapshot.profession} | ${report.profileSnapshot.mindset}
Verfassung: ${report.mood}

1. LICHTFUNKE
${report.lichtfunke || report.coreConduit}

2. KLARBLICK
${report.klarblick || report.systemDecoded}

3. TAGWERK
${report.tagwerk || report.workBench}

4. FREIRAUM
${report.freiraum || report.dailyFreedom}

5. STANDPUNKT
${report.standpunkt || report.profileSnapshot.relationshipStatus}

6. SPIEGEL
${report.spiegel}

7. LEUCHTKRAFT
${report.leuchtkraft || report.heartGarden}

— Generiert mit Lightflow (Angeschlossen an die Quelle)`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">
      
      {/* Report Kopfzeile mit Metadaten & Aktionsleiste */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200/80 dark:border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="flex items-center gap-1 font-medium px-2 py-0.5 rounded-lg bg-amber-500/10 text-[#B45309] dark:text-[#FDE68A] border border-amber-500/20">
              <Briefcase className="w-3 h-3" />
              {report.profileSnapshot.professionDetail || report.profileSnapshot.profession}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-[11px]">
              {report.profileSnapshot.mindset}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-[11px]">
              {report.profileSnapshot.relationshipStatus}
            </span>
            {report.profileSnapshot.journeyStage && (
              <span className="px-2 py-0.5 rounded-lg bg-[#3E6B56]/15 text-[#2A483A] dark:text-[#A7F3D0] text-[11px]">
                {report.profileSnapshot.journeyStage}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-lg bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] text-[11px] font-medium">
              {report.mood}
            </span>
            {report.isFallback ? (
              <span 
                className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-medium"
                title={`Fallback-Grund: ${report.fallbackReason || 'Cloud nicht erreichbar'}`}
              >
                ⚡ Lokale Exegese (Offline-Schutz)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                ✨ Gemini Cloud KI
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
              {report.passage}
            </h2>
            {onEditPassage && (
              <button
                type="button"
                onClick={onEditPassage}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors cursor-pointer"
                title="Bibelstelle oder Stimmung neu anpassen"
              >
                <Edit3 className="w-4 h-4 text-[#E09F3E]" />
              </button>
            )}
          </div>
        </div>

        {/* Aktionsleiste (Audio, Favorit, Kopieren, Notiz) */}
        <div className="flex items-center space-x-2 shrink-0">
          {isSpeechSupported && (
            <button
              onClick={() => {
                if (isPlaying) {
                  stopSpeech();
                } else {
                  playFullReport(report);
                }
              }}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 animate-pulse font-semibold'
                  : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60'
              }`}
              title={isPlaying ? 'Vorlesen stoppen' : 'Gesamten Report flüssig vorlesen lassen'}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span className="hidden md:inline">
                    {currentPlayingStep ? `Posten ${currentPlayingStep}...` : 'Stopp'}
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#E09F3E]" />
                  <span className="hidden md:inline">Anhören</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onToggleFavorite(report.id)}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              report.favorite
                ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60'
            }`}
            title="Zu Favoriten hinzufügen"
          >
            <Bookmark className={`w-4 h-4 ${report.favorite ? 'fill-current text-[#E09F3E]' : ''}`} />
            <span className="hidden md:inline">Favorit</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Vollständigen Report kopieren"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copied ? 'Kopiert!' : 'Kopieren'}</span>
          </button>

          {/* Schriftgrößen-Schnellumschalter A- / A+ */}
          {onFontSizeChange && (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onFontSizeChange('sm')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'sm'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Kleine Schrift (14px)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('md')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'md'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Standard-Schrift (16px)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('lg')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'lg'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Große Schrift für den Feierabend (18px)"
              >
                A+
              </button>
            </div>
          )}

          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Persönliche Gedanken notieren"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Notiz</span>
          </button>
        </div>
      </div>

      {/* 3. Integrierter gemeinfreier Bibel-Volltext-Viewer (Schlachter 1951 / Luther 1912) */}
      <BibleTextViewer passage={report.passage} />

      {/* Notiz-Eingabefeld falls geöffnet */}
      {notesOpen && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-2">
            Eigene Gedanken & Reflektion zu dieser Auswertung
          </label>
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={3}
            placeholder="Was hat mich besonders angesprochen? Was nehme ich heute mit?"
            className="w-full p-3 text-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                onSaveNotes(report.id, notesText);
                setNotesOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-colors cursor-pointer"
            >
              Notiz speichern
            </button>
          </div>
        </div>
      )}

      {/* Die 7 Posten mit vertikal fließender Lichtlinie */}
      <div className="relative pl-6 sm:pl-10 space-y-7">
        
        {/* Vertikale Lichtleiter-Leitung links */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-6 w-0.5 bg-gradient-to-b from-[#FFFBEB] via-[#F59E0B] to-[#3E6B56] opacity-40"></div>
        <div className="absolute left-2 sm:left-3.5 top-0 w-1.5 h-12 bg-gradient-to-b from-transparent via-[#FDE68A] to-transparent rounded-full blur-[1px] animate-pulse"></div>

        {/* ========================================================
            POSTEN 1: LICHTFUNKE (Immer sofort sichtbar & ausklappbar)
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(1)}
            className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#E09F3E] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#E09F3E]/30 ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer"
          >
            1
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-[#211B14] dark:via-[#18202A] dark:to-[#18202A] border border-[#E09F3E]/40 shadow-lg shadow-[#E09F3E]/5 relative overflow-hidden backdrop-blur-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E09F3E]/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(1)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none group-hover:bg-amber-500/5 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                <Sparkles className="w-4 h-4 text-[#E09F3E]" />
                <span>1. LICHTFUNKE</span>
                {renderSectionStatus(1, report.lichtfunke || report.coreConduit)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(1, '1. Lichtfunke', report.lichtfunke || report.coreConduit || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 1
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 1 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 1 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 1 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Zuspruch per WhatsApp / Telegram teilen"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Zuspruch kopieren"
                >
                  {copiedSection === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 1 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(1) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(1) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-amber-500/15">
                <p className={`font-serif ${lichtfunkeTextClass} font-medium text-stone-900 dark:text-stone-100 leading-relaxed italic`}>
                  „{report.lichtfunke || report.coreConduit}“
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 2: KLARBLICK
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(2)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(2) ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            2
          </div>

          <div className="rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(2)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Cpu className="w-4 h-4 text-[#E09F3E]" />
                <span>2. KLARBLICK</span>
                {renderSectionStatus(2, report.klarblick || report.systemDecoded)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(2, '2. Klarblick', report.klarblick || report.systemDecoded || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 2
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 2 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 2 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 2 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 2 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 2 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(2) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(2) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60">
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.klarblick || report.systemDecoded}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 3: TAGWERK
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(3)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(3) ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            3
          </div>

          <div className="rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(3)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Wrench className="w-4 h-4 text-[#E09F3E]" />
                <span>3. TAGWERK</span>
                {renderSectionStatus(3, report.tagwerk || report.workBench)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(3, '3. Tagwerk', report.tagwerk || report.workBench || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 3
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 3 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 3 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 3 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(3, '3. TAGWERK', report.tagwerk || report.workBench || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(3, '3. TAGWERK', report.tagwerk || report.workBench || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 3 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 3 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(3) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(3) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60">
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.tagwerk || report.workBench}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 4: FREIRAUM
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(4)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(4) ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            4
          </div>

          <div className="rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(4)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Home className="w-4 h-4 text-[#E09F3E]" />
                <span>4. FREIRAUM</span>
                {renderSectionStatus(4, report.freiraum || report.dailyFreedom)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(4, '4. Freiraum', report.freiraum || report.dailyFreedom || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 4
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 4 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 4 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 4 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 4 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 4 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(4) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(4) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60">
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.freiraum || report.dailyFreedom}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 5: STANDPUNKT
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(5)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(5) ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            5
          </div>

          <div className="rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(5)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Briefcase className="w-4 h-4 text-[#E09F3E]" />
                <span>5. STANDPUNKT</span>
                {renderSectionStatus(5, report.standpunkt || report.profileSnapshot.relationshipStatus)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(5, '5. Standpunkt', report.standpunkt || report.profileSnapshot.relationshipStatus || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 5
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 5 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 5 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 5 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 5 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 5 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(5) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(5) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60">
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.standpunkt || report.profileSnapshot.relationshipStatus}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 6: SPIEGEL
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(6)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(6) ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            6
          </div>

          <div className="rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(6)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Sprout className="w-4 h-4 text-[#E09F3E]" />
                <span>6. SPIEGEL</span>
                {renderSectionStatus(6, report.spiegel)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(6, '6. Spiegel', report.spiegel || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 6
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 6 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                  >
                    {currentPlayingStep === 6 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 6 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(6, '6. SPIEGEL', report.spiegel || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(6, '6. SPIEGEL', report.spiegel || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 6 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 6 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(6) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(6) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60">
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.spiegel}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 7: LEUCHTKRAFT (Herzensgebet)
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(7)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ring-4 ring-[#FAF9F6] dark:ring-[#12161A] cursor-pointer transition-colors ${
              openSections.includes(7) ? 'bg-[#F59E0B] text-slate-950 shadow-[#F59E0B]/40 animate-light-pulse' : 'bg-slate-700 text-stone-300'
            }`}
          >
            7
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-white dark:from-[#2B2114]/90 dark:via-[#1E2024] dark:to-[#2B2114]/50 border border-[#E09F3E]/50 shadow-xl shadow-[#E09F3E]/10 relative overflow-hidden backdrop-blur-md transition-all duration-300">
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Akkordeon-Header */}
            <div 
              onClick={() => toggleSection(7)}
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none group-hover:bg-amber-500/5 transition-colors"
            >
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                <Wind className="w-4 h-4 text-[#E09F3E]" />
                <span>7. LEUCHTKRAFT</span>
                {renderSectionStatus(7, report.leuchtkraft || report.heartGarden)}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSection(7, '7. Leuchtkraft, Herzensgebet', report.leuchtkraft || report.heartGarden || '');
                    }}
                    className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                      currentPlayingStep === 7
                        ? 'bg-amber-500 text-slate-950 font-semibold animate-pulse shadow-sm'
                        : 'text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10'
                    }`}
                    title={currentPlayingStep === 7 ? 'Vorlesen anhalten' : 'Dieses Gebet vorlesen'}
                  >
                    {currentPlayingStep === 7 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{currentPlayingStep === 7 ? 'Stopp' : 'Audio'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareSection(7, '7. LEUCHTKRAFT', report.leuchtkraft || report.heartGarden || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt teilen (WhatsApp / Telegram)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Teilen</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySection(7, '7. LEUCHTKRAFT (Gebet)', report.leuchtkraft || report.heartGarden || '');
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Dieses Gebet kopieren"
                >
                  {copiedSection === 7 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 7 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
                <div className="p-1 text-stone-400 dark:text-stone-500">
                  {openSections.includes(7) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Ausgeklappter Inhalt */}
            {openSections.includes(7) && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-amber-200/50 dark:border-amber-900/30">
                <div className={`${lichtfunkeTextClass} text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-[#E09F3E] pl-4 my-2`}>
                  {report.leuchtkraft || report.heartGarden}
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Tief einatmen. Angekommen an der Quelle.</span>
                  <span className="text-[#B45309] dark:text-[#FDE68A] font-semibold">Du darfst sein.</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};
