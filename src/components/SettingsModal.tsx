import React, { useState } from 'react';
import { AppSettings } from '../types';
import { X, Key, ShieldCheck, Check, Cpu } from 'lucide-react';

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
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#E09F3E]" />
            <h2 className="text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
              Einstellungen & KI-Engine
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
          
          {/* KI Provider Wahl */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              KI-Engine Modus
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, apiProvider: 'gemini' })}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  formData.apiProvider === 'gemini'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]'
                    : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">Google Gemini</div>
                <div className="text-[10px] mt-0.5 opacity-80">Gemini 1.5 Flash (schnell & tiefgründig)</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, apiProvider: 'openai' })}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  formData.apiProvider === 'openai'
                    ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]'
                    : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">OpenAI</div>
                <div className="text-[10px] mt-0.5 opacity-80">GPT-4o / GPT-4o-mini</div>
              </button>
            </div>
          </div>

          {/* API Key Eingabe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#E09F3E]" />
              Optionaler API-Schlüssel
            </label>
            <input
              type="password"
              value={formData.customApiKey || ''}
              onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
              placeholder={formData.apiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-xs sm:text-sm font-mono text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Ohne API-Key nutzt Lightflow die integrierte Offline-Engine mit sofortigen Auswertungen. Mit eigenem Key wird die Live-LLM mit dem System-Prompt befragt.
            </p>
          </div>

          {/* Datenschutz-Hinweis */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">100% Lokaler Datenschutz:</span> Deine Daten, dein Profil und eventuelle Schlüssel verlassen niemals dein Gerät zu Tracking-Zwecken.
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Schließen
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-all cursor-pointer shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Gespeichert' : 'Einstellungen sichern'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
