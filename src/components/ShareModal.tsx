import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Share2, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  userName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  referralCode,
  userName = '',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Erstelle den Einladungs-Link
  const origin = window.location.origin;
  const shareUrl = `${origin}/?ref=${encodeURIComponent(referralCode)}`;
  const senderGreeting = userName?.trim() ? `Hey von ${userName.trim()}, ich` : 'Hey, ich';
  const shareMessage = `${senderGreeting} nutze Lightflow für mein tägliches Bibellesen und Exegese. Probier es mal aus: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard error:', e);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 overflow-hidden text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-1.5 rounded-xl bg-[#E09F3E]/15 text-[#E09F3E]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                Lightflow weitergeben
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Dein persönlicher Einladungs-Code: <span className="font-mono font-semibold text-[#B45309] dark:text-[#FDE68A]">{referralCode}</span>
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

        {/* QR Code Container */}
        <div className="py-5 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-stone-200 dark:border-slate-700 inline-block">
            <QRCodeSVG
              value={shareUrl}
              size={180}
              level="M"
              includeMargin={false}
              fgColor="#1C1917"
            />
          </div>
          <p className="mt-3 text-xs text-stone-600 dark:text-stone-300 max-w-xs">
            Halte das Handy einfach im Hauskreis oder Gespräch hin – direkt mit der Kamera scannen.
          </p>
        </div>

        {/* Actions: WhatsApp & Copy */}
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Per WhatsApp teilen</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Link in Zwischenablage kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-400" />
                <span>Einladungs-Link kopieren</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
