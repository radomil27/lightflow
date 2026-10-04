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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(report.notes || '');

  // Text in Zwischenablage kopieren
  const handleCopy = () => {
    const fullText = `LIGHTFLOW REPORT: ${report.passage}
Verbindungsprofil: ${report.profileSnapshot.profession} | ${report.profileSnapshot.mindset}
Verfassung: ${report.mood}

1. DIE KERNLEITUNG:
${report.coreConduit}

2. DIE WERKBANK - ALLTAGSANALOGIE:
${report.workBench}

3. DAS SYSTEM ENTSCHLÜSSELT:
${report.systemDecoded}

4. FREIRAUM IM ALLTAG:
${report.dailyFreedom}

5. DER GARTEN IM HERZEN:
${report.heartGarden}

6. DIE SAUERSTOFFMASKE - GEBET:
${report.oxygenMask}

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
      const textToRead = `${report.coreConduit}. Zur Alltagssituation an der Werkbank: ${report.workBench}. Für deinen Garten im Herzen: ${report.heartGarden}. Die Sauerstoffmaske: ${report.oxygenMask}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'de-DE';
      utterance.rate = 0.92; // Ruhiges, warmes Lesetempo
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
              {report.profileSnapshot.profession}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-[11px]">
              {report.profileSnapshot.mindset}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-[11px]">
              {report.profileSnapshot.relationshipStatus}
            </span>
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
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-colors"
            >
              Notiz speichern
            </button>
          </div>
        </div>
      )}

      {/* Die 6 zusammenhängenden Karten mit vertikal fließender Lichtlinie */}
      <div className="relative pl-6 sm:pl-10 space-y-7">
        
        {/* Vertikale Lichtleiter-Leitung links */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-6 w-0.5 bg-gradient-to-b from-[#FFFBEB] via-[#F59E0B] to-[#3E6B56] opacity-40"></div>
        {/* Fließender Lichtimpuls entlang der Leitung */}
        <div className="absolute left-2 sm:left-3.5 top-0 w-1.5 h-12 bg-gradient-to-b from-transparent via-[#FDE68A] to-transparent rounded-full blur-[1px] animate-pulse"></div>

        {/* ========================================================
            KARTE 1: DIE KERNLEITUNG (Der Impuls)
            ======================================================== */}
        <div className="relative group">
          {/* Node Icon am Lichtleiter */}
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#E09F3E] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#E09F3E]/30 ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            1
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-[#211B14] dark:via-[#18202A] dark:to-[#18202A] border border-[#E09F3E]/40 shadow-lg shadow-[#E09F3E]/5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E09F3E]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A] mb-3">
              <Sparkles className="w-4 h-4 text-[#E09F3E]" />
              <span>1. Die Kernleitung • Der Impuls</span>
            </div>

            <p className="font-serif text-lg sm:text-xl font-medium text-stone-900 dark:text-stone-100 leading-relaxed italic">
              „{report.coreConduit}“
            </p>
          </div>
        </div>

        {/* ========================================================
            KARTE 2: DIE WERKBANK (Berufs- & Alltagsanalogie)
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            2
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md">
            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              <Wrench className="w-4 h-4 text-[#E09F3E]" />
              <span>2. Die Werkbank • Deine Alltagsanalogie</span>
            </div>

            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {report.workBench}
            </div>
          </div>
        </div>

        {/* ========================================================
            KARTE 3: DAS SYSTEM ENTSCHLÜSSELT (Für den Denker)
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            3
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md">
            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              <Cpu className="w-4 h-4 text-[#E09F3E]" />
              <span>3. Das System entschlüsselt • Für den Denker</span>
            </div>

            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line bg-stone-50/70 dark:bg-slate-900/50 p-4 rounded-2xl border border-stone-200/50 dark:border-slate-800/60 font-mono text-xs sm:text-sm">
              {report.systemDecoded}
            </div>
          </div>
        </div>

        {/* ========================================================
            KARTE 4: FREIRAUM IM ALLTAG (Privatleben & Feierabend)
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-slate-700 text-stone-200 flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            4
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md">
            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              <Home className="w-4 h-4 text-[#E09F3E]" />
              <span>4. Freiraum im Alltag • Feierabend & Privatleben</span>
            </div>

            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {report.dailyFreedom}
            </div>
          </div>
        </div>

        {/* ========================================================
            KARTE 5: DER GARTEN IM HERZEN (Salbeigrün - Auftanken)
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#3E6B56] text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#3E6B56]/30 ring-4 ring-[#FAF9F6] dark:ring-[#12161A]">
            5
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#EBF3EF]/90 via-white to-[#EBF3EF]/50 dark:from-[#1A2E24]/80 dark:via-[#18202A] dark:to-[#1A2E24]/50 border border-[#3E6B56]/40 shadow-lg shadow-[#3E6B56]/5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#3E6B56]/15 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#2A483A] dark:text-[#A7F3D0] mb-3">
              <Sprout className="w-4 h-4 text-[#3E6B56]" />
              <span>5. Der Garten im Herzen • Auftanken an der Quelle</span>
            </div>

            <div className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line font-serif">
              {report.heartGarden}
            </div>
          </div>
        </div>

        {/* ========================================================
            KARTE 6: DIE SAUERSTOFFMASKE (Herzensgebet - Warm Amber)
            ======================================================== */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#F59E0B]/40 ring-4 ring-[#FAF9F6] dark:ring-[#12161A] animate-light-pulse">
            6
          </div>

          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-white dark:from-[#2B2114]/90 dark:via-[#1E2024] dark:to-[#2B2114]/50 border border-[#E09F3E]/50 shadow-xl shadow-[#E09F3E]/10 relative overflow-hidden backdrop-blur-md">
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A] mb-3">
              <Wind className="w-4 h-4 text-[#E09F3E]" />
              <span>6. Die Sauerstoffmaske • Dein Herzensgebet</span>
            </div>

            <div className="text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-[#E09F3E] pl-4 my-2">
              {report.oxygenMask}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>Tief einatmen. Die Last ist abgelegt.</span>
              <span className="text-[#B45309] dark:text-[#FDE68A] font-semibold">Du darfst sein.</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
