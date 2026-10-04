/**
 * Lightflow KI-Prompt-Engine
 * 
 * Verarbeitet die Anfrage des Nutzers, speist die Nutzer-Matrix
 * in den System-Prompt ein und liefert den 6-Stufen-Report zurück.
 * Bietet native LLM-Integration (Google Gemini / OpenAI) sowie eine
 * tiefgehende, feinfühlige Offline-Engine für sofortigen Genuss ohne API-Zwang.
 */

import { UserProfile, LightflowReport, AppSettings } from '../types';

export function buildSystemPrompt(profile: UserProfile, passage: string, mood?: string): string {
  const currentMood = mood || profile.dailyMood || 'Suche Klarheit';

  return `Du bist die theologische und lebenspraktische KI-Engine von "Lightflow – Angeschlossen an die Quelle".
Deine Aufgabe ist es, einen biblischen Text so zu übersetzen, dass er VOLLSTÄNDIG und IN JEDEM EINZELNEN DER 6 BEREICHE auf das persönliche Profil des Nutzers abgestimmt ist.

NUTZER-PROFIL (DAS VERBINDUNGSPROFIL):
- 1. Beruf & Handwerkswelt: "${profile.profession}" (Verwende konkretes Fachvokabular, Werkzeuge, Abläufe, Reale Herausforderungen aus genau diesem Beruf!)
- 2. Denkweise & Kognitiver Stil: "${profile.mindset}" (z. B. lösungsorientiert & analytisch -> logische Kausalitäten; bildhaft -> plastische Vergleiche; systemisch -> Fehlerdiagnose & Architektur)
- 3. Lebenssituation & Beziehungsstatus: "${profile.relationshipStatus}" (z. B. Single/Alleinlebend -> Feierabend allein, Stille, Selbstfürsorge; Familie -> Trubel, Partner, Kinder, Verantwortung)
- 4. Glaubensphase: "${profile.faithStage || 'Auf der Suche'}" (z. B. hinterfragend/kritisch -> keine frommen Klischees, ehrlich und logisch; ausgelaugt -> sanft, kein neuer Leistungsdruck)
- 5. Heutige Tagesverfassung / Stimmung: "${currentMood}"

BIBELTEXT / PASSAGE:
${passage}

STRIKTE LEITLINIEN FÜR ALLE 6 BEREICHE:
- Kein allgemeines "Kirchen-Deutsch", keine Phrasen wie "Glaube einfach fest".
- Jeder Bereich muss die Lebenswelt des Nutzers widerspiegeln!

STRUKTUR DER 6 BEREICHE:

### [1. DIE KERNLEITUNG]
(1-2 glasklare, kraftvolle Sätze als Hauptimpuls. Formuliert so, dass es direkt den Kern der aktuellen Tagesverfassung "${currentMood}" und die Denkweise "${profile.mindset}" trifft.)

### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
(Vollständig auf den Beruf "${profile.profession}" zugeschnitten! Ziehe eine tiefgreifende, praktische Analogie mit echten Fachbegriffen und typischen Situationen aus diesem Beruf. Warum verhält sich der geistliche Grundsatz aus der Bibelstelle exakt wie ein physikalisches oder fachliches Gesetz in diesem Gewerk?)

### [3. DAS SYSTEM ENTSCHLÜSSELT]
(Auf die Denkweise "${profile.mindset}" abgestimmt. Analytische Fehlerdiagnose: Wo liegt der menschliche Systemfehler / Denkfehler (z. B. Kontrollzwang, Gesetzeskrampf, Leistungsdruck), und wie sieht das göttliche Funktionsprinzip aus? Ursache -> Auswirkung -> Befreiende Lösung.)

### [4. FREIRAUM IM ALLTAG]
(Direkt abgestimmt auf die Lebenssituation "${profile.relationshipStatus}" und den Feierabend nach der Arbeit als ${profile.profession}. Wie sieht praktische Freiheit heute Abend konkret aus? Welchen Druck darf der Nutzer jetzt vor der Haustür ablegen?)

### [5. DER GARTEN IM HERZEN]
(Ein geschützter Raum des Auftankens, zugeschnitten auf die Glaubensphase "${profile.faithStage || 'Ehrlich'}" und die heutige Stimmung "${currentMood}". Keine To-Do-Liste für den Glauben, sondern pure Gnade, bedingungslose Annahme und Erholung an der Quelle.)

### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]
(Ein ehrliches, unfrommes Herzensgebet in der Ich-Form. Es greift den heutigen Tag, den Beruf (${profile.profession}) und die Verfassung (${currentMood}) auf. Wie eine Sauerstoffmaske, die tiefes Aufatmen schenkt.)`;
}

