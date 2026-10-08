/**
 * Perikopen- und Sinnabschnitt-Verzeichnis für Lightflow
 * 
 * Gruppiert Bibelkapitel in historische und thematische Sinneinheiten,
 * damit Nutzer nicht unüberschaubare Textmengen an die KI übergeben,
 * sondern zielgerichtete Geschichten (z. B. Lukas 15:1-7 "Verlorenes Schaf").
 */

export interface Pericope {
  title: string;       // Offizieller deutscher Titel des Abschnitts
  startVerse: number;  // Beginnender Vers (1-basiert)
  endVerse: number;    // Endender Vers (inklusiv)
}

// Bolls-Life Book-IDs:
// 40: Matthäus, 41: Markus, 42: Lukas, 43: Johannes, 45: Römer, 46: 1. Korinther, 50: Philipper, 19: Psalmen, 1: 1. Mose
export const CURATED_PERICOPES: Record<number, Record<number, Pericope[]>> = {
  // 42: LUKAS
  42: {
    // Lukas 15 (Die drei Verlorenen-Gleichnisse)
    15: [
      { title: 'Das Gleichnis vom verlorenen Schaf', startVerse: 1, endVerse: 7 },
      { title: 'Das Gleichnis von der verlorenen Drachme', startVerse: 8, endVerse: 10 },
      { title: 'Das Gleichnis vom verlorenen Sohn & dem barmherzigen Vater', startVerse: 11, endVerse: 32 },
    ],
    // Lukas 10 (Aussendung der Siebzig, Barmherziger Samariter, Maria & Martha)
    10: [
      { title: 'Die Aussendung der zweiundsiebzig Jünger', startVerse: 1, endVerse: 16 },
      { title: 'Die Rückkehr der Jünger & Jesu Jubelruf', startVerse: 17, endVerse: 24 },
      { title: 'Das Gleichnis vom barmherzigen Samariter', startVerse: 25, endVerse: 37 },
      { title: 'Maria und Martha (Das eine Notwendige)', startVerse: 38, endVerse: 42 },
    ],
    // Lukas 12 (Sorge um irdische Güter & Reichtum bei Gott)
    12: [
      { title: 'Warnung vor Heuchelei & Furchtlosigkeit vor Gott', startVerse: 1, endVerse: 12 },
      { title: 'Vom reichen Kornbauern (Die Torheit der Habgier)', startVerse: 13, endVerse: 21 },
      { title: 'Sorget nicht um euer Leben (Raben und Lilien)', startVerse: 22, endVerse: 34 },
      { title: 'Vom wachsamen Knecht & treuen Haushalter', startVerse: 35, endVerse: 48 },
      { title: 'Nicht Friede, sondern Entzweiung', startVerse: 49, endVerse: 53 },
      { title: 'Die Zeichen der Zeit beurteilen', startVerse: 54, endVerse: 59 },
    ],
  },

  // 40: MATTHÄUS
  40: {
    // Matthäus 5 (Bergpredigt: Seligpreisungen, Salz & Licht, Gesetz)
    5: [
      { title: 'Die Seligpreisungen', startVerse: 1, endVerse: 12 },
      { title: 'Salz der Erde und Licht der Welt', startVerse: 13, endVerse: 16 },
      { title: 'Jesus und das Gesetz', startVerse: 17, endVerse: 20 },
      { title: 'Vom Zorn und der Versöhnung', startVerse: 21, endVerse: 26 },
      { title: 'Vom Ehebruch und der Begierde', startVerse: 27, endVerse: 30 },
      { title: 'Vom Schwören (Euer Ja sei ein Ja)', startVerse: 33, endVerse: 37 },
      { title: 'Vergeltung und Feindesliebe', startVerse: 38, endVerse: 48 },
    ],
    // Matthäus 6 (Almosen, Gebet, Vaterunser, Fasten, Schätze)
    6: [
      { title: 'Vom echten Geben im Verborgenen', startVerse: 1, endVerse: 4 },
      { title: 'Vom Beten & Das Vaterunser', startVerse: 5, endVerse: 15 },
      { title: 'Vom echten Fasten vor Gott', startVerse: 16, endVerse: 18 },
      { title: 'Schätze im Himmel & Das Auge als Licht', startVerse: 19, endVerse: 24 },
      { title: 'Sorget nicht! (Trachtet zuerst nach Gottes Reich)', startVerse: 25, endVerse: 34 },
    ],
    // Matthäus 7 (Richten, Bitten, Die zwei Wege, Haus auf dem Felsen)
    7: [
      { title: 'Vom Richten und dem Balken im eigenen Auge', startVerse: 1, endVerse: 6 },
      { title: 'Bittet, so wird euch gegeben (Die Güte des Vaters)', startVerse: 7, endVerse: 12 },
      { title: 'Die enge Pforte und die zwei Wege', startVerse: 13, endVerse: 14 },
      { title: 'An ihren Früchten werdet ihr sie erkennen', startVerse: 15, endVerse: 23 },
      { title: 'Vom klugen und törichten Baumeister (Haus auf Fels)', startVerse: 24, endVerse: 29 },
    ],
    // Matthäus 11 (Johannes der Täufer, Weherufe, Die leichte Last)
    11: [
      { title: 'Die Anfrage Johannes des Täufers & Jesu Zeugnis', startVerse: 1, endVerse: 19 },
      { title: 'Weherufe über unbußfertige Städte', startVerse: 20, endVerse: 24 },
      { title: 'Der Lobpreis des Vaters & Die leichte Last Christi', startVerse: 25, endVerse: 30 },
    ],
    // Matthäus 12 (Sabbat-Konflikte & Barmherzigkeit)
    12: [
      { title: 'Das Ährenraufen am Sabbat (Herr über den Sabbat)', startVerse: 1, endVerse: 8 },
      { title: 'Die Heilung des Mannes mit der verdorrten Hand', startVerse: 9, endVerse: 14 },
      { title: 'Der auserwählte Gottesknecht', startVerse: 15, endVerse: 21 },
      { title: 'Jesus und Beelzebul (Die Lästerung des Geistes)', startVerse: 22, endVerse: 32 },
      { title: 'Der Baum und seine Früchte', startVerse: 33, endVerse: 37 },
      { title: 'Die Zeichenforderung & Das Zeichen des Jona', startVerse: 38, endVerse: 42 },
      { title: 'Die Rückkehr des unreinen Geistes', startVerse: 43, endVerse: 45 },
      { title: 'Die wahren Verwandten Jesu', startVerse: 46, endVerse: 50 },
    ],
    // Matthäus 20 (Arbeiter im Weinberg & Leidensankündigung)
    20: [
      { title: 'Das Gleichnis von den Arbeitern im Weinberg (Gnade statt Stechuhr)', startVerse: 1, endVerse: 16 },
      { title: 'Dritte Ankündigung von Leiden und Auferstehung', startVerse: 17, endVerse: 19 },
      { title: 'Herrschen durch Dienen (Die Bitte der Zebedäussöhne)', startVerse: 20, endVerse: 28 },
      { title: 'Die Heilung zweier Blinder bei Jericho', startVerse: 29, endVerse: 34 },
    ],
  },

  // 43: JOHANNES
  43: {
    // Johannes 1 (Der Prolog & Die ersten Jünger)
    1: [
      { title: 'Der Prolog: Das Wort ward Fleisch', startVerse: 1, endVerse: 18 },
      { title: 'Das Zeugnis Johannes des Täufers (Lamm Gottes)', startVerse: 19, endVerse: 34 },
      { title: 'Die Berufung der ersten Jünger (Andreas, Petrus, Philippus, Nathanael)', startVerse: 35, endVerse: 51 },
    ],
    // Johannes 3 (Nikodemus & Gottes Liebe zur Welt)
    3: [
      { title: 'Das Nachtgespräch mit Nikodemus (Wiedergeburt aus Geist)', startVerse: 1, endVerse: 21 },
      { title: 'Das letzte Zeugnis des Täufers (Er muss wachsen, ich abnehmen)', startVerse: 22, endVerse: 36 },
    ],
    // Johannes 4 (Die Samariterin am Jakobsbrunnen)
    4: [
      { title: 'Jesus und die Samariterin am Jakobsbrunnen (Lebendiges Wasser)', startVerse: 1, endVerse: 26 },
      { title: 'Das Gespräch über die Ernte mit den Jüngern', startVerse: 27, endVerse: 38 },
      { title: 'Der Glaube der Samariter', startVerse: 39, endVerse: 42 },
      { title: 'Die Heilung des Sohnes eines königlichen Beamten', startVerse: 43, endVerse: 54 },
    ],
    // Johannes 15 (Weinstock & Reben, Bleiben in der Liebe)
    15: [
      { title: 'Der wahre Weinstock und die Reben (Frucht bringen)', startVerse: 1, endVerse: 8 },
      { title: 'Bleibt in meiner Liebe & Das Gebot der Freude', startVerse: 9, endVerse: 17 },
      { title: 'Der Hass der Welt gegen die Jünger', startVerse: 18, endVerse: 27 },
    ],
  },

  // 45: RÖMER
  45: {
    // Römer 8 (Leben im Geist, Leiden & Herrlichkeit, Überwinder)
    8: [
      { title: 'Keine Verdammnis für die in Christus sind (Fleisch vs. Geist)', startVerse: 1, endVerse: 11 },
      { title: 'Kindschaft Gottes & Das Abba-Rufen', startVerse: 12, endVerse: 17 },
      { title: 'Die Hoffnung der Schöpfung auf Erlösung', startVerse: 18, endVerse: 25 },
      { title: 'Der Beistand des Heiligen Geistes im Gebet', startVerse: 26, endVerse: 30 },
      { title: 'Gottes unverbrüchliche Liebe (Mehr als Überwinder)', startVerse: 31, endVerse: 39 },
    ],
    // Römer 12 (Gottesdienst im Alltag & Leben in der Gemeinde)
    12: [
      { title: 'Der vernünftige Gottesdienst (Erneuerung des Sinnes)', startVerse: 1, endVerse: 2 },
      { title: 'Die vielen Glieder an einem Leib & geistliche Gaben', startVerse: 3, endVerse: 8 },
      { title: 'Regeln für christliches Leben und aufrichtige Liebe', startVerse: 9, endVerse: 16 },
      { title: 'Überwinde das Böse mit Gutem (Keine Rache)', startVerse: 17, endVerse: 21 },
    ],
  },

  // 46: 1. KORINTHER
  46: {
    // 1. Korinther 13 (Das Hohelied der Liebe)
    13: [
      { title: 'Ohne Liebe ist alles nichts (Die Vergänglichkeit aller Gaben)', startVerse: 1, endVerse: 3 },
      { title: 'Das Wesen der Liebe (Geduld, Güte, Treue)', startVerse: 4, endVerse: 7 },
      { title: 'Die bleibende Liebe: Glaube, Hoffnung, Liebe', startVerse: 8, endVerse: 13 },
    ],
  },

  // 50: PHILIPPER
  50: {
    // Philipper 4 (Freude im Herrn, Sorgen abgeben, Genügsamkeit)
    4: [
      { title: 'Mahnung zur Einmütigkeit & Freude im Herrn', startVerse: 1, endVerse: 5 },
      { title: 'Sorgt euch um nichts (Der Friede Gottes)', startVerse: 6, endVerse: 9 },
      { title: 'Dank für Unterstützung & Das Geheimnis der Genügsamkeit', startVerse: 10, endVerse: 20 },
      { title: 'Schlussgrüße & Segen', startVerse: 21, endVerse: 23 },
    ],
  },

  // 19: PSALMEN (Ausgewählte Perikopen)
  19: {
    // Psalm 23 (Der HERR ist mein Hirte)
    23: [
      { title: 'Der HERR ist mein Hirte: Frische Weiden & Finstere Täler', startVerse: 1, endVerse: 4 },
      { title: 'Der bereitete Tisch & Ewige Geborgenheit beim HERRN', startVerse: 5, endVerse: 6 },
    ],
    // Psalm 91 (Unter dem Schirm des Höchsten)
    91: [
      { title: 'Geborgenheit unter dem Schirm des Höchsten', startVerse: 1, endVerse: 8 },
      { title: 'Der Schutz der Engel auf allen Wegen', startVerse: 9, endVerse: 13 },
      { title: 'Gottes Zusage: Ich will ihn erretten und ehren', startVerse: 14, endVerse: 16 },
    ],
    // Psalm 103 (Lobe den HERRN, meine Seele)
    103: [
      { title: 'Lobe den HERRN: Vergiss nicht seine Wohltaten', startVerse: 1, endVerse: 5 },
      { title: 'Barmherzig und gnädig ist der HERR (So weit der Morgen vom Abend ist)', startVerse: 6, endVerse: 14 },
      { title: 'Die Vergänglichkeit des Menschen & Gottes ewige Gnade', startVerse: 15, endVerse: 22 },
    ],
  },
};

