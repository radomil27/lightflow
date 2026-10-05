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

  // Schrittweise Enthüllung der 7 Posten (Posten 1 erscheint sofort, 2-7 enthüllen sich flüssig)
  const [unlockedStep, setUnlockedStep] = useState<number>(1);
  const activeReportIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Wenn derselbe Report bereits entriegelt wird, die laufende Animation nicht durch Re-Render abbrechen
    if (activeReportIdRef.current === report.id) {
      return;
    }
    activeReportIdRef.current = report.id;

    // Ältere Reports aus dem Archiv sofort komplett aufdecken
    const isRecent = Date.now() - report.timestamp < 60000;
    if (!isRecent) {
      setUnlockedStep(7);
      return;
    }

    // Bei neu generiertem Report: Start bei 1, dann schrittweises Entriegeln im 500ms-Takt
    setUnlockedStep(1);

    const interval = setInterval(() => {
      setUnlockedStep((prev) => {
        if (prev >= 7) {
          clearInterval(interval);
          return 7;
        }
        return prev + 1;
      });
    }, 550);

    // Absoluter Sicherheits-Fallback: Nach spätestens 4 Sekunden sind garantiert alle 7 Posten offen
    const safeguardTimer = setTimeout(() => {
      setUnlockedStep(7);
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(safeguardTimer);
    };
  }, [report.id]);

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
            POSTEN 1: LICHTFUNKE (Immer sofort sichtbar)
            ======================================================== */}
        <div className="relative group animate-in fade-in duration-500">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#E09F3E] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#E09F3E]/30 ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            1
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-[#211B14] dark:via-[#18202A] dark:to-[#18202A] border border-[#E09F3E]/40 shadow-lg shadow-[#E09F3E]/5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E09F3E]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                <Sparkles className="w-4 h-4 text-[#E09F3E]" />
                <span>1. LICHTFUNKE</span>
              </div>
              <button
                onClick={() => handleCopySection(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Diesen Zuspruch kopieren"
              >
                {copiedSection === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] hidden sm:inline">{copiedSection === 1 ? 'Kopiert' : 'Kopieren'}</span>
              </button>
            </div>

            <p className="font-serif text-lg sm:text-xl font-medium text-stone-900 dark:text-stone-100 leading-relaxed italic">
              „{report.lichtfunke || report.coreConduit}“
            </p>
          </div>
        </div>

        {/* ========================================================
            POSTEN 2: KLARBLICK
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            2
          </div>

          {unlockedStep >= 2 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Cpu className="w-4 h-4 text-[#E09F3E]" />
                  <span>2. KLARBLICK</span>
                </div>
                <button
                  onClick={() => handleCopySection(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 2 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 2 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {report.klarblick || report.systemDecoded}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-stone-100/60 dark:bg-slate-900/40 border border-stone-200/50 dark:border-slate-800/50 animate-pulse cursor-pointer hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 dark:text-stone-500 mb-3">
                <Cpu className="w-4 h-4 text-stone-400" />
                <span>2. KLARBLICK wird aufbereitet... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-4 bg-stone-200/80 dark:bg-slate-800/80 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-200/60 dark:bg-slate-800/60 rounded-md w-1/2"></div>
            </div>
          )}
        </div>

        {/* ========================================================
            POSTEN 3: TAGWERK
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            3
          </div>

          {unlockedStep >= 3 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Wrench className="w-4 h-4 text-[#E09F3E]" />
                  <span>3. TAGWERK</span>
                </div>
                <button
                  onClick={() => handleCopySection(3, '3. TAGWERK', report.tagwerk || report.workBench || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 3 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 3 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {report.tagwerk || report.workBench}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-stone-100/60 dark:bg-slate-900/40 border border-stone-200/50 dark:border-slate-800/50 animate-pulse cursor-pointer hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 dark:text-stone-500 mb-3">
                <Wrench className="w-4 h-4 text-stone-400" />
                <span>3. TAGWERK lädt nach... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-4 bg-stone-200/80 dark:bg-slate-800/80 rounded-md w-5/6 mb-2"></div>
              <div className="h-4 bg-stone-200/60 dark:bg-slate-800/60 rounded-md w-2/3"></div>
            </div>
          )}
        </div>

        {/* ========================================================
            POSTEN 4: FREIRAUM
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            4
          </div>

          {unlockedStep >= 4 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Home className="w-4 h-4 text-[#E09F3E]" />
                  <span>4. FREIRAUM</span>
                </div>
                <button
                  onClick={() => handleCopySection(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 4 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 4 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {report.freiraum || report.dailyFreedom}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-stone-100/60 dark:bg-slate-900/40 border border-stone-200/50 dark:border-slate-800/50 animate-pulse cursor-pointer hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 dark:text-stone-500 mb-3">
                <Home className="w-4 h-4 text-stone-400" />
                <span>4. FREIRAUM lädt nach... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-4 bg-stone-200/80 dark:bg-slate-800/80 rounded-md w-4/5 mb-2"></div>
              <div className="h-4 bg-stone-200/60 dark:bg-slate-800/60 rounded-md w-1/2"></div>
            </div>
          )}
        </div>

        {/* ========================================================
            POSTEN 5: STANDPUNKT
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            5
          </div>

          {unlockedStep >= 5 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Briefcase className="w-4 h-4 text-[#E09F3E]" />
                  <span>5. STANDPUNKT</span>
                </div>
                <button
                  onClick={() => handleCopySection(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 5 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 5 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {report.standpunkt || report.profileSnapshot.relationshipStatus}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-stone-100/60 dark:bg-slate-900/40 border border-stone-200/50 dark:border-slate-800/50 animate-pulse cursor-pointer hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 dark:text-stone-500 mb-3">
                <Briefcase className="w-4 h-4 text-stone-400" />
                <span>5. STANDPUNKT lädt nach... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-4 bg-stone-200/80 dark:bg-slate-800/80 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-200/60 dark:bg-slate-800/60 rounded-md w-1/3"></div>
            </div>
          )}
        </div>

        {/* ========================================================
            POSTEN 6: SPIEGEL
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            6
          </div>

          {unlockedStep >= 6 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Sprout className="w-4 h-4 text-[#E09F3E]" />
                  <span>6. SPIEGEL</span>
                </div>
                <button
                  onClick={() => handleCopySection(6, '6. SPIEGEL', report.spiegel || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Diesen Abschnitt kopieren"
                >
                  {copiedSection === 6 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 6 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {report.spiegel}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-stone-100/60 dark:bg-slate-900/40 border border-stone-200/50 dark:border-slate-800/50 animate-pulse cursor-pointer hover:bg-stone-200/40 dark:hover:bg-slate-800/40 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 dark:text-stone-500 mb-3">
                <Sprout className="w-4 h-4 text-stone-400" />
                <span>6. SPIEGEL lädt nach... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-4 bg-stone-200/80 dark:bg-slate-800/80 rounded-md w-5/6 mb-2"></div>
              <div className="h-4 bg-stone-200/60 dark:bg-slate-800/60 rounded-md w-1/2"></div>
            </div>
          )}
        </div>

        {/* ========================================================
            POSTEN 7: LEUCHTKRAFT
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#F59E0B]/40 ring-4 ring-[#FAF9F6] dark:ring-[#12161A] animate-light-pulse">
            7
          </div>

          {unlockedStep >= 7 ? (
            <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-white dark:from-[#2B2114]/90 dark:via-[#1E2024] dark:to-[#2B2114]/50 border border-[#E09F3E]/50 shadow-xl shadow-[#E09F3E]/10 relative overflow-hidden backdrop-blur-md animate-in fade-in duration-500">
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                  <Wind className="w-4 h-4 text-[#E09F3E]" />
                  <span>7. LEUCHTKRAFT</span>
                </div>
                <button
                  onClick={() => handleCopySection(7, '7. LEUCHTKRAFT (Gebet)', report.leuchtkraft || report.heartGarden || '')}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#E09F3E] hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Dieses Gebet kopieren"
                >
                  {copiedSection === 7 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{copiedSection === 7 ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-[#E09F3E] pl-4 my-2">
                {report.leuchtkraft || report.heartGarden}
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Tief einatmen. Angekommen an der Quelle.</span>
                <span className="text-[#B45309] dark:text-[#FDE68A] font-semibold">Du darfst sein.</span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setUnlockedStep(7)}
              className="rounded-3xl p-6 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 animate-pulse cursor-pointer hover:bg-amber-500/10 transition-colors"
              title="Klicken, um sofort aufzudecken"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-3">
                <Wind className="w-4 h-4 text-amber-500" />
                <span>7. LEUCHTKRAFT (Herzensgebet) wird vollendet... (klicken zum Aufdecken)</span>
              </div>
              <div className="h-5 bg-amber-200/40 dark:bg-amber-900/30 rounded-md w-full mb-2"></div>
              <div className="h-5 bg-amber-200/30 dark:bg-amber-900/20 rounded-md w-2/3"></div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
