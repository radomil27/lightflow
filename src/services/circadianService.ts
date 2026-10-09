/**
 * Lightflow Circadian Lighting Engine
 * Erkennt die aktuelle Tageszeit und liefert Farbnuancen, Stimmungen
 * und den täglichen Leitvers (Wort des Tages) für v2.0.
 */

export type TimeOfDay = 'morning' | 'day' | 'evening';

export interface DailyImpulse {
  passage: string;
  title: string;
  note: string;
  dimension: string;
}

export interface CircadianTheme {
  timeOfDay: TimeOfDay;
  greeting: string;
  subGreeting: string;
  tagline: string;
  glowColor: string;
  badgeLabel: string;
  dailyImpulse: DailyImpulse;
}

// Hochwertige, rotierende Tagesimpulse (nach Tag des Monats gewählt)
const ROTATING_IMPULSES: DailyImpulse[] = [
  {
    passage: 'Matthäus 11:28-30',
    title: 'Die leichte Last',
    note: 'Sauerstoffmaske für Mühselige: Nicht aus eigener Kraft krampfen.',
    dimension: 'Gnade & Ruhe',
  },
  {
    passage: 'Johannes 15:5',
    title: 'Der Weinstock',
    note: 'Wer in mir bleibt und ich in ihm, der bringt viel Frucht.',
    dimension: 'Verbundenheit',
  },
  {
    passage: 'Philipper 4:6-7',
    title: 'Friede statt Panik',
    note: 'Schutzmechanismus für Herz und Gedanken mitten im Druck.',
    dimension: 'Überwindung',
  },
  {
    passage: 'Psalm 23:1-3',
    title: 'Frische Wasser',
    note: 'Auftanken ohne Leistungsdruck mitten im Tal.',
    dimension: 'Versorgung',
  },
  {
    passage: 'Kolosser 3:23-24',
    title: 'Werkbank für den Herrn',
    note: 'Was immer ihr tut, tut es von Herzen – als Dienst für Christus.',
    dimension: 'Tat & Gehorsam',
  },
  {
    passage: 'Römer 12:2',
    title: 'Veränderter Sinn',
    note: 'Stellt euch nicht dieser Welt gleich, sondern prüft Gottes Willen.',
    dimension: 'Klarblick',
  },
  {
    passage: 'Jesaja 40:29-31',
    title: 'Flügel wie Adler',
    note: 'Er gibt dem Müden Kraft und Stärke dem Unvermögenden.',
    dimension: 'Erneuerung',
  },
  {
    passage: 'Sprüche 3:5-6',
    title: 'Ganzes Vertrauen',
    note: 'Verlass dich nicht auf deinen Verstand; er ebnet deine Pfade.',
    dimension: 'Orientierung',
  },
];

export function getCircadianTheme(now: Date = new Date()): CircadianTheme {
  const hour = now.getHours();
  const dayOfMonth = now.getDate();
  const impulseIndex = dayOfMonth % ROTATING_IMPULSES.length;
  const dailyImpulse = ROTATING_IMPULSES[impulseIndex];

  if (hour >= 5 && hour < 11) {
    return {
      timeOfDay: 'morning',
      greeting: 'Morgenlicht',
      subGreeting: 'Ausrichtung vor dem Ansturm des Tages',
      tagline: 'Lichtfunke & Aufbruch',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      badgeLabel: 'Morgenglanz',
      dailyImpulse,
    };
  }

  if (hour >= 11 && hour < 17) {
    return {
      timeOfDay: 'day',
      greeting: 'Mittagsklarheit',
      subGreeting: 'Halt und Treue mitten im Tagwerk',
      tagline: 'Fokus & Standfestigkeit',
      glowColor: 'rgba(224, 159, 62, 0.22)',
      badgeLabel: 'Tagesfokus',
      dailyImpulse,
    };
  }

  return {
    timeOfDay: 'evening',
    greeting: 'Abendstille',
    subGreeting: 'Die Last des Tages an Seinem Kreuz ablegen',
    tagline: 'Stille & Gnade',
    glowColor: 'rgba(194, 130, 36, 0.18)',
    badgeLabel: 'Abendlicht',
    dailyImpulse,
  };
}
