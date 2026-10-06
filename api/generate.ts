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
    const userName = profile.displayName && profile.displayName.trim().length > 0 ? profile.displayName.trim() : '';
    const fullProfession = profile.professionDetail && profile.professionDetail.trim().length > 0
      ? `${profile.profession} (Konkrete Tätigkeit & Alltag: ${profile.professionDetail.trim()})`
      : profile.profession;

    const { posten } = req.body || {};
    const selectedPosten = typeof posten === 'number' && posten >= 1 && posten <= 7 ? posten : null;

    const sectionDescriptions: Record<number, { title: string; prompt: string }> = {
      1: {
        title: '### 1. LICHTFUNKE',
        prompt: `Jesus spricht den Nutzer direkt und persönlich an.${userName ? ` Er darf den Nutzer genau EINMAL zu Beginn mit seinem Vornamen (${userName}) ansprechen (z. B. 'Komm erst einmal an, ${userName}...').` : ''} Er fasst das Herzstück und die Hauptaussage dieses konkreten Verses (${passage}) zusammen. Keine allgemeine Seelsorge-Floskel, sondern das, was ER in diesem Text wirklich sagt – sei es ein befreiender Zuspruch, eine ernste Ermutigung oder ein Weckruf. Umfang: Genau 2 bis 3 vollständige Sätze.`
      },
      2: {
        title: '### 2. KLARBLICK',
        prompt: `Präzise Exegese und Warnungs-Analyse, abgestimmt auf den Denkstil (${profile.mindset}):\n1. Was ist die historische/theologische Kernbotschaft dieses Textes?\n2. Wo liegt die konkrete WARNUNG, die Stolperfalle oder der menschliche Denkfehler, den der Text aufdeckt?\n3. Was ist die göttliche Lösung oder der Ausweg, den Jesus anbietet?\nGlasklare, logische Erklärung in 3 bis 4 vollständigen Sätzen.`
      },
      3: {
        title: '### 3. TAGWERK',
        prompt: `Übertragung des Verses auf das Berufsfeld (${fullProfession}):\n1. Einprägsames Merk-Bild: Verknüpfe die Wahrheit des Verses mit einem typischen Werkzeug, Handgriff oder einer konkreten Situation aus dieser Branche, sodass der Nutzer tagsüber sofort an den Vers erinnert wird, wenn er dieses Werkzeug sieht oder nutzt.\n2. Konkrete Handlung: Was kann der Nutzer heute ganz konkret tun oder lassen?\n3. Das geistliche WARUM dahinter: Erkläre glasklar die theologische Begründung (Warum wirkt dieses Prinzip befreiend? Welcher Mechanismus des Reiches Gottes steckt dahinter?).\nUmfang: Genau 3 bis 4 vollständige, kraftvolle Sätze. Funktioniert zu jeder Tageszeit (morgens, mittags, abends).`
      },
      4: {
        title: '### 4. FREIRAUM',
        prompt: `Übertragung auf den Feierabend, die Gedankenwelt und die Freizeit.\nWas sagt dieser Vers über den Umgang mit Sorgen, freien Stunden oder falschen Prioritäten? Wie befreit dieser Text von innerem Druck oder falscher Selbstgerechtigkeit nach getaner Arbeit? Umfang: Genau 3 vollständige Sätze.`
      },
      5: {
        title: '### 5. STANDPUNKT',
        prompt: `Wirkung auf den Lebensstand (${profile.relationshipStatus}) und das Miteinander.\nWelche Verhaltensweise oder Haltung fordert bzw. schenkt der Vers im persönlichen Umfeld (z. B. Wahrheit in Liebe sagen, Vergebung, gesunde Grenzen, Treue)? Umfang: Genau 3 vollständige Sätze.`
      },
      6: {
        title: '### 6. SPIEGEL',
        prompt: `Ein kurzer Satz zur Notwendigkeit ehrlicher Selbstprüfung vor Gott, gefolgt von exakt 2 nummerierten, scharfen Fragen:\n1. Eine Frage zur konkreten WARNUNG des Textes (z. B. '1. Wo bist du in Gefahr, denselben Irrtum/Fehler zu begehen wie...').\n2. Eine Frage zur praktischen UMSETZUNG (z. B. '2. Welchen konkreten Schritt verlangt diese Wahrheit heute von dir?').`
      },
      7: {
        title: '### 7. LEUCHTKRAFT',
        prompt: `Ein kurzer Einleitungssatz der Stille, gefolgt von einer Leerzeile und einem bodenständigen Herzensgebet (4 bis 5 Sätze), das eine direkte Antwort auf DIESEN Bibeltext ist:\n- Dank für die konkrete Wahrheit des Verses.\n- Bitte um Wachsamkeit gegenüber der aufgedeckten Warnung.\n- Bitte um Kraft für die Umsetzung im Alltag.\nAbschluss mit 'Amen.'.`
      }
    };

    let prompt = '';
    let maxTokens = 2600;

    const synthesisInstruction = `GANZHEITLICHE PERSÖNLICHKEITS-SYNTHESE (VOR DER GENERIERUNG DURCHFÜHREN):
1. STRIKTE TEXTTREUE & KLARE KANTE (ABSOLUTE PRIORITÄT):
   - Der eingegebene Bibeltext (${passage}) bestimmt das Thema, die Schärfe und die Tonalität.
   - KEIN generischer Wellness-Einheitsbrei: Wenn der Text warnt (z. B. vor Heuchelei, Habgier, Trägheit, falscher Sicherheit), decke die Warnung schonungslos und klar auf. Wenn der Text tröstet, tröste. Wenn der Text zur Umkehr oder Tat ruft, formuliere einen klaren Handlungsauftrag.
   - Beziehe jede Aussage, jedes Bild und jedes Gebet direkt auf den Inhalt, die Personen und die Ereignisse dieser konkreten Bibelstelle.
2. PERSÖNLICHE ANREDE & NAMENS-DOSIERUNG:
   ${userName ? `- Der Nutzer heißt ${userName}. Jesus darf den Nutzer in Posten 1 (LICHTFUNKE) genau EINMAL zu Beginn persönlich beim Vornamen ansprechen (z. B. 'Komm erst einmal an, ${userName}...').
   - In den übrigen Posten (2 bis 6) wird der Name NICHT künstlich wiederholt (keine ständige Nennung wie ein Verkäufer).
   - In Posten 7 (Gebet) spricht der Nutzer zu Gott – dort wird der eigene Name ebenfalls NICHT genannt.` : '- Es ist kein Vorname hinterlegt. Sprich den Nutzer direkt mit „du“ / „dir“ an, ohne künstliche Anrede.'}
3. SPRACHE & ARGUMENTATION: Der Denkstil (${profile.mindset}) bestimmt, WIE du sprichst.
   - Pragmatisch/Lösungsorientiert/Analytisch: Direkte Kausalität, schnörkellose Sätze, praktische Logik statt verschachtelter Poesie.
   - Bildhaft/Emotional/Beziehungsorientiert: Warme Vergleiche, emotionale Resonanz und Raum zum Fühlen.
4. BEZIEHUNGSRAUM: Der Lebensstand (${profile.relationshipStatus}) bestimmt den lebenspraktischen Rahmen.
   - Familie/Kinder: Wenig Zeit für sich, Trubel, Verantwortung, Erwartungsdruck von außen.
   - Single/Alleinlebend: Die Stille der eigenen vier Wände am Abend, Autonomie, das Verarbeiten des Tages ohne Gegenüber.
5. METAPHERN-INTELLIGENZ: Nutze das Berufsfeld (${fullProfession}) als intuitive Metaphernquelle. Verwende die spezifischen Fachbegriffe, Werkzeuge, Handgriffe und typischen Reibungspunkte dieser Branche organisch im Text (ohne Belehrung).`;

    if (selectedPosten) {
      maxTokens = 1200;
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN (UNSICHTBARER MASSANZUG):
${userName ? `- Vorname / Rufname: ${userName}\n` : ''}- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

WICHTIGE LEITLINIEN:
- STRIKTE TEXTTREUE: Der Bibeltext (${passage}) ist der Chef. Wenn der Text warnt, richte die Warnung auf. Wenn er tröstet, tröste. Kein seichtes "Alles wird gut"-Schema.
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
${userName ? `- Vorname / Rufname: ${userName}\n` : ''}- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

STRIKTE LEITLINIEN:
1. STRIKTE TEXTTREUE & KLARE KANTE: Der Bibeltext (${passage}) bestimmt Inhalt und Tonart. Wenn der Text warnt, richte die Warnung auf. Wenn er tröstet, tröste. Kein seichter Wellness-Einheitsbrei!
2. ABSOLUTE VOLLSTÄNDIGKEIT: Fasse jeden einzelnen der 7 Posten prägnant in vollständigen, tiefgründigen Sätzen zusammen. Beende ausnahmslos jeden Satz mit einem Satzzeichen (. ! ?). Höre NIEMALS mitten im Wort oder Satz auf!
3. MASSANZUG DES BERUFS: Nutze die konkrete Arbeitswelt (${fullProfession}), deren echte Werkzeuge, Montage-Situationen oder typische Herausforderungen als lebensnahe Metaphern.
4. 100% BEZUG ZUM BIBELTEXT: Erkläre die Botschaft, Warnung und befreiende Wahrheit der Bibelstelle glasklar.
5. KEIN META-TALK: Erwähne niemals Phrasen wie "Weil du Handwerker bist..." oder "Aus der Perspektive deines Denkstils...". Webe die Realität unsichtbar ein.
6. AUTHENTISCH & KRAFTVOLL: Keine religiösen Phrasen, aber auch keine Verwässerung biblischer Klarheit.

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
