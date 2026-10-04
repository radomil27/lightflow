import React, { useState } from 'react';
import { AppSettings } from '../types';
import { X, ShieldCheck, Check, Cpu, Sparkles, ChevronDown, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#E09F3E]" />
            <h2 className="text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
              Lightflow Status & System
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          
          {/* Status-Karte: Vorinstalliert */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
            <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#E09F3E]" />
              <span>KI-Engine: Vollständig vorinstalliert</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Lightflow ist fertig vorkonfiguriert. Alle Texte werden automatisch im Hintergrund generiert – passgenau zu deinem Beruf, deinem Denkstil und deiner Tagesverfassung. Keine technischen Einstellungen nötig!
            </p>
          </div>

          {/* Datenschutz-Hinweis */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Privat & Werbefrei:</span> Dein Verbindungsprofil und deine Notizen bleiben geschützt auf deinem Smartphone.
            </div>
          </div>

          {/* Einklappbarer Expertenbereich (Standardmäßig versteckt) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowDeveloperOptions(!showDeveloperOptions)}
              className="text-[11px] text-stone-400 dark:text-stone-500 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDeveloperOptions ? 'rotate-180' : ''}`} />
              <span>Entwickler-Optionen (Optional)</span>
            </button>

            {showDeveloperOptions && (
              <div className="mt-3 p-3.5 rounded-2xl bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1">
                    <Key className="w-3 h-3 text-[#E09F3E]" />
                    Eigener Gemini API-Schlüssel
                  </label>
                  <input
                    type="password"
                    value={formData.customApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4 inline mr-1" /> : null}
              <span>Verstanden</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