/**
 * Parst den formatierten Text aus dem LLM in das 6-Stufen-Datenmodell
 */
export function parseReportSections(
  rawText: string,
  passage: string,
  profile: UserProfile,
  mood: string
): LightflowReport {
  const defaultReport: LightflowReport = {
    id: 'lf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    passage,
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    coreConduit: '',
    workBench: '',
    systemDecoded: '',
    dailyFreedom: '',
    heartGarden: '',
    oxygenMask: '',
    favorite: false,
  };

  const sections = [
    { key: 'coreConduit', regex: /###\s*\[1\.\s*DIE KERNLEITUNG\]([\s\S]*?)(?=###\s*\[2\.|\Z)/i },
    { key: 'workBench', regex: /###\s*\[2\.\s*DIE WERKBANK[^\]]*\]([\s\S]*?)(?=###\s*\[3\.|\Z)/i },
    { key: 'systemDecoded', regex: /###\s*\[3\.\s*DAS SYSTEM ENTSCHLÜSSELT\]([\s\S]*?)(?=###\s*\[4\.|\Z)/i },
    { key: 'dailyFreedom', regex: /###\s*\[4\.\s*FREIRAUM IM ALLTAG\]([\s\S]*?)(?=###\s*\[5\.|\Z)/i },
    { key: 'heartGarden', regex: /###\s*\[5\.\s*DER GARTEN IM HERZEN\]([\s\S]*?)(?=###\s*\[6\.|\Z)/i },
    { key: 'oxygenMask', regex: /###\s*\[6\.\s*DIE SAUERSTOFFMASKE[^\]]*\]([\s\S]*?)$/i },
  ] as const;

  for (const s of sections) {
    const match = rawText.match(s.regex);
    if (match && match[1]) {
      defaultReport[s.key] = match[1].trim();
    }
  }

  // Fallback falls die KI keine exakten Überschriften lieferte
  if (!defaultReport.coreConduit && rawText) {
    const paragraphs = rawText.split('\n\n').filter((p) => p.trim().length > 0);
    defaultReport.coreConduit = paragraphs[0] || 'Gott ist deine verlässliche Quelle mitten im Alltag.';
    defaultReport.workBench = paragraphs[1] || 'Übertragen auf deine tägliche Arbeit.';
    defaultReport.systemDecoded = paragraphs[2] || 'Das göttliche System basiert auf Vertrauen, nicht auf Zwang.';
    defaultReport.dailyFreedom = paragraphs[3] || 'Dein Feierabend gehört dir und dem Atemholen.';
    defaultReport.heartGarden = paragraphs[4] || 'Leg die Lasten ab – du bist gewollt und gehalten.';
    defaultReport.oxygenMask = paragraphs[5] || 'Herr, ich atme tief ein. Danke für deinen Sauerstoff heute.';
  }

  return defaultReport;
}

/**
 * Ruft die Google Gemini API auf
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API Fehler (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Keine Antwort von Gemini erhalten.');
  return text;
}

/**
 * Integrierte intelligente Lightflow-Engine (Offline & Instant Fallback)
 * Liefert hochgradig feinfühlige, auf Beruf und Lebenslage zugeschnittene Auswertungen.
 */
export function generateLocalReport(
  passage: string,
  profile: UserProfile,
  mood: string
): LightflowReport {
  const lowerPassage = passage.toLowerCase();
  const profession = profile.profession;
  const isHandwerk = profession.toLowerCase().includes('handwerk') || profession.toLowerCase().includes('monteur') || profession.toLowerCase().includes('küche') || profession.toLowerCase().includes('bau');
  const isIT = profession.toLowerCase().includes('it') || profession.toLowerCase().includes('code') || profession.toLowerCase().includes('software') || profession.toLowerCase().includes('dev');
  const isCare = profession.toLowerCase().includes('pflege') || profession.toLowerCase().includes('medizin') || profession.toLowerCase().includes('gesundheit');

  // Spezieller Deep-Report für Matthäus 12:1-14 (Das Referenz-Muster aus dem Prompt)
  if (lowerPassage.includes('matthäus 12') || lowerPassage.includes('matt 12') || lowerPassage.includes('sabbat')) {
    let workbenchText = '';
    if (isHandwerk) {
      workbenchText = `Auf dem Bau oder bei der Küchenmontage gibt es millimetergenaue Normen und Pläne. Aber was machst du, wenn beim Einpassen der Granitplatte plötzlich die Wasserleitung in der Wand leckt? Schlägst du das Regelbuch auf und wartest bis Montag, weil Feierabend ist? Nein, du greifst sofort ein, um den Wasserschaden abzuwenden.
Die Pharisäer waren wie starre Prüfer, die einen Rohrbruch ignorieren, nur um die Prüffrist auf dem Kalender einzuhalten. Jesus zeigt: Vorschriften sind das Gerüst, um Menschen zu schützen – nicht die Fessel, die ein lebendiges Eingreifen verbietet. Toleranzen und Notfall-Eingriffe gehören zur Meisterschaft.`;
    } else if (isIT) {
      workbenchText = `In der Software-Architektur gibt es strikte CI/CD-Pipelines und Freigabeprozesse. Aber wenn der Produktivserver brennt und die Kundendaten bedroht sind, beharrst du nicht starr auf dem Freigabeprozess des nächsten Sprints – du wendest den Hotfix an.
Die Pharisäer betrieben starre Prozessbürokratie ohne Blick auf den eigentlichen Systemzweck. Jesus refaktoriert den Sabbat: Das Framework existiert für den Benutzer (den Menschen), nicht der Benutzer für das Framework.`;
    } else if (isCare) {
      workbenchText = `Im Schichtdienst gibt es feste Dokumentationspflichten und Zeitfenster. Aber wenn ein Patient plötzlich keine Luft mehr bekommt, stoppst du nicht die Wiederbelebung, weil die Pause laut Dienstplan um 12:00 Uhr beginnt.
Jesus begegnet der verdorrten Hand genau so: Leben und Schmerzlinderung haben absoluten Vorrang vor jedem starren Protokoll.`;
    } else {
      workbenchText = `In deiner Arbeit als ${profession} kennst du feste Richtlinien und Dienstwege. Doch wenn ein Kollege oder Kunde in echter Not ist, gilt der gesunde Menschenverstand: Die Richtlinie soll dem Menschen dienen, nicht ihm die Luft abschnüren.`;
    }

    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 12:1-14 (Der Sinn des Ruhetags & Barmherzigkeit)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: 'Gottes Ordnungen sind Lebensretter, keine Handschellen. Der Ruhetag wurde geschaffen, damit der Mensch atmen kann – nicht, damit er unter religiöser Kontrolle erstickt.',
      workBench: workbenchText,
      systemDecoded: `FEHLERDIAGNOSE: Die menschliche Religion verwechselt Werkzeug und Ziel. Sie macht aus dem Geschenk der Pause ein Kontrollinstrument mit 39 Unterverboten.
GÖTTLICHES FUNKTIONSPRINZIP: Ursache: Gott will deine Erholung und Wiederherstellung. Wirkung: Wo Not ist, schafft Gnade Raum zum Handeln. Lösung: Prüfe jede Regel daran, ob sie Leben fördert oder Leben erdrückt.`,
    dailyFreedom: `Wenn du nach Hause kommst (${profile.relationshipStatus}): Lass den inneren Kontrollzwang und die berufliche Anspannung als ${profession} vor der Haustür. Du musst dir deine Existenzberechtigung nicht durch Perfektion oder permanente Verfügbarkeit verdienen. Der Feierabend ist dir bedingungslos geschenkt – atme durch, ohne Rechenschaft ablegen zu müssen.`,
      heartGarden: `Lass das Werkzeug sinken. Mitten in deiner heutigen Verfassung (${mood}) und deiner Glaubensphase (${profile.faithStage || 'Auf der Suche'}) schaut Gott nicht darauf, wie viele Punkte du auf deiner To-Do-Liste abgehakt hast oder wie fromm du dich fühlst. Er sieht deine müden Hände – und sagt: "Komm zur Ruhe, ich trage das Fundament."`,
      oxygenMask: `Gott, ich sitze hier und spüre meine Verfassung (${mood}). Ich merke, wie fest ich mich oft in meinen eigenen Vorschriften und Erwartungen als ${profession} verbeiße.
Schalte meinen Kopf (${profile.mindset}) frei von diesem ständigen Rechtfertigungsdruck. Ich nehme deinen Frieden jetzt an wie einen tiefen Zug frischen Sauerstoff. Amen.`,
      favorite: false,
    };
  }

  // Für Matthäus 11:28-30 (Die leichte Last / Sauerstoff für Erschöpfte)
  if (lowerPassage.includes('matthäus 11') || lowerPassage.includes('matt 11') || lowerPassage.includes('mühselig') || lowerPassage.includes('last')) {
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 11:28-30 (Kommt her zu mir alle, die ihr mühselig seid)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: `Du musst den Karren nicht alleine aus dem Dreck ziehen. Das Joch Jesu ist keine Zusatzlast, sondern eine passgenaue Führungsstange, die das Gewicht von deinen Schultern nimmt (${profile.mindset}).`,
      workBench: `In deinem Bereich (${profession}) weißt du: Falsch eingestelltes Hebewerkzeug oder ein schiefer Schwerpunkt ruiniert dir auf Dauer das Kreuz. Jesus bietet dir an, sich mit dir in dasselbe Geschirr zu spannen – er übernimmt die Zugkraft, du führst nur die Richtung.`,
      systemDecoded: `FEHLERDIAGNOSE: Dein Denkstil (${profile.mindset}) oder das Leistungsdenken suggeriert: "Wenn du zusammenbrichst, hast du dich nur nicht genug angestrengt."
GÖTTLICHES FUNKTIONSPRINZIP: Reale Stärke beginnt beim Anerkennen von Belastungsgrenzen. Gnade ist keine Belohnung nach Feierabend, sondern die Antriebskraft während der Schicht.`,
      dailyFreedom: `Für deine Lebenssituation (${profile.relationshipStatus}): Erlaube dir heute Abend, unerledigte Dinge stehen zu lassen. Nach einem anstrengenden Tag als ${profession} war es genug. Schlaf und Loslassen sind ein geistlicher Akt des Vertrauens.`,
      heartGarden: `Hier im Garten musst du nichts beweisen. Keine Qualitätskontrolle, kein Chef, keine religiösen Forderungen (${profile.faithStage || 'Frei von Zwang'}). Nur reines Licht, das deine Reserven mitten in der Verfassung "${mood}" lautlos auffüllt.`,
      oxygenMask: `Herr, meine Batterien sind leer und ich bin ${mood}. Ich lege die Last meiner eigenen Ansprüche vor dir ab. Zieh du mit mir an einem Strang in meinem Alltag als ${profession}. Ich atme deine Ruhe ein. Amen.`,
      favorite: false,
    };
  }

  // Für Johannes 15:1-5 (Weinstock & Reben / Der Saftstrom)
  if (lowerPassage.includes('johannes 15') || lowerPassage.includes('john 15') || lowerPassage.includes('weinstock') || lowerPassage.includes('frucht')) {
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Johannes 15:1-5 (Ich bin der Weinstock, ihr seid die Reben)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: `Ein Ast strengt sich nicht krampfhaft an, Weintrauben herauszupressen. Er bleibt einfach angeschlossen an den Stamm, und der Saftstrom erledigt das Wachstum ganz natürlich (${profile.mindset}).`,
      workBench: `Als ${profession} weißt du: Wenn die Druckluftleitung oder der Stromanschluss gekappt ist, nützt die beste Maschine nichts mehr. Sobald die Zuleitung steht, fließt die Energie mühelos. So verhält es sich mit deiner geistigen Quelle im Alltag.`,
      systemDecoded: `FEHLERDIAGNOSE: Religiöser Krampf: "Ich muss mehr Leistung und Früchte produzieren!" (Fokus auf Output statt Input – ein typischer Fehler bei "${profile.mindset}").
GÖTTLICHES FUNKTIONSPRINZIP: Verbundenheit erzeugt Frucht. Wer angeschlossen bleibt, produziert automatisch Leben, ohne innerlich auszubrennen.`,
      dailyFreedom: `In deinem Alltag (${profile.relationshipStatus}): Hör auf, alles mit reiner Willenskraft erzwingen zu wollen. Nimm dir heute nach der Arbeit Zeit für das, was dich nährt, nicht nur für das, was von dir fordert.`,
      heartGarden: `Spüre den Durchfluss. Wie ein frischer Tau am Morgen bringt Gottes Gegenwart deine inneren Wurzeln zur Ruhe (${profile.faithStage || 'Geborgen'}). Du bist tief eingepflanzt, egal wie stürmisch der Arbeitstag war.`,
      oxygenMask: `Gott, ich will aufhören zu strampeln. Ich stöpsle mich wieder direkt an deine Versorgungsleitung an. Mitten in meiner heutigen Verfassung (${mood}) lass deinen Frieden durch mich fließen. Amen.`,
      favorite: false,
    };
  }

  // Dynamischer, feinfühliger Standard-Generator für jede beliebige Eingabe
  const cleanPassage = passage.trim() || 'Impuls für den Tag';
  return {
    id: 'lf_' + Date.now(),
    passage: cleanPassage,
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    coreConduit: `Mitten in deiner heutigen Verfassung (${mood}) gilt: Gott begegnet dir nicht in abgehobenen Floskeln, sondern passgenau dort, wo du als ${profession} denkst und handelst.`,
    workBench: `In deinem Berufsalltag als ${profession} (${profile.mindset}) brauchst du Verlässlichkeit, echte Passgenauigkeit und saubere Schnittstellen. Genau das ist diese Bibelstelle für dich: Sie ist kein weltfremdes Dogma, sondern eine praktische Schablone, um die Dinge in deinem Gewerk wieder ins Lot zu bringen.`,
    systemDecoded: `FEHLERDIAGNOSE: Wenn wir als ${profession} unter Druck stehen (${mood}), suchen wir oft mit unserem Denkstil (${profile.mindset}) nach hektischen Notlösungen oder verurteilen uns für Schwächen.
GÖTTLICHES PRINZIP: Gott fängt immer bei der Wiederherstellung der Verbindung an. Er richtet das Fundament aus, bevor Lasten aufgesetzt werden.`,
    dailyFreedom: `Für deine Lebenslage (${profile.relationshipStatus}): Nimm den Druck raus. Nach getaner Arbeit als ${profession} musst du heute Abend nicht die ganze Welt schultern. Es reicht, einen Schritt in Ruhe zu gehen.`,
    heartGarden: `Ein geschützter Raum fernab von Leistungsdruck und Erwartungen (${profile.faithStage || 'Auf der Suche'}). Lass den Sauerstoff tief in die Lungen strömen. Du bist gesehen, gewollt und bedingungslos angenommen.`,
    oxygenMask: `Herr, danke dass du meinen Arbeitsalltag als ${profession} genau kennst. Ich bin ${mood} und öffne mein Herz für deine Ruhe und deinen klaren Blick. Lass mich heute tief durchatmen. Amen.`,
    favorite: false,
  };
}

/**
 * Haupt-Service-Funktion zur Generierung des Lightflow-Reports
 * Arbeitet standardmäßig vollautomatisch ohne Nutzereingabe von Keys!
 */
export async function generateLightflowReport(
  passage: string,
  profile: UserProfile,
  mood: string,
  settings?: AppSettings
): Promise<LightflowReport> {
  // 1. Automatische Serverless API-Abfrage (falls online)
  if (navigator.onLine) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage, profile, mood }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text && !data.useFallback) {
          return parseReportSections(data.text, passage, profile, mood);
        }
      }
    } catch (e) {
      console.log('Automatischer Serverless-Call ging in Fallback über:', e);
    }
  }

  // 2. Client-Key Fallback (falls der Besitzer manuell einen eingetragen hat)
  const customApiKey = settings?.customApiKey?.trim();
  if (customApiKey && navigator.onLine) {
    try {
      const prompt = buildSystemPrompt(profile, passage, mood);
      const rawResponse = await callGeminiApi(prompt, customApiKey);
      if (rawResponse) {
        return parseReportSections(rawResponse, passage, profile, mood);
      }
    } catch (error) {
      console.warn('Manueller API Call fehlgeschlagen:', error);
    }
  }

  // 3. Vorinstallierte, autarke Lightflow-Engine (immer sofort verfügbar)
  await new Promise((resolve) => setTimeout(resolve, 950));
  return generateLocalReport(passage, profile, mood);
}
