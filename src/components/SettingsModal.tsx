import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import {
  X,
  User,
  Sun,
  Moon,
  Monitor,
  Bookmark,
  History,
  Info,
  ShieldCheck,
  ChevronRight,
  Settings,
  Type,
  RefreshCw,
  Volume2,
  Eye,
  EyeOff,
  Key,
  Check,
  Share2,
  MessageCircle,
  QrCode,
  MessageSquarePlus,
  Lock,
} from 'lucide-react';
import { ShareModal } from './ShareModal';
import { FeedbackModal } from './FeedbackModal';
import { PrivacyModal } from './PrivacyModal';
import { AdminDashboardModal } from './AdminDashboardModal';
import { getOrCreateReferralCode } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  userName?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenProfile,
  onOpenSaved,
  savedCount,
  onThemeChange,
  userName = '',
}) => {
  const [speechEnabled, setSpeechEnabled] = useState(settings.speechEnabled ?? false);
  const [speechProvider, setSpeechProvider] = useState<'google' | 'openai'>(settings.speechProvider ?? 'google');
  const [speechApiKey, setSpeechApiKey] = useState(settings.speechApiKey ?? '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [speechSaved, setSpeechSaved] = useState(false);

  // Sub-Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const referralCode = getOrCreateReferralCode(userName);

  useEffect(() => {
    setSpeechEnabled(settings.speechEnabled ?? false);
    setSpeechProvider(settings.speechProvider ?? 'google');
    setSpeechApiKey(settings.speechApiKey ?? '');
  }, [settings]);

  if (!isOpen) return null;

  const handleSelectTheme = (theme: 'light' | 'dark' | 'system') => {
    onThemeChange(theme);
    const updated = { ...settings, theme };
    onSaveSettings(updated);
  };

  const handleWhatsAppShare = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}/?ref=${encodeURIComponent(referralCode)}`;
    const shareMessage = `Hey, ich nutze Lightflow für mein tägliches Bibellesen und Exegese. Probier es mal aus: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4 border-b border-stone-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#E09F3E]/15 text-[#E09F3E]">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  Einstellungen
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Lightflow PWA • Deine Schaltzentrale
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 py-4 overflow-y-auto space-y-4">
            
            {/* 1. Profil bearbeiten */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 transition-all shadow-sm flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-[#E09F3E] group-hover:bg-[#E09F3E] group-hover:text-slate-950 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                    Profil bearbeiten
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Beruf, Denkweise, Lebenssituation & Glaube
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#E09F3E] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* NEU: Lightflow weitergeben (Viral Sharing) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                    Lightflow weitergeben
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-stone-500">
                  Code: {referralCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#E09F3E]" />
                  <span>QR-Code</span>
                </button>
              </div>
            </div>

            {/* 2. Dark-, Lightmode oder Automatisch */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Erscheinungsbild
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectTheme('light')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    settings.theme === 'light'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Hell</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTheme('dark')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    settings.theme === 'dark'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dunkel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTheme('system')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    settings.theme === 'system'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Auto</span>
                </button>
              </div>
            </div>

            {/* 3. Schriftgröße */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <Type className="w-4 h-4 text-[#E09F3E]" />
                  <span>Schriftgröße</span>
                </div>
                <span className="text-[11px] text-stone-400">
                  {settings.fontSize === 'sm' ? 'Kompakt' : settings.fontSize === 'lg' ? 'Groß (Feierabend)' : 'Standard'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...settings, fontSize: 'sm' as const };
                    onSaveSettings(updated);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    settings.fontSize === 'sm'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs font-bold">A-</span>
                  <span className="text-[10px]">14px</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...settings, fontSize: 'md' as const };
                    onSaveSettings(updated);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    (settings.fontSize || 'md') === 'md'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <span className="text-sm font-bold">A</span>
                  <span className="text-[10px]">16px</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...settings, fontSize: 'lg' as const };
                    onSaveSettings(updated);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    settings.fontSize === 'lg'
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base font-bold">A+</span>
                  <span className="text-[10px]">18px</span>
                </button>
              </div>
            </div>

            {/* 4. Bibliothek & Historie */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSaved();
                }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 text-left transition-all shadow-sm flex items-center space-x-2.5 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-[#E09F3E] group-hover:bg-[#E09F3E] group-hover:text-slate-950 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                    Bibliothek
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {savedCount} Favoriten
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSaved();
                }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 text-left transition-all shadow-sm flex items-center space-x-2.5 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                    Historie
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Letzte Flüsse
                  </div>
                </div>
              </button>
            </div>

            {/* 5. Feedback & Community-Kanal */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-[#E09F3E]/60 transition-all shadow-sm flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                    Feedback an die Entwicklung
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Anregungen, Wünsche & Berichte aus deinem Alltag
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#E09F3E] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 6. Sprachausgabe (Optional & Experimentell) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#E09F3E]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                      Sprachausgabe (Optional)
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      Bring Your Own Key • Experimentell
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !speechEnabled;
                    setSpeechEnabled(nextState);
                    onSaveSettings({
                      ...settings,
                      speechEnabled: nextState,
                      speechProvider,
                      speechApiKey,
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    speechEnabled ? 'bg-[#E09F3E]' : 'bg-stone-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={speechEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      speechEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Provider and API-Key Settings */}
              <div
                className={`space-y-3 transition-opacity duration-200 ${
                  !speechEnabled ? 'opacity-40 pointer-events-none select-none' : ''
                }`}
              >
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-300 mb-1">
                    KI-Sprachdienst
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!speechEnabled}
                      onClick={() => setSpeechProvider('google')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        speechProvider === 'google'
                          ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                          : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60'
                      }`}
                    >
                      Google Cloud TTS
                    </button>
                    <button
                      type="button"
                      disabled={!speechEnabled}
                      onClick={() => setSpeechProvider('openai')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        speechProvider === 'openai'
                          ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-semibold'
                          : 'bg-stone-50 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-700/60'
                      }`}
                    >
                      OpenAI TTS
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-300 flex items-center gap-1">
                      <Key className="w-3 h-3 text-stone-400" />
                      <span>{speechProvider === 'google' ? 'Google Cloud API-Key' : 'OpenAI API-Key'}</span>
                    </label>
                    <span className="text-[10px] text-stone-400">Lokal gesichert</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={speechApiKey}
                      disabled={!speechEnabled}
                      onChange={(e) => setSpeechApiKey(e.target.value)}
                      placeholder={speechProvider === 'google' ? 'AIzaSy...' : 'sk-proj-...'}
                      className="w-full px-3 py-2 pr-10 text-xs rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#E09F3E]"
                    />
                    <button
                      type="button"
                      disabled={!speechEnabled}
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={!speechEnabled}
                    onClick={() => {
                      onSaveSettings({
                        ...settings,
                        speechEnabled,
                        speechProvider,
                        speechApiKey: speechApiKey.trim(),
                      });
                      setSpeechSaved(true);
                      setTimeout(() => setSpeechSaved(false), 2000);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {speechSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Gespeichert</span>
                      </>
                    ) : (
                      <span>Konfiguration speichern</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 7. Datenschutz & Grundsätze Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-emerald-500/60 transition-all shadow-sm flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                    Datenschutz & Grundsätze
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    CH-DSG & DSGVO konform • Auf einen Blick
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 8. Geschütztes Admin-Dashboard Trigger */}
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full p-3 rounded-2xl bg-stone-100/70 hover:bg-purple-500/10 dark:bg-slate-900/50 dark:hover:bg-purple-500/20 border border-stone-200/60 dark:border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Admin-Dashboard (PIN: 7777)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-purple-500 transition-all" />
            </button>

            {/* 9. Version der App */}
            <div className="p-3 rounded-2xl bg-stone-100/70 dark:bg-slate-900/50 border border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-stone-400" />
                <span>Version der App</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#B45309] dark:text-[#FDE68A] bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                v2.0.1 (Liquid Wave & Licht im Alltag)
              </span>
            </div>

            {/* 10. Wartung: App-Cache leeren & neu laden */}
            <div className="pt-1">
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Möchtest du den App-Cache leeren und Lightflow frisch neu laden? (Gespeicherte Favoriten bleiben erhalten)')) {
                    try {
                      if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map((k) => caches.delete(k)));
                      }
                      if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const reg of registrations) {
                          await reg.unregister();
                        }
                      }
                      Object.keys(localStorage).forEach((key) => {
                        if (key.startsWith('lf_cache_')) {
                          localStorage.removeItem(key);
                        }
                      });
                    } catch (e) {
                      console.warn('Cache-Bereinigung:', e);
                    }
                    window.location.reload();
                  }
                }}
                className="w-full p-3 rounded-2xl bg-stone-100/80 hover:bg-red-500/10 text-stone-600 hover:text-red-600 dark:bg-slate-900/60 dark:hover:bg-red-500/20 dark:text-stone-400 dark:hover:text-red-400 border border-stone-200 dark:border-slate-800 hover:border-red-500/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>App-Cache leeren & neu laden</span>
              </button>
            </div>

            {/* 11. Zu unterst: Privat & werbefrei */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold">Privat und werbefrei:</span> Dein Verbindungsprofil und deine Notizen bleiben geschützt auf deinem Smartphone.
              </div>
            </div>

          </div>

          {/* Schließen Button */}
          <div className="p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-stone-950 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] rounded-xl transition-all cursor-pointer shadow-sm text-center"
            >
              Fertig
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        referralCode={referralCode}
        userName={userName}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userName={userName}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};
