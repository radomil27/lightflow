/**
 * Lightflow Bibel-Datenstruktur
 * Enthält alle 66 Bücher des Alten und Neuen Testaments mit Kapitel- und Versanzahlen.
 */

export interface BibleBook {
  id: string;
  name: string;
  shortName: string;
  testament: 'AT' | 'NT';
  chapters: number;
  // Typische Versanzahlen pro Kapitel (Standard: 30, falls nicht explizit definiert)
  versesPerChapter?: Record<number, number>;
}

export const OLD_TESTAMENT_BOOKS: BibleBook[] = [
  { id: 'gen', name: '1. Mose', shortName: '1Mo', testament: 'AT', chapters: 50 },
  { id: 'ex', name: '2. Mose', shortName: '2Mo', testament: 'AT', chapters: 40 },
  { id: 'lev', name: '3. Mose', shortName: '3Mo', testament: 'AT', chapters: 27 },
  { id: 'num', name: '4. Mose', shortName: '4Mo', testament: 'AT', chapters: 36 },
  { id: 'deut', name: '5. Mose', shortName: '5Mo', testament: 'AT', chapters: 34 },
  { id: 'josh', name: 'Josua', shortName: 'Jos', testament: 'AT', chapters: 24 },
  { id: 'judg', name: 'Richter', shortName: 'Ri', testament: 'AT', chapters: 21 },
  { id: 'ruth', name: 'Ruth', shortName: 'Rut', testament: 'AT', chapters: 4, versesPerChapter: { 1: 22, 2: 23, 3: 18, 4: 22 } },
  { id: '1sam', name: '1. Samuel', shortName: '1Sam', testament: 'AT', chapters: 31 },
  { id: '2sam', name: '2. Samuel', shortName: '2Sam', testament: 'AT', chapters: 24 },
  { id: '1kings', name: '1. Könige', shortName: '1Kön', testament: 'AT', chapters: 22 },
  { id: '2kings', name: '2. Könige', shortName: '2Kön', testament: 'AT', chapters: 25 },
  { id: '1chron', name: '1. Chronik', shortName: '1Chr', testament: 'AT', chapters: 29 },
  { id: '2chron', name: '2. Chronik', shortName: '2Chr', testament: 'AT', chapters: 36 },
  { id: 'ezra', name: 'Esra', shortName: 'Esr', testament: 'AT', chapters: 10 },
  { id: 'neh', name: 'Nehemia', shortName: 'Neh', testament: 'AT', chapters: 13 },
  { id: 'esth', name: 'Ester', shortName: 'Est', testament: 'AT', chapters: 10 },
  { id: 'job', name: 'Hiob', shortName: 'Hi', testament: 'AT', chapters: 42 },
  { id: 'ps', name: 'Psalmen', shortName: 'Ps', testament: 'AT', chapters: 150, versesPerChapter: { 23: 6, 91: 16, 119: 176, 121: 8, 139: 24 } },
  { id: 'prov', name: 'Sprüche', shortName: 'Spr', testament: 'AT', chapters: 31 },
  { id: 'eccl', name: 'Prediger', shortName: 'Pred', testament: 'AT', chapters: 12 },
  { id: 'song', name: 'Hohelied', shortName: 'Hld', testament: 'AT', chapters: 8 },
  { id: 'isa', name: 'Jesaja', shortName: 'Jes', testament: 'AT', chapters: 66 },
  { id: 'jer', name: 'Jeremia', shortName: 'Jer', testament: 'AT', chapters: 52 },
  { id: 'lam', name: 'Klagelieder', shortName: 'Klag', testament: 'AT', chapters: 5 },
  { id: 'ezek', name: 'Hesekiel', shortName: 'Hes', testament: 'AT', chapters: 48 },
  { id: 'dan', name: 'Daniel', shortName: 'Dan', testament: 'AT', chapters: 12 },
  { id: 'hos', name: 'Hosea', shortName: 'Hos', testament: 'AT', chapters: 14 },
  { id: 'joel', name: 'Joel', shortName: 'Joe', testament: 'AT', chapters: 4 },
  { id: 'amos', name: 'Amos', shortName: 'Am', testament: 'AT', chapters: 9 },
  { id: 'obad', name: 'Obadja', shortName: 'Ob', testament: 'AT', chapters: 1, versesPerChapter: { 1: 21 } },
  { id: 'jonah', name: 'Jona', shortName: 'Jon', testament: 'AT', chapters: 4 },
  { id: 'mic', name: 'Micha', shortName: 'Mi', testament: 'AT', chapters: 7 },
  { id: 'nah', name: 'Nahum', shortName: 'Nah', testament: 'AT', chapters: 3 },
  { id: 'hab', name: 'Habakuk', shortName: 'Hab', testament: 'AT', chapters: 3 },
  { id: 'zeph', name: 'Zefanja', shortName: 'Zef', testament: 'AT', chapters: 3 },
  { id: 'hag', name: 'Haggai', shortName: 'Hag', testament: 'AT', chapters: 2 },
  { id: 'zech', name: 'Sacharja', shortName: 'Sach', testament: 'AT', chapters: 14 },
  { id: 'mal', name: 'Maleachi', shortName: 'Mal', testament: 'AT', chapters: 3 },
];

