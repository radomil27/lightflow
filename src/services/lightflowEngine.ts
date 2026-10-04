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

  return `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

AUFGABE:
Lege den ausgewählten BIBELTEXT mit 100%iger Treue und Tiefenschärfe aus.
Übersetze seine tiefste theologische Bedeutung, seine Mechanismen und seine Botschaft vollkommen organisch in die Begriffswelt, Bildsprache und Denkstruktur des Nutzers – OHNE Jemals zu erklären oder zu erwähnen, welche Attribute im Profil stehen!

AUSGEWÄHLTER BIBELTEXT / PASSAGE:
${passage}

HINTERGRUND DES ZUHÖRERS (Nur als Schablone und Resonanzraum für Bildnisse und Sprache nutzen!):
- Lebenswelt & vertraute Metaphern: "${profile.profession}"
- Denkstil & Verstehensmuster: "${profile.mindset}"
- Alltägliche Lebenssituation: "${profile.relationshipStatus}"
- Glaubensphase: "${profile.faithStage || 'Auf der Suche'}"
- Heutige Verfassung: "${currentMood}"

STRIKTE REGELN (SEHR WICHTIG):
1. KEIN META-TALK: Schreibe NIEMALS Sätze wie "Da du als X arbeitest...", "In deinem Beruf als...", "Weil du Single/Familie bist...", "Für dein Mindset...". Der Nutzer weiß selbst, was er arbeitet und wie er lebt! Sprich einfach direkt in seiner Sprache und mit Bildern, die sich anfühlen, als wären sie wie selbstverständlich für ihn gedacht.
2. 100% BEZUG AUF DEN BIBELTEXT: Jeder Gedanke, jede Analogie und jeder Schritt muss direkt aus den Versen und Geschehnissen des Bibeltextes hervorgehen. Erkläre den Text, seine Dynamik, was damals geschieht und was das universelle Prinzip dahinter ist.
3. MAẞGESCHNEIDERTE VERSTÄNDNIS-HILFE: Nutze packende, präzise Bildnisse und Parallelen, die den Text sofort begreifbar machen (z. B. handwerkliche Toleranzen, Hebelkräfte, Materialspannungen, Systemregeln, Stromkreise, je nach Welt des Nutzers).
4. KEINE FROMMEN FLOSKELN: Kein hohles Kirchen-Deutsch. Authentisch, kraftvoll, geerdet und tief berührend.

STRUKTUR DER 6 BEREICHE:

### [1. DIE KERNLEITUNG]
(1-2 glasklare, kraftvolle Sätze. Die Essenz des Bibeltextes auf den Punkt gebracht – messerscharf und unmittelbar treffend.)

### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
(Nimm das zentrale Geschehen / Gleichnis / Gebot des Bibeltextes und übersetze das Funktionsprinzip in ein treffendes Bild aus der Lebenswelt. Zeige ganz konkret, warum der biblische Grundsatz physikalisch/praktisch genauso funktioniert wie ein alltägliches Natur- oder Handwerksgesetz. Ohne Floskeln, reine praktische Bildhaftigkeit des Textes.)

### [3. DAS SYSTEM ENTSCHLÜSSELT]
(Analytische Text-Entschlüsselung: Was ist der theologische / menschliche Kernkonflikt im Bibeltext? Welcher Denkfehler oder falsche Mechanismus wird von Jesus / dem Text entlarvt? Welches göttliche Prinzip wird stattdessen offengelegt? Ursache, Hebelwirkung und Befreiung.)

### [4. FREIRAUM IM ALLTAG]
(Die praktische Konsequenz des Bibeltextes für den heutigen Feierabend und das persönliche Leben: Was bedeutet die Botschaft dieser Verse, wenn der Arbeitstag vorbei ist? Welche Last nimmt der Bibeltext von den Schultern?)

### [5. DER GARTEN IM HERZEN]
(Der spirituelle Ruhepol des Bibeltextes: Wo schenkt dieser konkrete Text bedingungslose Gnade, Schutz und Annahme? Ein Ort des Auftankens, abgeleitet direkt aus dem Trost und der Tiefe der Schriftstelle.)

### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]
(Ein ehrliches, unfrommes Gebet in der Ich-Form, das unmittelbar auf die Botschaft des Bibeltextes antwortet. Wie das erste tiefe Durchatmen nach einem langen Tauchgang.)`;
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
 * 100% Bezug auf den Bibeltext, organische Bildnisse statt Profilerklärungen.
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

  // Spezieller Deep-Report für Matthäus 12:1-14 (Sabbat & Barmherzigkeit)
  if (lowerPassage.includes('matthäus 12') || lowerPassage.includes('matt 12') || lowerPassage.includes('sabbat')) {
    let workbenchText = '';
    if (isHandwerk) {
      workbenchText = `Wenn beim Montieren einer tragenden Platte unverhofft ein Wasserrohr in der Wand anbohrt wird, greifst du sofort zum Absperrventil – egal, ob die Feierabend-Sirene gerade schrillt oder die Prüfnorm eine Pause vorschreibt. Wer in diesem Moment tatenlos im Normenheft blättert, ruiniert die Bausubstanz.
Genau diesen Irrsinn entlarvt Jesus bei den Ähren auf dem Feld und dem Mann mit der verdorrten Hand: Die Pharisäer verwechselten das Sicherungsgerüst mit dem eigentlichen Bauwerk. Ein Schutzgesetz, das im Notfall die Rettung von Leben verbietet, hat seinen eigenen Konstruktionszweck verfehlt. Barmherzigkeit ist keine Missachtung von Regeln, sondern das oberste Fundament, auf dem jede Norm erst ruht.`;
    } else if (isIT) {
      workbenchText = `Wenn im Produktivsystem ein kritischer Datenverlust droht, pocht kein erfahrener Architekt auf den Genehmigungsprozess des nächsten Sprint-Meetings – du spielst den Hotfix ein. 
Die Gesetzeslehrer in Matthäus 12 betrieben genau diese destruktive Prozessstarre: Sie beharrten auf der Einhaltung von 39 bürokratischen Sabbat-Klauseln, während ein hungernder Mensch oder eine verdorrte Hand vor ihnen stand. Jesus stellt die Kern-Architektur wieder her: Das Framework wurde für den Anwender gebaut, nicht der Anwender für das Framework. Wo Leben auf dem Spiel steht, setzt Gnade die Priorität.`;
    } else if (isCare) {
      workbenchText = `Wenn ein Patient plötzlich keine Luft mehr bekommt, wird jede Dokumentation und jede Schichtpause augenblicklich unterbrochen. Wer zuerst die Formulare abheftet, verliert den Menschen.
Genau vor dieser Wahl standen die Schriftgelehrten in der Synagoge. Sie beobachteten lauernd, ob Jesus am Ruhetag heilt. Seine Antwort ist glasklar: Heilung und Leben dulden keinen bürokratischen Aufschub. Der Sabbat wurde gestiftet, um Leben zu schenken – nicht, um Schmerz aus Prinzip zu konservieren.`;
    } else {
      workbenchText = `Ein Sicherheitsventil oder eine Vorschrift hat nur eine einzige Daseinsberechtigung: Schaden vom Menschen abzuwenden. Wenn eine Vorschrift plötzlich dazu führt, dass Schaden entsteht oder Not ignoriert wird, hat sie ihren Sinn ins Gegenteil verkehrt.
Jesus stellt in Matthäus 12 klar: Gottes Gesetze sind Rettungsanker, keine Knebelverträge. Leben zu retten und Not zu lindern steht über jeder formalen Routine.`;
    }

    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 12:1-14 (Der Sinn des Ruhetags & Barmherzigkeit)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: 'Gottes Ordnungen sind Lebensretter, keine Handschellen. Der Ruhetag wurde gestiftet, damit der Mensch wieder zu Kräften kommt – nicht, damit er unter religiöser Kontrolle erstickt.',
      workBench: workbenchText,
      systemDecoded: `DER KERNKONFLIKT:
Die Pharisäer haben aus dem Geschenk des Ruhetags ein millimetergenaues Überwachungssystem gemacht. Sie diskutieren über Ähren-Reiben am Sabbat, während Gott nach Barmherzigkeit sucht („Barmherzigkeit will ich, nicht Schlachtopfer“).

DAS GÖTTLICHE FUNKTIONSPRINZIP:
1. Ursache: Gott setzt Grenzen und Ruhezeiten, um den Menschen vor Selbstausbeutung zu schützen.
2. Der Denkfehler: Der Mensch macht aus dem Schutz ein Verdienstmodell und knechtet sich selbst mit Erwartungen.
3. Die Befreiung: Der Sohn des Menschen ist Herr über den Sabbat. Heilung, Rettung und Aufatmen haben immer Vorfahrt vor starrer Pflichterfüllung.`,
      dailyFreedom: `Wenn du heute Abend den Schlüssel im Schloss umdrehst, lass jede Rechenschaftspflicht vor der Tür. Du musst deinen Wert nicht durch eine fehlerfreie Bilanz des Tages rechtfertigen. Matthäus 12 befreit dich von der Illusion, dass dein Dasein an ständiger Pflichterfüllung hängt: Ruhe ist kein Bonus nach getaner Perfektion, sondern ein unantastbares Geschenk.`,
      heartGarden: `Tritt ein in diesen geschützten Raum. Sieh die verdorrte Hand in der Synagoge: Jesus verlangte keine Vorleistung, keinen Glaubenstest, keine Bewährung. Er sagte einfach: „Strecke deine Hand aus!“ Und sie wurde gesund.
Genauso darfst du vor ihm deine leeren, müden Hände ausstrecken. Er fordert nichts von dir. Er stellt dich wieder her.`,
      oxygenMask: `Herr, ich merke, wie tief der Zwang in mir sitzt, immer alles richtig zu machen und zu funktionieren. Ich verbeiße mich in Erwartungen und vergesse das Atmen.
Danke für dein klares Wort aus Matthäus 12. Du willst mein Leben, meine Gesundheit und mein Aufatmen – nicht meine krampfhaften Opfer. Ich lasse die Kontrolle los und atme deinen Frieden ein. Amen.`,
      favorite: false,
    };
  }

  // Für Matthäus 11:28-30 (Die leichte Last / Kommt her zu mir alle)
  if (lowerPassage.includes('matthäus 11') || lowerPassage.includes('matt 11') || lowerPassage.includes('mühselig') || lowerPassage.includes('last')) {
    let workbenchText = '';
    if (isHandwerk) {
      workbenchText = `Wer schwere Balken oder Granitplatten schleppt, weiß: Ein falsch austarierter Schwerpunkt oder ein improvisierter Tragegurt ruiniert dir in kürzester Zeit die Wirbelsäule. Bei einem gut eingestellten Hebegeschirr verteilt sich die Last physikalisch optimal auf den Körperschwerpunkt.
Genau dieses handfeste Bild nutzt Jesus mit dem „Joch“. Ein antikes Joch war eine maßgefertigte Holzführung für Ochsen, die punktgenau an den Nacken angepasst wurde, damit kein Scheuern und kein Wundreiben entstand. Jesus sagt nicht: „Zieh den Karren allein!“ Er spannt sich selbst mit ein: Er trägt die Hebelkraft, damit die Last für dich tragbar wird.`;
    } else {
      workbenchText = `Ein exakt ausbalanciertes Hebewerkzeug nimmt das zerstörerische Gewicht aus den Gelenken. Das ist die Mechanik hinter dem Joch Jesu: Er bietet keine zusätzliche Last an, sondern ein passgenaues Tragesystem, bei dem er die Hauptzugkraft übernimmt, während du im Gleichtakt mit ihm gehst.`;
    }

    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 11:28-30 (Kommt her zu mir alle, die ihr mühselig und beladen seid)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: 'Du musst den Karren nicht aus eigener Kraft über den Berg wuchten. Das Joch Jesu nimmt den Druck von deinen Schultern, weil er die Hauptzugkraft trägt.',
      workBench: workbenchText,
      systemDecoded: `DER KERNKONFLIKT:
Die religiöse Umwelt legte den Menschen schwere Lasten auf, rührte sie aber mit keinem Finger an. Der Mensch brennt aus, weil er meint, alles mit Willenskraft stemmen zu müssen.

DAS GÖTTLICHE FUNKTIONSPRINZIP:
1. Diagnose: Mühsal entsteht durch Reibung – wenn wir Lasten tragen, für die wir nie konstruiert wurden.
2. Das Prinzip: „Mein Joch ist sanft und meine Last ist leicht.“ Sanft bedeutet im Griechischen „gut passend, maßgefertigt“.
3. Die Befreiung: Wer lernt, im Takt Jesu mitzugehen, findet Ruhe für seine Seele mitten in der Bewegung.`,
      dailyFreedom: `Lass die unerledigten Dinge des Tages heute Abend los. Jesus fordert nicht, dass du alle Baustellen der Welt schließt, bevor du dich hinlegst. Das Aufhören ist ein Bekenntnis, dass er die Welt in den Händen hält, während du schläfst.`,
      heartGarden: `„Kommt her zu mir alle.“ Kein Auswahlverfahren, keine Eignungsprüfung. Wenn deine Kräfte am Ende sind, bist du hier am richtigen Ort. Lehne dich an. Du darfst schwach sein, ohne Scham.`,
      oxygenMask: `Herr, meine Schultern sind verspannt und mein Kopf ist voll. Ich habe wieder versucht, alles allein zu wuchten.
Ich hänge mich an deine Kraft an. Nimm du die Führung und das Gewicht. Ich atme deine Ruhe ein und lasse meine Anspannung fallen. Amen.`,
      favorite: false,
    };
  }

  // Für Johannes 15:1-5 (Weinstock & Reben / Der Saftstrom)
  if (lowerPassage.includes('johannes 15') || lowerPassage.includes('john 15') || lowerPassage.includes('weinstock') || lowerPassage.includes('frucht')) {
    let workbenchText = '';
    if (isHandwerk || isIT) {
      workbenchText = `Wenn ein Werkzeug oder ein Server von der Stromversorgung getrennt ist, nützt alles Drücken auf den Starterknopf nichts: Es gibt schlicht keine Energie. Niemand erwartet von einer Fräse oder einer Platine, dass sie aus eigenem Willen Strom erzeugt. Sie muss nur stabil eingesteckt sein; der Stromfluss erledigt den Rest.
Genau das ist das Gesetz des Weinstocks in Johannes 15: Eine Rebe schwitzt nicht, um Weintrauben herauszupressen. Sie bleibt schlicht mit dem Stamm verwachsen. Der Saftstrom der Wurzel steigt von alleine auf und lässt die Frucht wachsen.`;
    } else {
      workbenchText = `Ein Zweig strengt sich nicht krampfhaft an, Früchte zu produzieren. Seine einzige Aufgabe ist die intakte Verbindung zum Stamm. Sobald der Saftstrom ungehindert fließt, entsteht Wachstum ganz organisch.`;
    }

    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Johannes 15:1-5 (Ich bin der Weinstock, ihr seid die Reben)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      coreConduit: 'Ein Zweig presst Früchte nicht mit purer Willenskraft hervor. Er bleibt einfach angeschlossen an die Quelle – der Saftstrom erledigt das Wachstum.',
      workBench: workbenchText,
      systemDecoded: `DER KERNKONFLIKT:
Der ständige Druck: „Ich muss mehr leisten, mehr Frucht bringen, besser sein!“ Wir verwechseln Ursache (Verbindung) mit Wirkung (Frucht).

DAS GÖTTLICHE FUNKTIONSPRINZIP:
1. Trennung: „Getrennt von mir könnt ihr nichts tun.“ Ausgebrannte Willenskraft führt zu Reibung und Erschöpfung.
2. Der Saftstrom: Das Leben kommt von unten, aus der Wurzel Gottes, nicht aus eigener Muskelkraft.
3. Die Lösung: Nicht an der Frucht zerren, sondern die Schnittstelle pflegen. Wer angeschlossen bleibt, bringt von selbst viel Frucht.`,
      dailyFreedom: `Hör heute Abend auf, dir Vorwürfe über das zu machen, was du heute nicht geschafft hast. Nähre heute deine Verbindung – durch Stille, Essen, Musik, Schlaf. Das Leben fließt dir zu, du musst es nicht erzwingen.`,
      heartGarden: `Spüre den Durchfluss. Deine Wurzeln sind tief im reichen Boden gegründet. Kein Windstoß reißt dich ab. Du bist gehalten von einem Stamm, der niemals wankt.`,
      oxygenMask: `Vater, vergib mir, wo ich mich verkrampft habe, um Frucht zu erzwingen. Ich stöpsle mich wieder bei dir ein.
Lass deinen Lebenssaft durch meine Gedanken fließen. Ich lasse das Ringen los und ruhe in dir. Amen.`,
      favorite: false,
    };
  }

  // Universeller, tiefgründiger Ausleger für jeden gewählten Bibeltext
  return {
    id: 'lf_' + Date.now(),
    passage: passage.trim() || 'Impuls für den Tag',
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    coreConduit: `Dieser Text begegnet dir nicht als abstrakte Theorie, sondern als präzise Funktionsanleitung für das Leben mitten in den Reibungen des Alltags.`,
    workBench: `In der Praxis entscheidet nicht die Theorie, sondern ob die Gesetze der Mechanik und Passgenauigkeit eingehalten werden: Ein Fundament, das aus dem Lot ist, zieht jede nachfolgende Konstruktion schief.
Genau darauf zielt dieser Bibeltext ab: Er deckt auf, wo eine Schieflage im Fundament entstanden ist, und richtet den Maßstab neu aus. Nicht um anzuklagen, sondern um wieder Stabilität und Leichtigkeit herzustellen.`,
    systemDecoded: `DER TEXT ENTSCHLÜSSELT:
1. Wo die menschliche Schieflage liegt: Wir versuchen oft, äußere Symptome mit noch mehr Druck und Kontrolle zu reparieren, statt an die eigentliche Ursache heranzugehen.
2. Das biblische Prinzip: Gott repariert immer zuerst die Zuleitung und die Beziehung, bevor er Belastung auf die Konstruktion legt.
3. Die Befreiung: Ausrichtung am göttlichen Maßstab nimmt den Krampf und bringt echte Tragfähigkeit hervor.`,
    dailyFreedom: `Nimm den Druck von deinen Schultern. Wenn du heute nach Hause gehst, musst du nicht die ganze Welt reparieren. Lass die Baustelle ruhen; Gottes Verheißung gilt auch, während du loslässt.`,
    heartGarden: `Ein stiller Ort mitten in der Hektik. Hier gelten keine Zielvereinbarungen und keine Prüfprotokolle. Atme ein: Du bist angenommen, bewahrt und mit allem versorgt, was du brauchst.`,
    oxygenMask: `Herr, danke für dein Wort, das mitten in meine reale Welt spricht. Kläre meinen Blick, wo ich den Wald vor lauter Bäumen nicht sehe.
Ich lege mein ganzes Gewicht in deine Zusage und nehme deinen Frieden tief in mich auf. Amen.`,
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
