/**
 * Lightflow Bibel-Datenstruktur
 * Enthält alle 66 Bücher des Alten und Neuen Testaments mit exakten Bolls-Life-IDs (1-66),
 * vollständigen deutschen Alias-Namen / Abkürzungen und verifizierten Kapitelanzahlen.
 */

import VERSE_COUNTS_DATA from './verseCounts.json';

export const VERSE_COUNTS: Record<string, Record<number, number>> = VERSE_COUNTS_DATA;

export interface BibleBook {
  id: string;              // Standard-ID (z. B. 'gen', 'matt')
  bookNumber: number;      // 1-basierte Bolls-Life-ID (1 bis 66)
  name: string;            // Standard-Name auf Deutsch (z. B. '1. Mose', 'Matthäus')
  shortName: string;       // Gängige Kurzform (z. B. '1Mo', 'Mt')
  aliases: string[];       // Alle gängigen deutschen Schreibweisen & Abkürzungen
  testament: 'AT' | 'NT';
  chapters: number;        // Exakte Anzahl an Kapiteln
  versesPerChapter?: Record<number, number>;
}

export const OLD_TESTAMENT_BOOKS: BibleBook[] = [
  {
    id: 'gen',
    bookNumber: 1,
    name: '1. Mose',
    shortName: '1Mo',
    aliases: ['1. Mose', '1 Mose', '1Mo', '1.Mo', 'Genesis', 'Gen'],
    testament: 'AT',
    chapters: 50,
  },
  {
    id: 'ex',
    bookNumber: 2,
    name: '2. Mose',
    shortName: '2Mo',
    aliases: ['2. Mose', '2 Mose', '2Mo', '2.Mo', 'Exodus', 'Ex'],
    testament: 'AT',
    chapters: 40,
  },
  {
    id: 'lev',
    bookNumber: 3,
    name: '3. Mose',
    shortName: '3Mo',
    aliases: ['3. Mose', '3 Mose', '3Mo', '3.Mo', 'Levitikus', 'Lev'],
    testament: 'AT',
    chapters: 27,
  },
  {
    id: 'num',
    bookNumber: 4,
    name: '4. Mose',
    shortName: '4Mo',
    aliases: ['4. Mose', '4 Mose', '4Mo', '4.Mo', 'Numeri', 'Num'],
    testament: 'AT',
    chapters: 36,
  },
  {
    id: 'deut',
    bookNumber: 5,
    name: '5. Mose',
    shortName: '5Mo',
    aliases: ['5. Mose', '5 Mose', '5Mo', '5.Mo', 'Deuteronomium', 'Dtn', 'Deut'],
    testament: 'AT',
    chapters: 34,
  },
  {
    id: 'josh',
    bookNumber: 6,
    name: 'Josua',
    shortName: 'Jos',
    aliases: ['Josua', 'Jos'],
    testament: 'AT',
    chapters: 24,
  },
  {
    id: 'judg',
    bookNumber: 7,
    name: 'Richter',
    shortName: 'Ri',
    aliases: ['Richter', 'Ri', 'Rcht'],
    testament: 'AT',
    chapters: 21,
  },
  {
    id: 'ruth',
    bookNumber: 8,
    name: 'Ruth',
    shortName: 'Rut',
    aliases: ['Ruth', 'Rut'],
    testament: 'AT',
    chapters: 4,
    versesPerChapter: { 1: 22, 2: 23, 3: 18, 4: 22 },
  },
  {
    id: '1sam',
    bookNumber: 9,
    name: '1. Samuel',
    shortName: '1Sam',
    aliases: ['1. Samuel', '1 Samuel', '1Sam', '1.Sam'],
    testament: 'AT',
    chapters: 31,
  },
  {
    id: '2sam',
    bookNumber: 10,
    name: '2. Samuel',
    shortName: '2Sam',
    aliases: ['2. Samuel', '2 Samuel', '2Sam', '2.Sam'],
    testament: 'AT',
    chapters: 24,
  },
  {
    id: '1kings',
    bookNumber: 11,
    name: '1. Könige',
    shortName: '1Kön',
    aliases: ['1. Könige', '1 Könige', '1Kön', '1.Kön', '1Koenige', '1. Koenige'],
    testament: 'AT',
    chapters: 22,
  },
  {
    id: '2kings',
    bookNumber: 12,
    name: '2. Könige',
    shortName: '2Kön',
    aliases: ['2. Könige', '2 Könige', '2Kön', '2.Kön', '2Koenige', '2. Koenige'],
    testament: 'AT',
    chapters: 25,
  },
  {
    id: '1chron',
    bookNumber: 13,
    name: '1. Chronik',
    shortName: '1Chr',
    aliases: ['1. Chronik', '1 Chronik', '1Chr', '1.Chr'],
    testament: 'AT',
    chapters: 29,
  },
  {
    id: '2chron',
    bookNumber: 14,
    name: '2. Chronik',
    shortName: '2Chr',
    aliases: ['2. Chronik', '2 Chronik', '2Chr', '2.Chr'],
    testament: 'AT',
    chapters: 36,
  },
  {
    id: 'ezra',
    bookNumber: 15,
    name: 'Esra',
    shortName: 'Esr',
    aliases: ['Esra', 'Esr'],
    testament: 'AT',
    chapters: 10,
  },
  {
    id: 'neh',
    bookNumber: 16,
    name: 'Nehemia',
    shortName: 'Neh',
    aliases: ['Nehemia', 'Neh'],
    testament: 'AT',
    chapters: 13,
  },
  {
    id: 'esth',
    bookNumber: 17,
    name: 'Ester',
    shortName: 'Est',
    aliases: ['Ester', 'Est', 'Esther'],
    testament: 'AT',
    chapters: 10,
  },
  {
    id: 'job',
    bookNumber: 18,
    name: 'Hiob',
    shortName: 'Hi',
    aliases: ['Hiob', 'Hi', 'Job'],
    testament: 'AT',
    chapters: 42,
  },
  {
    id: 'ps',
    bookNumber: 19,
    name: 'Psalmen',
    shortName: 'Ps',
    aliases: ['Psalmen', 'Psalm', 'Ps', 'Psalter'],
    testament: 'AT',
    chapters: 150,
    versesPerChapter: { 23: 6, 91: 16, 119: 176, 121: 8, 139: 24 },
  },
  {
    id: 'prov',
    bookNumber: 20,
    name: 'Sprüche',
    shortName: 'Spr',
    aliases: ['Sprüche', 'Spr', 'Sprueche', 'Proverbia'],
    testament: 'AT',
    chapters: 31,
  },
  {
    id: 'eccl',
    bookNumber: 21,
    name: 'Prediger',
    shortName: 'Pred',
    aliases: ['Prediger', 'Pred', 'Kohelet', 'Ecclesiastes'],
    testament: 'AT',
    chapters: 12,
  },
  {
    id: 'song',
    bookNumber: 22,
    name: 'Hohelied',
    shortName: 'Hld',
    aliases: ['Hohelied', 'Hld', 'Hoheslied', 'Canticum'],
    testament: 'AT',
    chapters: 8,
  },
  {
    id: 'isa',
    bookNumber: 23,
    name: 'Jesaja',
    shortName: 'Jes',
    aliases: ['Jesaja', 'Jes', 'Isaias'],
    testament: 'AT',
    chapters: 66,
  },
  {
    id: 'jer',
    bookNumber: 24,
    name: 'Jeremia',
    shortName: 'Jer',
    aliases: ['Jeremia', 'Jer'],
    testament: 'AT',
    chapters: 52,
  },
  {
    id: 'lam',
    bookNumber: 25,
    name: 'Klagelieder',
    shortName: 'Klag',
    aliases: ['Klagelieder', 'Klag', 'Klgl', 'Klagelieder Jeremias'],
    testament: 'AT',
    chapters: 5,
  },
  {
    id: 'ezek',
    bookNumber: 26,
    name: 'Hesekiel',
    shortName: 'Hes',
    aliases: ['Hesekiel', 'Hes', 'Ezechiel', 'Ez'],
    testament: 'AT',
    chapters: 48,
  },
  {
    id: 'dan',
    bookNumber: 27,
    name: 'Daniel',
    shortName: 'Dan',
    aliases: ['Daniel', 'Dan'],
    testament: 'AT',
    chapters: 12,
  },
  {
    id: 'hos',
    bookNumber: 28,
    name: 'Hosea',
    shortName: 'Hos',
    aliases: ['Hosea', 'Hos'],
    testament: 'AT',
    chapters: 14,
  },
  {
    id: 'joel',
    bookNumber: 29,
    name: 'Joel',
    shortName: 'Joe',
    aliases: ['Joel', 'Joe'],
    testament: 'AT',
    chapters: 3, // In Schlachter/Luther hat Joel 3 Kapitel (Kapitel 4 existiert nicht in Bolls)
  },
  {
    id: 'amos',
    bookNumber: 30,
    name: 'Amos',
    shortName: 'Am',
    aliases: ['Amos', 'Am'],
    testament: 'AT',
    chapters: 9,
  },
  {
    id: 'obad',
    bookNumber: 31,
    name: 'Obadja',
    shortName: 'Ob',
    aliases: ['Obadja', 'Ob', 'Obadiah'],
    testament: 'AT',
    chapters: 1,
    versesPerChapter: { 1: 21 },
  },
  {
    id: 'jonah',
    bookNumber: 32,
    name: 'Jona',
    shortName: 'Jon',
    aliases: ['Jona', 'Jon', 'Jonas'],
    testament: 'AT',
    chapters: 4,
  },
  {
    id: 'mic',
    bookNumber: 33,
    name: 'Micha',
    shortName: 'Mi',
    aliases: ['Micha', 'Mi'],
    testament: 'AT',
    chapters: 7,
  },
  {
    id: 'nah',
    bookNumber: 34,
    name: 'Nahum',
    shortName: 'Nah',
    aliases: ['Nahum', 'Nah'],
    testament: 'AT',
    chapters: 3,
  },
  {
    id: 'hab',
    bookNumber: 35,
    name: 'Habakuk',
    shortName: 'Hab',
    aliases: ['Habakuk', 'Hab'],
    testament: 'AT',
    chapters: 3,
  },
  {
    id: 'zeph',
    bookNumber: 36,
    name: 'Zefanja',
    shortName: 'Zef',
    aliases: ['Zefanja', 'Zef', 'Zephania', 'Zeph'],
    testament: 'AT',
    chapters: 3,
  },
  {
    id: 'hag',
    bookNumber: 37,
    name: 'Haggai',
    shortName: 'Hag',
    aliases: ['Haggai', 'Hag'],
    testament: 'AT',
    chapters: 2,
  },
  {
    id: 'zech',
    bookNumber: 38,
    name: 'Sacharja',
    shortName: 'Sach',
    aliases: ['Sacharja', 'Sach', 'Zacharias'],
    testament: 'AT',
    chapters: 14,
  },
  {
    id: 'mal',
    bookNumber: 39,
    name: 'Maleachi',
    shortName: 'Mal',
    aliases: ['Maleachi', 'Mal'],
    testament: 'AT',
    chapters: 4, // 4 Kapitel in Schlachter & Luther
  },
];