export const NEW_TESTAMENT_BOOKS: BibleBook[] = [
  { id: 'matt', name: 'Matthäus', shortName: 'Mt', testament: 'NT', chapters: 28, versesPerChapter: { 11: 30, 12: 50, 28: 20 } },
  { id: 'mark', name: 'Markus', shortName: 'Mk', testament: 'NT', chapters: 16 },
  { id: 'luke', name: 'Lukas', shortName: 'Lk', testament: 'NT', chapters: 24 },
  { id: 'john', name: 'Johannes', shortName: 'Joh', testament: 'NT', chapters: 21, versesPerChapter: { 1: 51, 3: 36, 15: 27 } },
  { id: 'acts', name: 'Apostelgeschichte', shortName: 'Apg', testament: 'NT', chapters: 28 },
  { id: 'rom', name: 'Römer', shortName: 'Röm', testament: 'NT', chapters: 16, versesPerChapter: { 8: 39, 12: 21 } },
  { id: '1cor', name: '1. Korinther', shortName: '1Kor', testament: 'NT', chapters: 16, versesPerChapter: { 13: 13 } },
  { id: '2cor', name: '2. Korinther', shortName: '2Kor', testament: 'NT', chapters: 13 },
  { id: 'gal', name: 'Galater', shortName: 'Gal', testament: 'NT', chapters: 6 },
  { id: 'eph', name: 'Epheser', shortName: 'Eph', testament: 'NT', chapters: 6, versesPerChapter: { 5: 33, 6: 24 } },
  { id: 'phil', name: 'Philipper', shortName: 'Phil', testament: 'NT', chapters: 4, versesPerChapter: { 4: 23 } },
  { id: 'col', name: 'Kolosser', shortName: 'Kol', testament: 'NT', chapters: 4 },
  { id: '1thess', name: '1. Thessalonicher', shortName: '1Thess', testament: 'NT', chapters: 5 },
  { id: '2thess', name: '2. Thessalonicher', shortName: '2Thess', testament: 'NT', chapters: 3 },
  { id: '1tim', name: '1. Timotheus', shortName: '1Tim', testament: 'NT', chapters: 6 },
  { id: '2tim', name: '2. Timotheus', shortName: '2Tim', testament: 'NT', chapters: 4 },
  { id: 'titus', name: 'Titus', shortName: 'Tit', testament: 'NT', chapters: 3 },
  { id: 'philm', name: 'Philemon', shortName: 'Phlm', testament: 'NT', chapters: 1, versesPerChapter: { 1: 25 } },
  { id: 'heb', name: 'Hebräer', shortName: 'Hebr', testament: 'NT', chapters: 13, versesPerChapter: { 11: 40, 12: 29 } },
  { id: 'jas', name: 'Jakobus', shortName: 'Jak', testament: 'NT', chapters: 5 },
  { id: '1pet', name: '1. Petrus', shortName: '1Pet', testament: 'NT', chapters: 5 },
  { id: '2pet', name: '2. Petrus', shortName: '2Pet', testament: 'NT', chapters: 3 },
  { id: '1john', name: '1. Johannes', shortName: '1Joh', testament: 'NT', chapters: 5 },
  { id: '2john', name: '2. Johannes', shortName: '2Joh', testament: 'NT', chapters: 1, versesPerChapter: { 1: 13 } },
  { id: '3john', name: '3. Johannes', shortName: '3Joh', testament: 'NT', chapters: 1, versesPerChapter: { 1: 15 } },
  { id: 'jude', name: 'Judas', shortName: 'Jud', testament: 'NT', chapters: 1, versesPerChapter: { 1: 25 } },
  { id: 'rev', name: 'Offenbarung', shortName: 'Offb', testament: 'NT', chapters: 22 },
];

