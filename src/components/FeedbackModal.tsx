import React, { useState } from 'react';
import { X, MessageSquarePlus, Send, Check, ShieldCheck } from 'lucide-react';
import { submitFeedback } from '../services/adminService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userName = '',
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitFeedback(userName, message);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setMessage('');
        onClose();
      }, 1800);
    } catch (e) {
      console.warn('Feedback submit error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-[#E09F3E]/15 text-[#E09F3E]">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                Feedback an die Entwicklung
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Direkter Draht zu den Machern von Lightflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isSent ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-stone-800 dark:text-stone-100">
              Vielen Dank für dein Feedback!
            </div>
            <p className="text-xs text-stone-500 max-w-xs">
              Deine Rückmeldung ist direkt im Admin-Dashboard eingegangen und hilft uns enorm.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-3">
            <div className="text-xs text-stone-600 dark:text-stone-300">
              Absender:{' '}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {userName?.trim() ? userName : 'Anonym (Freund)'}
              </span>
            </div>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Was bewegt dich? Welcher Posten hat dir geholfen oder was können wir noch natürlicher und präziser machen?"
                rows={4}
                required
                className="w-full p-3 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#E09F3E] transition-all resize-none shadow-inner"
              />
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Keine Werbung, kein Spam. Wir lesen jedes Feedback persönlich.</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Wird gesendet...' : 'Absenden'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