export const NEW_TESTAMENT_BOOKS: BibleBook[] = [
  {
    id: 'matt',
    bookNumber: 40,
    name: 'Matthäus',
    shortName: 'Mt',
    aliases: ['Matthäus', 'Matthaeus', 'Mt', 'Matt', 'Matth'],
    testament: 'NT',
    chapters: 28,
    versesPerChapter: { 11: 30, 12: 50, 28: 20 },
  },
  {
    id: 'mark',
    bookNumber: 41,
    name: 'Markus',
    shortName: 'Mk',
    aliases: ['Markus', 'Mk', 'Mark'],
    testament: 'NT',
    chapters: 16,
  },
  {
    id: 'luke',
    bookNumber: 42,
    name: 'Lukas',
    shortName: 'Lk',
    aliases: ['Lukas', 'Lk', 'Luk'],
    testament: 'NT',
    chapters: 24,
  },
  {
    id: 'john',
    bookNumber: 43,
    name: 'Johannes',
    shortName: 'Joh',
    aliases: ['Johannes', 'Joh', 'Jn'],
    testament: 'NT',
    chapters: 21,
    versesPerChapter: { 1: 51, 3: 36, 15: 27 },
  },
  {
    id: 'acts',
    bookNumber: 44,
    name: 'Apostelgeschichte',
    shortName: 'Apg',
    aliases: ['Apostelgeschichte', 'Apg', 'Acts'],
    testament: 'NT',
    chapters: 28,
  },
  {
    id: 'rom',
    bookNumber: 45,
    name: 'Römer',
    shortName: 'Röm',
    aliases: ['Römer', 'Roemer', 'Röm', 'Roem', 'Rom'],
    testament: 'NT',
    chapters: 16,
    versesPerChapter: { 8: 39, 12: 21 },
  },
  {
    id: '1cor',
    bookNumber: 46,
    name: '1. Korinther',
    shortName: '1Kor',
    aliases: ['1. Korinther', '1 Korinther', '1Kor', '1.Kor', '1 Cor', '1. Cor'],
    testament: 'NT',
    chapters: 16,
    versesPerChapter: { 13: 13 },
  },
  {
    id: '2cor',
    bookNumber: 47,
    name: '2. Korinther',
    shortName: '2Kor',
    aliases: ['2. Korinther', '2 Korinther', '2Kor', '2.Kor', '2 Cor', '2. Cor'],
    testament: 'NT',
    chapters: 13,
  },
  {
    id: 'gal',
    bookNumber: 48,
    name: 'Galater',
    shortName: 'Gal',
    aliases: ['Galater', 'Gal'],
    testament: 'NT',
    chapters: 6,
  },
  {
    id: 'eph',
    bookNumber: 49,
    name: 'Epheser',
    shortName: 'Eph',
    aliases: ['Epheser', 'Eph'],
    testament: 'NT',
    chapters: 6,
    versesPerChapter: { 5: 33, 6: 24 },
  },
  {
    id: 'phil',
    bookNumber: 50,
    name: 'Philipper',
    shortName: 'Phil',
    aliases: ['Philipper', 'Phil'],
    testament: 'NT',
    chapters: 4,
    versesPerChapter: { 4: 23 },
  },
  {
    id: 'col',
    bookNumber: 51,
    name: 'Kolosser',
    shortName: 'Kol',
    aliases: ['Kolosser', 'Kol', 'Col'],
    testament: 'NT',
    chapters: 4,
  },
  {
    id: '1thess',
    bookNumber: 52,
    name: '1. Thessalonicher',
    shortName: '1Thess',
    aliases: ['1. Thessalonicher', '1 Thessalonicher', '1Thess', '1.Thess'],
    testament: 'NT',
    chapters: 5,
  },
  {
    id: '2thess',
    bookNumber: 53,
    name: '2. Thessalonicher',
    shortName: '2Thess',
    aliases: ['2. Thessalonicher', '2 Thessalonicher', '2Thess', '2.Thess'],
    testament: 'NT',
    chapters: 3,
  },
  {
    id: '1tim',
    bookNumber: 54,
    name: '1. Timotheus',
    shortName: '1Tim',
    aliases: ['1. Timotheus', '1 Timotheus', '1Tim', '1.Tim'],
    testament: 'NT',
    chapters: 6,
  },
  {
    id: '2tim',
    bookNumber: 55,
    name: '2. Timotheus',
    shortName: '2Tim',
    aliases: ['2. Timotheus', '2 Timotheus', '2Tim', '2.Tim'],
    testament: 'NT',
    chapters: 4,
  },
  {
    id: 'titus',
    bookNumber: 56,
    name: 'Titus',
    shortName: 'Tit',
    aliases: ['Titus', 'Tit'],
    testament: 'NT',
    chapters: 3,
  },
  {
    id: 'philm',
    bookNumber: 57,
    name: 'Philemon',
    shortName: 'Phlm',
    aliases: ['Philemon', 'Phlm', 'Phm', 'Philm'],
    testament: 'NT',
    chapters: 1,
    versesPerChapter: { 1: 25 },
  },
  {
    id: 'heb',
    bookNumber: 58,
    name: 'Hebräer',
    shortName: 'Hebr',
    aliases: ['Hebräer', 'Hebraeer', 'Hebr', 'Heb'],
    testament: 'NT',
    chapters: 13,
    versesPerChapter: { 11: 40, 12: 29 },
  },
  {
    id: 'jas',
    bookNumber: 59,
    name: 'Jakobus',
    shortName: 'Jak',
    aliases: ['Jakobus', 'Jak', 'Jas'],
    testament: 'NT',
    chapters: 5,
  },
  {
    id: '1pet',
    bookNumber: 60,
    name: '1. Petrus',
    shortName: '1Pet',
    aliases: ['1. Petrus', '1 Petrus', '1Pet', '1.Pet'],
    testament: 'NT',
    chapters: 5,
  },
  {
    id: '2pet',
    bookNumber: 61,
    name: '2. Petrus',
    shortName: '2Pet',
    aliases: ['2. Petrus', '2 Petrus', '2Pet', '2.Pet'],
    testament: 'NT',
    chapters: 3,
  },
  {
    id: '1john',
    bookNumber: 62,
    name: '1. Johannes',
    shortName: '1Joh',
    aliases: ['1. Johannes', '1 Johannes', '1Joh', '1.Joh', '1Jn'],
    testament: 'NT',
    chapters: 5,
  },
  {
    id: '2john',
    bookNumber: 63,
    name: '2. Johannes',
    shortName: '2Joh',
    aliases: ['2. Johannes', '2 Johannes', '2Joh', '2.Joh', '2Jn'],
    testament: 'NT',
    chapters: 1,
    versesPerChapter: { 1: 13 },
  },
  {
    id: '3john',
    bookNumber: 64,
    name: '3. Johannes',
    shortName: '3Joh',
    aliases: ['3. Johannes', '3 Johannes', '3Joh', '3.Joh', '3Jn'],
    testament: 'NT',
    chapters: 1,
    versesPerChapter: { 1: 15 },
  },
  {
    id: 'jude',
    bookNumber: 65,
    name: 'Judas',
    shortName: 'Jud',
    aliases: ['Judas', 'Jud'],
    testament: 'NT',
    chapters: 1,
    versesPerChapter: { 1: 25 },
  },
  {
    id: 'rev',
    bookNumber: 66,
    name: 'Offenbarung',
    shortName: 'Offb',
    aliases: ['Offenbarung', 'Offb', 'Off', 'Apokalypse', 'Rev'],
    testament: 'NT',
    chapters: 22,
  },
];

