import React, { useState } from 'react';
import { LightflowReport } from '../types';
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
  VolumeX,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ReportViewProps {
  report: LightflowReport;
  onToggleFavorite: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onToggleFavorite,
  onSaveNotes,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(report.notes || '');

  // Accordion-State: Speichert welche Posten aufgeklappt sind (1-basiert: 1 bis 7)
  const [openSections, setOpenSections] = useState<number[]>([1]);
  const activeReportIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Wenn derselbe Report bereits entfaltet wird, die Animation nicht durch Re-Render zurücksetzen
    if (activeReportIdRef.current === report.id) {
      return;
    }
    activeReportIdRef.current = report.id;

    // Ältere Reports aus dem Archiv sofort komplett aufklappen
    const isRecent = Date.now() - report.timestamp < 45000;
    if (!isRecent) {
      setOpenSections([1, 2, 3, 4, 5, 6, 7]);
      return;
    }

    // Bei neu generiertem Report: Startet mit nur Posten 1 offen
    setOpenSections([1]);

    // Progressive Enthüllung: Nacheinander Posten 2 bis 7 im 450ms-Takt geschmeidig aufklappen
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep <= 7) {
        setOpenSections((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      } else {
        clearInterval(interval);
      }
    }, 450);

    // Sicherheits-Fallback: Nach spätestens 3.8s sind alle Posten geöffnet
    const safeguardTimer = setTimeout(() => {
      setOpenSections([1, 2, 3, 4, 5, 6, 7]);
      clearInterval(interval);
    }, 3800);

    return () => {
      clearInterval(interval);
      clearTimeout(safeguardTimer);
    };
  }, [report.id]);

  const toggleSection = (stepNum: number) => {
    setOpenSections((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const handleCopySection = (stepNum: number, title: string, text: string) => {
    const sectionText = `LIGHTFLOW: ${report.passage}\n${title}\n\n${text}\n\n— Angeschlossen an die Quelle`;
    navigator.clipboard.writeText(sectionText).then(() => {
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

  // Vorlese-Funktion via Web Speech API
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Sprachausgabe wird von diesem Browser leider nicht unterstützt.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `Lichtfunke: ${report.lichtfunke || report.coreConduit}. Klarblick: ${report.klarblick || report.systemDecoded}. Tagwerk: ${report.tagwerk || report.workBench}. Freiraum: ${report.freiraum || report.dailyFreedom}. Standpunkt: ${report.standpunkt}. Spiegel: ${report.spiegel}. Leuchtkraft: ${report.leuchtkraft || report.heartGarden}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'de-DE';
      utterance.rate = 0.92;
      utterance.pitch = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
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
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
            {report.passage}
          </h2>
        </div>

        {/* Aktionsleiste (Audio, Favorit, Kopieren, Notiz) */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleToggleSpeech}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md animate-pulse'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60'
            }`}
            title={isPlayingAudio ? 'Vorlesen anhalten' : 'Report sanft vorlesen lassen'}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#E09F3E]" />}
            <span className="hidden md:inline">{isPlayingAudio ? 'Stopp' : 'Anhören'}</span>
          </button>

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
              </div>
              <div className="flex items-center space-x-2">
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
                <p className="font-serif text-lg sm:text-xl font-medium text-stone-900 dark:text-stone-100 leading-relaxed italic">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
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
              </div>
              <div className="flex items-center space-x-2">
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
                <div className="text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-[#E09F3E] pl-4 my-2">
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
