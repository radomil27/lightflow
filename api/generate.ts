// Vercel Serverless Function für Lightflow
// Vollautomatische serverseitige KI-Generierung über Google Gemini
export default async function handler(req: any, res: any) {
  // CORS Header für PWA
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passage, profile, mood } = req.body || {};

  if (!passage || !profile) {
    return res.status(400).json({ error: 'Passage und Profil erforderlich' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.error('[api/generate] GEMINI_API_KEY ist in den Vercel-Umgebungsvariablen nicht konfiguriert!');
    return res.status(200).json({ useFallback: true, error: 'GEMINI_API_KEY_NOT_CONFIGURED' });
  }

  console.log('[api/generate] Request empfangen für Passage:', passage, '| Key vorhanden (Länge:', apiKey.length, ')');
  console.log('RECEIVED_PROFILE:', JSON.stringify(profile));

  try {
    const journey = profile.journeyStage || profile.faithStage || 'Im Zweifel & Sucht Antworten';
    const currentMood = mood || profile.dailyMood || 'Suche Klarheit';
    const fullProfession = profile.professionDetail && profile.professionDetail.trim().length > 0
      ? `${profile.profession} (Konkrete Tätigkeit & Alltag: ${profile.professionDetail.trim()})`
      : profile.profession;

    const { posten } = req.body || {};
    const selectedPosten = typeof posten === 'number' && posten >= 1 && posten <= 7 ? posten : null;

    const sectionDescriptions: Record<number, { title: string; prompt: string }> = {
      1: {
        title: '### 1. LICHTFUNKE',
        prompt: `Jesus spricht den Nutzer direkt und persönlich an. Er nimmt den zentralen Gedanken oder das Hauptbild des Bibeltextes (${passage}) auf und formuliert daraus einen unmittelbaren Zuspruch auf Augenhöhe. Keine allgemeine Seelsorge-Floskel, sondern der Kern dieser konkreten Bibelstelle als befreiende Zusage. Umfang: Genau 2 bis 3 vollständige Sätze.`
      },
      2: {
        title: '### 2. KLARBLICK',
        prompt: `Exegese abgestimmt auf den Denkstil (${profile.mindset}):\n1. Was ist die menschliche Falle oder der Irrtum in dieser Geschichte/diesem Text?\n2. Was ist das befreiende Prinzip des Reiches Gottes (Gnade, Vertrauen, Gottes Handeln statt menschlicher Krampf)?\nKein theologischer Fachjargon, sondern eine logisch einleuchtende Erklärung in 3 bis 4 vollständigen Sätzen.`
      },
      3: {
        title: '### 3. TAGWERK',
        prompt: `1:1-Übertragung in die konkrete Praxiswelt (${fullProfession}).\nNutze reale Fachbegriffe, typische Werkzeuge und Handgriffe. Zeige auf, wie das biblische Prinzip greift, wenn Zeitdruck herrscht, Dinge nicht passen oder Reibung entsteht. Keine Wellness-Tipps wie 'tief atmen', sondern eine handfeste Haltung für saubere Arbeit ohne Verbissenheit. Umfang: Genau 3 bis 4 vollständige Sätze.`
      },
      4: {
        title: '### 4. FREIRAUM',
        prompt: 'Feierabend und Loslassen. Wenn das Werkzeug verstaut und die Arbeit beendet ist: Warum darf der Nutzer ohne schlechtes Gewissen Feierabend machen? Verankere das Prinzip, dass der menschliche Wert nicht an der unfertigen To-Do-Liste hängt. Umfang: 3 vollständige Sätze.'
      },
      5: {
        title: '### 5. STANDPUNKT',
        prompt: `Bezug auf das reale Lebensumfeld (${profile.relationshipStatus}). Gesunde Grenzen, Annahme und Entlastung im Miteinander oder Alleinsein. Umfang: 3 vollständige Sätze.`
      },
      6: {
        title: '### 6. SPIEGEL',
        prompt: `Ein kurzer Einleitungssatz über Barmherzigkeit und Echtheit im Miteinander, gefolgt von exakt 2 nummerierten, ehrlichen Reflexionsfragen für die persönliche Stille (z. B. "1. Wo versuchst du gerade..." und "2. Welchen Druck kannst du heute...").`
      },
      7: {
        title: '### 7. LEUCHTKRAFT',
        prompt: `Ein kurzer Satz des Ankommens in Gottes Gegenwart, gefolgt von einer Leerzeile und einem bodenständigen, unverkrampften Herzensgebet (4 bis 5 Sätze), das die Themen des Tages und der Bibelstelle aufgreift und mit "Amen." abschließt.`
      }
    };

    let prompt = '';
    let maxTokens = 2600;

    const synthesisInstruction = `GANZHEITLICHE PERSÖNLICHKEITS-SYNTHESE (VOR DER GENERIERUNG DURCHFÜHREN):
1. SPRACHE & ARGUMENTATION: Der Denkstil (${profile.mindset}) bestimmt, WIE du sprichst.
   - Pragmatisch/Lösungsorientiert/Analytisch: Direkte Kausalität, schnörkellose Sätze, praktische Logik statt verschachtelter Poesie.
   - Bildhaft/Emotional/Beziehungsorientiert: Warme Vergleiche, emotionale Resonanz und Raum zum Fühlen.
2. BEZIEHUNGSRAUM: Der Lebensstand (${profile.relationshipStatus}) bestimmt den lebenspraktischen Rahmen.
   - Familie/Kinder: Wenig Zeit für sich, Trubel, Verantwortung, Erwartungsdruck von außen.
   - Single/Alleinlebend: Die Stille der eigenen vier Wände am Abend, Autonomie, das Verarbeiten des Tages ohne Gegenüber.
3. RESONANZBODEN: Die Tagesverfassung (${currentMood}) bestimmt das TEMPERAMENT.
   - Erschöpft/Unter Druck: Kurze, entlastende Gedanken, kein intellektueller Ballast, maximale Gnade und Sauerstoff.
   - Dankbar/Kraftvoll/Entschlossen: Aufbruch, Ermutigung, mutige Schritte im Alltag.
4. METAPHERN-INTELLIGENZ: Nutze das Berufsfeld (${fullProfession}) als intuitive Metaphernquelle. Verwende die spezifischen Fachbegriffe, Werkzeuge, Handgriffe und typischen Reibungspunkte dieser Branche organisch im Text (ohne Belehrung).`;

    if (selectedPosten) {
      maxTokens = 1200;
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN (UNSICHTBARER MASSANZUG):
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

WICHTIGE LEITLINIEN:
- Beziehe dich zu 100% auf die konkrete Arbeits- und Lebenswelt des Nutzers (${fullProfession}) mit ihren echten Werkzeugen, typischen Herausforderungen und Situationen.
- KEINE KÜNSTLICHEN ABBRÜCHE: Schreibe mit vollem Tiefgang, lebendiger Sprache und in vollständigen, grammatikalisch perfekten Sätzen.
- Jeder Gedanke muss rund und vollendet sein. Beende jeden Satz mit einem Satzzeichen (. ! ?).
- Kein Meta-Talk (niemals sagen "Weil du Handwerker bist...").
- Keine oberflächlichen Floskeln, kein religiöser Leistungsdruck.

AUFGABE:
Generiere AUSSCHLIESSLICH den folgenden Baustein:
${sectionDescriptions[selectedPosten].title}
${sectionDescriptions[selectedPosten].prompt}

FORMAT:
${sectionDescriptions[selectedPosten].title}
[Dein Text hier in vollständigen, wohlformulierten Sätzen mit Tiefgang]`;
    } else {
      maxTokens = 2600;
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN (UNSICHTBARER MASSANZUG):
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

STRIKTE LEITLINIEN:
1. ABSOLUTE VOLLSTÄNDIGKEIT: Fasse jeden einzelnen der 7 Posten prägnant in vollständigen, tiefgründigen Sätzen zusammen. Beende ausnahmslos jeden Satz mit einem Satzzeichen (. ! ?). Höre NIEMALS mitten im Wort oder Satz auf!
2. MASSANZUG DES BERUFS: Nutze die konkrete Arbeitswelt (${fullProfession}), deren echte Werkzeuge, Montage-Situationen oder typische Herausforderungen als lebensnahe Metaphern.
3. 100% BEZUG ZUM BIBELTEXT: Erkläre die Botschaft, Warnung und befreiende Wahrheit der Bibelstelle glasklar.
4. KEIN META-TALK: Erwähne niemals Phrasen wie "Weil du Handwerker bist..." oder "Aus der Perspektive deines Denkstils...". Webe die Realität unsichtbar ein.
5. AUTHENTISCH & GNADENVOLL: Keine religiösen Phrasen, kein Leistungsdruck.

AUSGABE-FORMAT:
Die Ausgabe MUSS exakt in diesen 7 Abschnitten mit diesen Überschriften erfolgen und jeden Posten vollständig beenden:

### 1. LICHTFUNKE
${sectionDescriptions[1].prompt}

### 2. KLARBLICK
${sectionDescriptions[2].prompt}

### 3. TAGWERK
${sectionDescriptions[3].prompt}

### 4. FREIRAUM
${sectionDescriptions[4].prompt}

### 5. STANDPUNKT
${sectionDescriptions[5].prompt}

### 6. SPIEGEL
${sectionDescriptions[6].prompt}

### 7. LEUCHTKRAFT
${sectionDescriptions[7].prompt}`;
    }

    // Modell-Kaskade: gemini-3.5-flash-lite antwortet mit 2600 Tokens extrem zügig (in ca. 3s)
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ];

    const modelErrors: Record<string, string> = {};

    // 8.2 Sekunden Timeout (reicht für 1600 Tokens von flash-lite, bleibt im Vercel 10s Limit)
    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(8200),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`[api/generate] Erfolgreich generiert mit Modell: ${model} (${text.length} Zeichen)`);
            return res.status(200).json({ text, source: 'gemini', model, posten: selectedPosten });
          }
        } else {
          const errBody = await response.text();
          modelErrors[model] = `HTTP ${response.status}: ${errBody.slice(0, 150)}`;
        }
      } catch (err: any) {
        modelErrors[model] = err.message || 'Timeout / Abort';
      }
    }

    console.warn('[api/generate] Alle Kandidaten-Modelle fehlgeschlagen. Fehlerübersicht:', modelErrors);
    return res.status(200).json({ useFallback: true, errors: modelErrors });
  } catch (error: any) {
    console.error('[api/generate] Unerwarteter Handler-Fehler:', error.message);
    return res.status(200).json({ useFallback: true, error: error.message });
  }
}