export const ALL_BIBLE_BOOKS: BibleBook[] = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

/**
 * 1-basierte Buch-Nummer nach Standardkanon (1: 1. Mose bis 66: Offenbarung)
 */
export function getBookNumber(bookIdOrName: string): number {
  const norm = bookIdOrName.trim().toLowerCase();
  
  // Exakter Treffer auf ID oder Name oder shortName
  const found = ALL_BIBLE_BOOKS.find((b) => {
    if (b.id.toLowerCase() === norm || b.name.toLowerCase() === norm || b.shortName.toLowerCase() === norm) {
      return true;
    }
    return b.aliases.some((alias) => alias.toLowerCase() === norm);
  });

  return found ? found.bookNumber : 43; // Standard: 43 = Johannes
}

export interface ParsedPassage {
  book: BibleBook;
  bookNumber: number;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  isFullChapter: boolean;
  formattedDisplay: string;
  matchedExplicitBook?: boolean;
}

/**
 * Fehlertoleranter Bibelstellen-Parser
 * Unterstützt:
 * - Deutsches Komma: 'Matthäus 12, 1-14', 'Johannes 3,16'
 * - Englischer Doppelpunkt: 'Matthäus 12:1-14', 'Johannes 3:16'
 * - Leerzeichen um Trennzeichen: 'Jesaja 53, 3-7', '1. Korinther 13, 1 - 13'
 * - Bis-Striche (-, –, —): '1-8', '1–8'
 * - Ein-Kapitel-Bücher: 'Philemon 1-7' (interpretiert als Kapitel 1, Verse 1-7)
 * - Reine Kapitelangaben: 'Psalm 23', 'Römer 8' -> isFullChapter: true
 * - Nummerierte Bücher: '1. Mose', '1Mo', '1. Korinther', '1Joh'
 */