export const ALL_BIBLE_BOOKS = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

// 1-basierte Buch-Nummer nach Standardkanon (1: 1. Mose bis 66: Offenbarung)
export function getBookNumber(bookIdOrName: string): number {
  const norm = bookIdOrName.trim().toLowerCase();
  const index = ALL_BIBLE_BOOKS.findIndex(
    (b) => b.id.toLowerCase() === norm ||
           b.name.toLowerCase() === norm ||
           b.shortName.toLowerCase() === norm
  );
  return index >= 0 ? index + 1 : 43; // Standard: 43 = Johannes
}

/**
 * Parst eine Bibelstellen-Angabe wie 'Johannes 15:1-8' oder 'Matthäus 12' in Buch, Kapitel, Startvers, Endvers
 */
export function parsePassageReference(passage: string): {
  book: BibleBook;
  bookNumber: number;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
} {
  const clean = passage.trim();
  
  // Suche nach passendem Buch
  let matchedBook: BibleBook = ALL_BIBLE_BOOKS[42]; // Default: Johannes
  let remainder = clean;

  // Längste Buchnamen zuerst abgleichen, damit "1. Johannes" vor "Johannes" matcht
  const sortedBooks = [...ALL_BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
  for (const b of sortedBooks) {
    const reg = new RegExp(`^(${b.name}|${b.shortName}|${b.id})\\.?\\s*`, 'i');
    if (reg.test(clean)) {
      matchedBook = b;
      remainder = clean.replace(reg, '').trim();
      break;
    }
  }

  // Parse Kapitel und Verse aus dem Rest (z. B. "15:1-8" oder "12:1-14" oder "15")
  const chapMatch = remainder.match(/^(\d+)(?::(\d+)(?:-(\d+))?)?/);
  let chapter = 1;
  let startVerse: number | undefined;
  let endVerse: number | undefined;

  if (chapMatch) {
    chapter = parseInt(chapMatch[1], 10) || 1;
    if (chapMatch[2]) {
      startVerse = parseInt(chapMatch[2], 10);
    }
    if (chapMatch[3]) {
      endVerse = parseInt(chapMatch[3], 10);
    }
  }

  const bookNumber = getBookNumber(matchedBook.id);

  return {
    book: matchedBook,
    bookNumber,
    chapter,
    startVerse,
    endVerse,
  };
}

// Gibt die Versanzahl eines Kapitels zurück (mit verlässlichem Standard)
export function getVerseCount(book: BibleBook, chapter: number): number {
  if (book.versesPerChapter && book.versesPerChapter[chapter]) {
    return book.versesPerChapter[chapter];
  }
  // Sinnvolle Standard-Versanzahl basierend auf Buch-Typ
  if (book.id === 'ps') {
    if (chapter === 119) return 176;
    return 28;
  }
  return 32;
}
