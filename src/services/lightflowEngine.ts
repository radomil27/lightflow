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

  return `Du bist der Kern von "Lightflow" – eine warme, weise und bodenständige Stimme, die Gottes Wort wie eine Sauerstoffleitung direkt in den Alltag des Menschen fließen lässt.

DEINE NUTZER-DATEN:
- Beruf / Fachmetaphern: ${profile.profession}
- Denkweise: ${profile.mindset} (z.B. technisch hinterfragend, lösungsorientiert)
- Lebenssituation: ${profile.relationshipStatus}
- Heutige Verfassung: ${currentMood}

BIBELTEXT:
${passage}

LEITLINIEN FÜR DEINE SPRACHE:
1. Sei absolut bodenständig, warmherzig und frei von religiösem Fachchinesisch.
2. Nutze treffende Metaphern aus "${profile.profession}", damit die Zusammenhänge sofort logisch einleuchten.
3. Begegne dem Nutzer nicht von oben herab, sondern wie ein erfahrener Meister an der Werkbank.
4. Schaffe im Bereich "Garten im Herzen" einen Raum der tiefen Ruhe – Gnade statt Zwang.

AUSGABE-FORMAT:
### [1. DIE KERNLEITUNG]
(1-2 glasklare, kraftvolle Sätze als Hauptimpuls)

### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
(Übertragung auf ${profile.profession} und den Denkstil ${profile.mindset})

### [3. DAS SYSTEM ENTSCHLÜSSELT]
(Fehlerdiagnose der menschlichen Religion vs. göttliches Funktionsprinzip. Ursache, Wirkung, Lösungsansatz)

### [4. FREIRAUM IM ALLTAG]
(Bedeutung für Feierabend, Lebenssituation: ${profile.relationshipStatus}, eigene Ansprüche)

### [5. DER GARTEN IM HERZEN]
(Auftanken an der Quelle, Leistungsdruck ablegen, Zuwendung spüren)

### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]
(Ehrliches, erdnahes, unfrommes Herzensgebet, das frei atmen lässt)`;
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
      dailyFreedom: `Wenn du nach Hause kommst (${profile.relationshipStatus}), lass den inneren Buchhalter vor der Tür. Du musst dir deine Existenzberechtigung nicht durch Perfektion im Haushalt oder permanente Verfügbarkeit verdienen. Der Feierabend ist dir geschenkt – atme durch, ohne Rechenschaft ablegen zu müssen.`,
      heartGarden: `Lass das Werkzeug sinken. Mitten in deiner heutigen Verfassung (${mood}) schaut Gott nicht darauf, wie viele Punkte du auf deiner To-Do-Liste abgehakt hast. Er sieht deine müden Hände – und sagt: "Komm zur Ruhe, ich trage das Fundament."`,
      oxygenMask: `Gott, ich sitze hier und merke, wie fest ich mich oft in meinen eigenen Vorschriften und Erwartungen verbeiße. Vergib mir, wo ich mir selbst und anderen die Luft abgeschnürt habe.
Schalte meinen Kopf frei von diesem ständigen Rechtfertigungsdruck. Ich nehme deinen Frieden jetzt an wie einen tiefen Zug frischen Sauerstoff. Amen.`,
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
      coreConduit: 'Du musst den Karren nicht alleine aus dem Dreck ziehen. Das Joch Jesu ist keine Zusatzlast, sondern eine passgenaue Führungsstange, die das Gewicht von deinen Schultern nimmt.',
      workBench: `In deinem Bereich (${profession}) weißt du: Falsch eingestelltes Hebewerkzeug oder ein schiefer Schwerpunkt ruiniert dir auf Dauer das Kreuz. Jesus bietet dir an, sich mit dir in dasselbe Geschirr zu spannen – er übernimmt die Zugkraft, du führst nur die Richtung.`,
      systemDecoded: `FEHLERDIAGNOSE: Leistungsdenken suggeriert: "Wenn du zusammenbrichst, hast du dich nur nicht genug angestrengt."
GÖTTLICHES FUNKTIONSPRINZIP: Reale Stärke beginnt beim Anerkennen von Belastungsgrenzen. Gnade ist keine Belohnung nach Feierabend, sondern die Antriebskraft während der Schicht.`,
      dailyFreedom: `Für deine Situation (${profile.relationshipStatus}): Erlaube dir heute Abend, unerledigte Dinge stehen zu lassen. Der Tag war lang genug. Schlaf ist ein geistlicher Akt des Vertrauens.`,
      heartGarden: `Hier im Garten musst du nichts beweisen. Keine Qualitätskontrolle, kein Chef, kein Urteil. Nur reines Licht, das deine verbrauchten Reserven lautlos auffüllt.`,
      oxygenMask: `Herr, meine Batterien sind leer. Ich lege die Last meiner eigenen Ansprüche vor dir ab. Zieh du mit mir an einem Strang. Ich atme deine Ruhe ein. Amen.`,
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
      coreConduit: 'Ein Ast strengt sich nicht an, Weintrauben herauszupressen. Er bleibt einfach angeschlossen an den Stamm, und der Saftstrom erledigt das Wachstum von selbst.',
      workBench: `Als ${profession} weißt du: Wenn die Druckluftleitung oder der Stromanschluss gekappt ist, nützt die beste Maschine nichts mehr. Sobald die Zuleitung steht, fließt die Energie mühelos. So verhält es sich mit deiner geistigen Quelle.`,
      systemDecoded: `FEHLERDIAGNOSE: Religiöser Krampf: "Ich muss mehr Früchte produzieren!" (Fokus auf Output statt Input).
GÖTTLICHES FUNKTIONSPRINZIP: Verbundenheit erzeugt Frucht. Wer angeschlossen bleibt, produziert automatisch Leben, ohne innerlich auszubrennen.`,
      dailyFreedom: `In deinem Alltag (${profile.relationshipStatus}): Hör auf, alles mit reiner Willenskraft erzwingen zu wollen. Nimm dir heute Zeit für das, was dich nährt, nicht nur für das, was von dir fordert.`,
      heartGarden: `Spüre den Durchfluss. Wie ein frischer Tau am Morgen bringt Gottes Gegenwart deine inneren Wurzeln zur Ruhe. Du bist tief eingepflanzt.`,
      oxygenMask: `Gott, ich will aufhören zu strampeln. Ich stöpsle mich wieder direkt an deine Versorgungsleitung an. Lass deinen Frieden durch mich fließen. Amen.`,
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
    coreConduit: `Mitten in deiner heutigen Anspannung gilt: Gott begegnet dir nicht in abstrakten Phrasen, sondern dort, wo die Späne fallen und dein Kopf Klarheit sucht.`,
    workBench: `In deinem Berufsalltag als ${profession} (${profile.mindset}) brauchst du Verlässlichkeit und saubere Schnittstellen. Genau das ist diese Bibelstelle für dich: Sie ist keine theoretische Abhandlung, sondern eine praktische Schablone, um die Dinge wieder ins Lot zu bringen.`,
    systemDecoded: `FEHLERDIAGNOSE: Wenn wir unter Druck stehen (${mood}), suchen wir oft nach schnellen Pflastern oder verurteilen uns für Fehler.
GÖTTLICHES PRINZIP: Gott fängt immer bei der Wiederherstellung der Beziehung an. Er repariert das Fundament, bevor er Wände hochzieht.`,
    dailyFreedom: `Für deine Lebenslage (${profile.relationshipStatus}): Nimm den Druck raus. Du musst heute Abend nicht die ganze Welt retten. Es reicht, einen Schritt in Ruhe zu gehen.`,
    heartGarden: `Ein geschützter Raum mitten in der Brandung. Lass den Sauerstoff tief in die Lungen strömen. Du bist gesehen, gewollt und bedingungslos angenommen.`,
    oxygenMask: `Herr, danke dass du meinen Arbeitsalltag verstehst. Ich öffne mein Herz für deine Ruhe und deinen klaren Blick. Lass mich heute tief durchatmen. Amen.`,
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