export function parsePassageReference(passage: string): ParsedPassage {
  const clean = passage.trim();

  // 1. Suche nach dem passenden Buch (längste Aliase zuerst prüfen)
  let matchedBook: BibleBook = ALL_BIBLE_BOOKS[42]; // Default: Johannes (Buch 43)
  let matchedExplicitBook = false;
  let remainder = clean;

  // Sammle alle (Alias -> Buch)-Paare, sortiert nach absteigender Zeichenlänge
  const candidates: { alias: string; book: BibleBook }[] = [];
  for (const b of ALL_BIBLE_BOOKS) {
    candidates.push({ alias: b.name, book: b });
    candidates.push({ alias: b.shortName, book: b });
    candidates.push({ alias: b.id, book: b });
    for (const a of b.aliases) {
      candidates.push({ alias: a, book: b });
    }
  }
  // Sortiere längste zuerst
  candidates.sort((a, b) => b.alias.length - a.alias.length);

  for (const c of candidates) {
    // Regex sucht am Anfang des Strings. Optionaler Punkt nach Abkürzung, gefolgt von Whitespace oder Ziffer
    const escaped = c.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escaped}\\.?(\\s*|(?=\\d))`, 'i');
    if (regex.test(clean)) {
      matchedBook = c.book;
      matchedExplicitBook = true;
      remainder = clean.replace(regex, '').trim();
      break;
    }
  }

  // 2. Normalisiere remainder:
  // Ersetze typographische Gedankenstriche durch normalen Bindestrich
  remainder = remainder.replace(/[–—]/g, '-');
  // Entferne unnötige Leerzeichen um Doppelpunkte, Kommas und Bindestriche
  remainder = remainder.replace(/\s*([:,])\s*/g, '$1').replace(/\s*-\s*/g, '-');

  let chapter = 1;
  let startVerse: number | undefined;
  let endVerse: number | undefined;
  let isFullChapter = false;

  // Sonderfall: Ein-Kapitel-Bücher (Obadja, Philemon, 2. Johannes, 3. Johannes, Judas)
  // Wenn der Nutzer z. B. 'Philemon 1-7' oder 'Philemon 5' eingibt, meint er Vers 1-7 bzw. Vers 5 in Kapitel 1
  if (matchedBook.chapters === 1) {
    chapter = 1;
    // Muster: '1:5-10' oder '1,5-10'
    const fullMatch = remainder.match(/^(\d+)[:,](\d+)(?:-(\d+))?/);
    if (fullMatch) {
      startVerse = parseInt(fullMatch[2], 10);
      if (fullMatch[3]) endVerse = parseInt(fullMatch[3], 10);
    } else {
      // Muster: nur '5-10' oder '5'
      const verseSpan = remainder.match(/^(\d+)(?:-(\d+))?/);
      if (verseSpan) {
        startVerse = parseInt(verseSpan[1], 10);
        if (verseSpan[2]) endVerse = parseInt(verseSpan[2], 10);
      } else {
        isFullChapter = true;
      }
    }
  } else {
    // Standard-Mehrkapitel-Buch:
    // Fall A: '12:1-14' oder '12,1-14' oder '12:5' oder '12,5'
    const matchWithVerses = remainder.match(/^(\d+)[:,](\d+)(?:-(\d+))?/);
    if (matchWithVerses) {
      chapter = parseInt(matchWithVerses[1], 10) || 1;
      startVerse = parseInt(matchWithVerses[2], 10);
      if (matchWithVerses[3]) {
        endVerse = parseInt(matchWithVerses[3], 10);
      }
    } else {
      // Fall B: Nur Kapitel angegeben (z. B. '23' in 'Psalm 23' oder '8' in 'Römer 8')
      const matchChapterOnly = remainder.match(/^(\d+)/);
      if (matchChapterOnly) {
        chapter = parseInt(matchChapterOnly[1], 10) || 1;
        isFullChapter = true;
      } else {
        chapter = 1;
        isFullChapter = true;
      }
    }
  }

  // Kapitel-Begrenzung: Darf nicht größer als max. Kapitel des Buches sein
  if (chapter > matchedBook.chapters) {
    chapter = matchedBook.chapters;
  }
  if (chapter < 1) {
    chapter = 1;
  }

  // Formatierter Display-String
  let formattedDisplay = `${matchedBook.name} ${chapter}`;
  if (!isFullChapter && startVerse) {
    formattedDisplay += `:${startVerse}`;
    if (endVerse && endVerse !== startVerse) {
      formattedDisplay += `-${endVerse}`;
    }
  }

  return {
    book: matchedBook,
    bookNumber: matchedBook?.bookNumber || 43,
    chapter,
    startVerse,
    endVerse,
    isFullChapter,
    formattedDisplay,
    matchedExplicitBook,
  };
}

/**
 * Gibt die exakte, reelle Versanzahl eines Kapitels zurück.
 * Absolut defensiv & kugelsicher: Akzeptiert BibleBook, String-ID oder ungültige Werte.
 * Liefert im Fehlerfall IMMER einen gültigen positiven Zahlenwert (Default: 35).
 */
export function getVerseCount(book: BibleBook | string | null | undefined, chapter: number | null | undefined): number {
  try {
    const ch = typeof chapter === 'number' && !isNaN(chapter) && chapter > 0 ? chapter : 1;
    let bookId: string | undefined;

    if (book && typeof book === 'object' && 'id' in book) {
      bookId = book.id;
    } else if (typeof book === 'string') {
      bookId = book;
    }

    if (bookId && VERSE_COUNTS?.[bookId]?.[ch]) {
      const count = VERSE_COUNTS[bookId][ch];
      if (typeof count === 'number' && count > 0) return count;
    }

    if (book && typeof book === 'object' && book.versesPerChapter?.[ch]) {
      const count = book.versesPerChapter[ch];
      if (typeof count === 'number' && count > 0) return count;
    }

    if (bookId === 'ps' && ch === 119) {
      return 176;
    }
  } catch (err) {
    console.warn('Verse count lookup fallback:', err);
  }

  return 35; // Sicherer Fallback-Wert, niemals 0, NaN oder undefined!
}
