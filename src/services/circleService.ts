/**
 * Lightflow Circle of 4 Service
 * Verwaltet den geschützten Kreis von maximal 4 Personen
 * (Lokaler Zustand + Supabase Cloud-Bereitschaft).
 */

import { CircleGroup, CircleShare, LightSealType } from '../types';

const STORAGE_KEYS = {
  CIRCLE: 'lightflow_circle_group_v2',
};

const AVATAR_COLORS = [
  '#E09F3E', // Gold
  '#3E6B56', // Salbei
  '#3B82F6', // Saphir
  '#EC4899', // Rosé
];

const INITIAL_DEMO_CIRCLE: CircleGroup = {
  id: 'circle_default',
  name: 'Vertrauter Kreis',
  inviteCode: 'QUELLE-4',
  createdAt: new Date().toISOString(),
  members: [
    {
      id: 'me',
      name: 'Du',
      avatarColor: AVATAR_COLORS[0],
      role: 'host',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'mem_1',
      name: 'Sarah',
      avatarColor: AVATAR_COLORS[1],
      role: 'member',
      joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'mem_2',
      name: 'Matthias',
      avatarColor: AVATAR_COLORS[2],
      role: 'member',
      joinedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
  shares: [
    {
      id: 'share_demo_1',
      authorId: 'mem_1',
      authorName: 'Sarah',
      authorColor: AVATAR_COLORS[1],
      passage: 'Lukas 7:11-17',
      sectionIndex: 2,
      sectionTitle: '2. KLARBLICK',
      content: 'Das Erbarmen Jesu (splanchnizomai) ist kein flüchtiges Mitleid, sondern eine Erschütterung des Innersten, die Leben schenkt.',
      userNote: 'Das hat mich heute im Pflegeheim so getragen, als ich keine Geduld mehr hatte.',
      seal: 'peace',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      reactions: [
        { id: 'r1', authorName: 'Matthias', emoji: '🙏' },
        { id: 'r2', authorName: 'Du', emoji: '🕯️' },
      ],
    },
  ],
};

export function getStoredCircle(): CircleGroup {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CIRCLE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CIRCLE, JSON.stringify(INITIAL_DEMO_CIRCLE));
      return INITIAL_DEMO_CIRCLE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Fehler beim Laden des Kreises:', e);
    return INITIAL_DEMO_CIRCLE;
  }
}

export function saveCircle(circle: CircleGroup): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CIRCLE, JSON.stringify(circle));
  } catch (e) {
    console.error('Fehler beim Speichern des Kreises:', e);
  }
}

export function shareInsightToCircle(params: {
  passage: string;
  sectionIndex: number;
  sectionTitle: string;
  content: string;
  userNote?: string;
  seal?: LightSealType;
  authorName?: string;
}): CircleGroup {
  const current = getStoredCircle();
  const authorName = params.authorName || 'Du';
  
  const newShare: CircleShare = {
    id: 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    authorId: 'me',
    authorName,
    authorColor: AVATAR_COLORS[0],
    passage: params.passage,
    sectionIndex: params.sectionIndex,
    sectionTitle: params.sectionTitle,
    content: params.content,
    userNote: params.userNote,
    seal: params.seal,
    createdAt: new Date().toISOString(),
    reactions: [],
  };

  const updated: CircleGroup = {
    ...current,
    shares: [newShare, ...current.shares],
  };

  saveCircle(updated);
  return updated;
}

export function addReactionToShare(shareId: string, emoji: string, authorName: string = 'Du'): CircleGroup {
  const current = getStoredCircle();
  const updatedShares = current.shares.map((share) => {
    if (share.id !== shareId) return share;
    const existing = share.reactions || [];
    return {
      ...share,
      reactions: [...existing, { id: 're_' + Date.now(), authorName, emoji }],
    };
  });

  const updated: CircleGroup = {
    ...current,
    shares: updatedShares,
  };

  saveCircle(updated);
  return updated;
}
