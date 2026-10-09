import React, { useState } from 'react';
import { CircleGroup, CircleShare } from '../types';
import { getStoredCircle, addReactionToShare } from '../services/circleService';
import { Users, X, Copy, Check, Sparkles } from 'lucide-react';

interface CircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage?: (passage: string) => void;
}

export const CircleModal: React.FC<CircleModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const [circle, setCircle] = useState<CircleGroup>(getStoredCircle());
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyInvite = () => {
    const inviteText = `Schließe dich meinem vertrauten Kreis in Lightflow an (Code: ${circle.inviteCode})\nhttps://lightflow-app-two.vercel.app`;
    navigator.clipboard.writeText(inviteText).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    });
  };

  const handleReact = (shareId: string, emoji: string) => {
    const updated = addReactionToShare(shareId, emoji, 'Du');
    setCircle(updated);
  };

  const maxSlots = 4;
  const currentMembersCount = circle.members.length;
  const freeSlots = Math.max(0, maxSlots - currentMembersCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-[#0C0F17] border border-amber-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] rounded-3xl flex flex-col overflow-hidden text-stone-100 animate-luxury-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0E131F]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#E09F3E]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{circle.name}</span>
                <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-[#E09F3E] border border-amber-500/30">
                  {currentMembersCount}/{maxSlots}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Dein geschützter Raum für echten geistlichen Austausch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Die 4 Mitglieder-Slots */}
        <div className="px-5 sm:px-6 py-4 bg-stone-950/40 border-b border-stone-800/60">
          <div className="grid grid-cols-4 gap-2">
            {circle.members.map((member) => (
              <div 
                key={member.id} 
                className="flex flex-col items-center p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-center"
              >
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm mb-1.5"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-stone-200 truncate w-full">
                  {member.name}
                </span>
                <span className="text-[10px] text-stone-500">
                  {member.role === 'host' ? 'Leiter' : 'Gefährte'}
                </span>
              </div>
            ))}

            {/* Freie Einladungs-Slots */}
            {Array.from({ length: freeSlots }).map((_, idx) => (
              <button
                key={`free_${idx}`}
                onClick={handleCopyInvite}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-dashed border-stone-700/80 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all text-center cursor-pointer group"
                title="Freund in den Kreis einladen"
              >
                <div className="w-9 h-9 rounded-full border border-dashed border-stone-600 group-hover:border-amber-400 flex items-center justify-center text-stone-400 group-hover:text-amber-300 mb-1.5 transition-colors">
                  +
                </div>
                <span className="text-[11px] font-medium text-stone-400 group-hover:text-amber-300">
                  Einladen
                </span>
                <span className="text-[10px] text-stone-500">
                  Frei
                </span>
              </button>
            ))}
          </div>

          {/* Einladungscode Banner */}
          <div className="mt-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
            <span className="text-stone-400">
              Einladungscode: <span className="font-mono font-bold text-[#E09F3E] ml-1">{circle.inviteCode}</span>
            </span>
            <button
              onClick={handleCopyInvite}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#E09F3E] hover:text-amber-300 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Kopiert!' : 'Link kopieren'}</span>
            </button>
          </div>
        </div>

        {/* Feed geteilter Erkenntnisse */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400">
            <span>Geteilte Klarblicke im Kreis</span>
            <span>{circle.shares.length} Beiträge</span>
          </div>

          {circle.shares.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Sparkles className="w-8 h-8 text-amber-500/50 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-300">Noch keine Erkenntnisse geteilt</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Tippe bei einem Klarblick oder Tagwerk auf „In den Kreis teilen“, um dein Erlebnis hier abzulegen.
              </p>
            </div>
          ) : (
            circle.shares.map((share: CircleShare) => (
              <div 
                key={share.id}
                className="p-4 sm:p-5 rounded-2xl bg-stone-900/70 border border-stone-800/90 shadow-sm space-y-3"
              >
                {/* Karten-Kopf */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-slate-950"
                      style={{ backgroundColor: share.authorColor }}
                    >
                      {share.authorName.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">
                        {share.authorName}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {share.sectionTitle} • {new Date(share.createdAt).toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Bibelstelle Badge mit Klick-Aktion */}
                  <button
                    onClick={() => {
                      if (onSelectPassage) {
                        onSelectPassage(share.passage);
                        onClose();
                      }
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-amber-500/10 text-[#E09F3E] border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    title="Diese Passage in Lightflow öffnen"
                  >
                    📖 {share.passage}
                  </button>
                </div>

                {/* Persönliche Notiz des Autors */}
                {share.userNote && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border-l-2 border-amber-500 text-xs italic text-stone-300">
                    „{share.userNote}“
                  </div>
                )}

                {/* Der geistliche Inhalt */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {share.content}
                </p>

                {/* Reaktionen & Interaktion */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800/60 text-xs">
                  <div className="flex items-center space-x-1.5">
                    {share.reactions && share.reactions.map((r, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 rounded-full bg-stone-800 text-[11px] text-stone-300 border border-stone-700/60"
                        title={`Von ${r.authorName}`}
                      >
                        {r.emoji}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleReact(share.id, '🙏')}
                      className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs transition-colors cursor-pointer"
                      title="Amen / Gebet"
                    >
                      🙏 Amen
                    </button>
                    <button
                      onClick={() => handleReact(share.id, '🕯️')}
                      className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs transition-colors cursor-pointer"
                      title="Licht / Berührt"
                    >
                      🕯️ Licht
                    </button>
                    <button
                      onClick={() => handleReact(share.id, '❤️')}
                      className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs transition-colors cursor-pointer"
                      title="Ermutigung"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