/**
 * Ermittelt die Sinnabschnitte (Perikopen) für ein gegebenes Bibelkapitel.
 * Falls keine explizit kuratierten Abschnitte vorliegen, wird das Kapitel
 * mathematisch in lesbare, harmonische Cluster (ca. 7–10 Verse) gegliedert.
 */
export function getChapterPericopes(
  bookNumber: number,
  chapter: number,
  totalVerses: number,
  bookName: string = 'Kapitel'
): Pericope[] {
  // 1. Prüfe kuratiertes Verzeichnis
  const curated = CURATED_PERICOPES[bookNumber]?.[chapter];
  if (curated && curated.length > 0) {
    return curated;
  }

  // 2. Automatisches Clustering (Fallback für alle 1'189 Kapitel)
  if (totalVerses <= 8) {
    // Kurzes Kapitel bleibt ein einzelner kompletter Sinnabschnitt
    return [
      {
        title: `${bookName} ${chapter} (Vollständiger Text)`,
        startVerse: 1,
        endVerse: totalVerses,
      },
    ];
  }

  // Ziel: Abschnitte von ca. 6 bis 10 Versen
  const targetClusterSize = totalVerses > 40 ? 10 : totalVerses > 25 ? 8 : 7;
  const pericopes: Pericope[] = [];

  let currentStart = 1;
  let partNumber = 1;

  while (currentStart <= totalVerses) {
    let currentEnd = currentStart + targetClusterSize - 1;
    // Wenn der verbleibende Rest zu klein wäre (z. B. nur 1-2 Verse), hänge ihn an den letzten Block an
    if (totalVerses - currentEnd <= 3) {
      currentEnd = totalVerses;
    }
    if (currentEnd > totalVerses) {
      currentEnd = totalVerses;
    }

    pericopes.push({
      title: `${bookName} ${chapter} • Teil ${partNumber} (Verse ${currentStart}–${currentEnd})`,
      startVerse: currentStart,
      endVerse: currentEnd,
    });

    partNumber++;
    currentStart = currentEnd + 1;
  }

  return pericopes;
}
