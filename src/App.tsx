import React, { useState, useEffect } from 'react';
import { UserProfile, LightflowReport, AppSettings } from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredReports,
  saveReport,
  deleteReport,
  getStoredSettings,
  saveStoredSettings,
} from './services/storage';
import {
  generateLocalReport,
  generateInitialPostenReport,
  runSequentialPipeline,
} from './services/lightflowEngine';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ReportView } from './components/ReportView';
import { ProfileModal } from './components/ProfileModal';
import { SavedReportsModal } from './components/SavedReportsModal';
import { SettingsModal } from './components/SettingsModal';
import { BiblePickerModal } from './components/BiblePickerModal';
import { Sparkles, Download } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [savedReports, setSavedReports] = useState<LightflowReport[]>(getStoredReports);
  
  // Dark Mode Zustand
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Eingaben & Auswertung
  const [passage, setPassage] = useState<string>('Matthäus 12:1-14');
  const [selectedMood, setSelectedMood] = useState<string>(profile.dailyMood || 'Unter Druck / Erschöpft');
  const [currentReport, setCurrentReport] = useState<LightflowReport | null>(() => {
    // Startet direkt mit einem passgenauen Report zu Matthäus 12:1-14
    return generateLocalReport('Matthäus 12:1-14', getStoredProfile(), 'Unter Druck / Erschöpft');
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // PWA Install Prompt Event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  // Theme Synchronisation auf HTML Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Dark Mode Umschaltung
  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    const updatedSettings: AppSettings = { ...settings, theme: next ? 'dark' : 'light' };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Expliziter Theme-Wechsel (Hell / Dunkel / Automatisch)
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    let isDark = newTheme === 'dark';
    if (newTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    setDarkMode(isDark);
    const updatedSettings: AppSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Profil speichern
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
  };

  // Settings speichern
  const handleSaveSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Lichtfluss-Generierung starten (Sequentielle Posten-für-Posten-Pipeline)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passage.trim()) return;

    setIsLoading(true);
    try {
      // 1. Posten 1 blitzschnell generieren und sofort anzeigen
      const initialReport = await generateInitialPostenReport(passage, profile, selectedMood);
      setCurrentReport(initialReport);
      saveReport(initialReport);
      setSavedReports(getStoredReports());
      setIsLoading(false); // UI entsperren: Posten 1 ist sofort lesbar!

      // Sanftes Scrollen zum Auswertungs-Report
      setTimeout(() => {
        const reportElement = document.getElementById('lightflow-report');
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);

      // 2. Posten 2 bis 7 sequentiell im Hintergrund laden
      await runSequentialPipeline(
        initialReport,
        passage,
        profile,
        selectedMood,
        (updatedReport) => {
          setCurrentReport(updatedReport);
          saveReport(updatedReport);
          setSavedReports(getStoredReports());
        }
      );
    } catch (error) {
      console.error('Fehler bei der Lichtfluss-Generierung:', error);
      setIsLoading(false);
    }
  };

  // Auswahl aus dem interaktiven Bibel-Navigator (startet direkt die sequentielle Auswertung)
  const handleSelectPassageFromPicker = async (selectedPassage: string, autoSubmit: boolean = true) => {
    setPassage(selectedPassage);
    if (autoSubmit) {
      setIsLoading(true);
      try {
        const initialReport = await generateInitialPostenReport(selectedPassage, profile, selectedMood);
        setCurrentReport(initialReport);
        saveReport(initialReport);
        setSavedReports(getStoredReports());
        setIsLoading(false);

        setTimeout(() => {
          const reportElement = document.getElementById('lightflow-report');
          if (reportElement) {
            reportElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);

        await runSequentialPipeline(
          initialReport,
          selectedPassage,
          profile,
          selectedMood,
          (updatedReport) => {
            setCurrentReport(updatedReport);
            saveReport(updatedReport);
            setSavedReports(getStoredReports());
          }
        );
      } catch (error) {
        console.error('Fehler bei der Lichtfluss-Generierung:', error);
        setIsLoading(false);
      }
    }
  };

  // Favorit umschalten
  const handleToggleFavorite = (id: string) => {
    if (!currentReport || currentReport.id !== id) return;
    const isFav = !currentReport.favorite;
    const updated = { ...currentReport, favorite: isFav };
    setCurrentReport(updated);
    saveReport(updated);
    setSavedReports(getStoredReports());
  };

  // Notiz speichern
  const handleSaveNotes = (id: string, notes: string) => {
    if (!currentReport || currentReport.id !== id) return;
    const updated = { ...currentReport, notes };
    setCurrentReport(updated);
    saveReport(updated);
    setSavedReports(getStoredReports());
  };

  // Gespeicherten Report auswählen
  const handleSelectReport = (report: LightflowReport) => {
    setCurrentReport(report);
    setPassage(report.passage);
    setSelectedMood(report.mood);
    setTimeout(() => {
      const reportElement = document.getElementById('lightflow-report');
      if (reportElement) {
        reportElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Report löschen
  const handleDeleteReport = (id: string) => {
    deleteReport(id);
    setSavedReports(getStoredReports());
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#12161A] text-[#1E293B] dark:text-[#F1F5F9] transition-colors duration-300">
      
      {/* Header mit Logo, Live-Status & Profil */}
      <Header
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedCount={savedReports.length}
      />

      {/* PWA Install Banner für Mobilgeräte / Desktop */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-[#E09F3E]/20 via-[#F59E0B]/20 to-[#E09F3E]/20 border-b border-[#E09F3E]/30 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-stone-800 dark:text-stone-200">
            <Download className="w-4 h-4 text-[#E09F3E]" />
            <span>Lightflow als eigenständige App auf deinem Smartphone installieren</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallPwa}
              className="px-3 py-1 bg-[#E09F3E] text-slate-950 font-semibold rounded-lg hover:bg-[#D97706] transition-colors cursor-pointer"
            >
              Installieren
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hauptinhalt */}
      <main className="flex-1 pb-16">
        
        {/* Hero & Eingabebereich */}
        <InputSection
          passage={passage}
          setPassage={setPassage}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          profile={profile}
          onOpenPicker={() => setIsPickerOpen(true)}
        />

        {/* Auswertungs-Report */}
        {currentReport && (
          <div id="lightflow-report">
            <ReportView
              report={currentReport}
              onToggleFavorite={handleToggleFavorite}
              onSaveNotes={handleSaveNotes}
            />
          </div>
        )}

      </main>

      {/* Footer mit Marken-Leitbild */}
      <footer className="border-t border-stone-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur py-8 safe-area-footer text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-[#B45309] dark:text-[#FDE68A] font-serif font-semibold text-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span>Lightflow – Angeschlossen an die Quelle</span>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed">
            Keine moralischen Belehrungen. Keine starren Dogmen. Frischer Sauerstoff direkt in deine Realität als {profile.profession}.
          </p>
          <div className="text-[10px] text-stone-400 dark:text-stone-500 pt-2">
            PWA Offline-Ready • Lokale Browser-Verschlüsselung • Daten bleiben privat
          </div>
        </div>
      </footer>

      {/* Modale Dialoge */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <SavedReportsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        reports={savedReports}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedReports.length}
        onThemeChange={handleThemeChange}
      />

      <BiblePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectPassage={handleSelectPassageFromPicker}
        currentPassage={passage}
      />

    </div>
  );
};
