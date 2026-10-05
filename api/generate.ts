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
        prompt: 'Jesus spricht den Nutzer direkt, persönlich, warmherzig und auf Augenhöhe an. Keine Theologie, sondern ein erster Funke, der das Herz berührt und die Kernaussage der Bibelstelle in klaren, vollständigen und liebevollen Worten zusammenfasst.'
      },
      2: {
        title: '### 2. KLARBLICK',
        prompt: `Die Bibelstelle wird in ihrer vollen Erzählung und Tiefe glasklar aufgeschlüsselt, exakt abgestimmt auf den Denkstil des Nutzers (${profile.mindset}):\n- Was passiert in der Geschichte / in diesem Bibeltext konkret?\n- Wo liegt der menschliche Irrtum oder die Warnung des Textes?\n- Was ist die befreiende Kernaussage und die logische Wirkungsweise des Reiches Gottes?\nAlle Sätze müssen vollständig und zusammenhängend ausformuliert sein, sodass die Botschaft unmittelbar einleuchtet.`
      },
      3: {
        title: '### 3. TAGWERK',
        prompt: `Übertragung auf den Beruf und den Arbeitsalltag des Nutzers (${fullProfession}). Wie greift das Prinzip mitten bei der Arbeit, unter Zeitdruck oder im Umgang mit Kunden und Kollegen? Inklusive einer konkreten, praktischen Handlungsweise für den Werktag.`
      },
      4: {
        title: '### 4. FREIRAUM',
        prompt: 'Freizeit, Erholung und Feierabend. Was bedeutet diese Bibelstelle, wenn die Arbeit getan ist? Wie hilft sie dabei, mental komplett abzuschalten, inneren Druck abzubauen und ohne schlechtes Gewissen zur Ruhe zu kommen?'
      },
      5: {
        title: '### 5. STANDPUNKT',
        prompt: `Bezug zur persönlichen Lebenssituation und dem Zivilstand (${profile.relationshipStatus}). Wie wirkt sich diese Wahrheit auf das persönliche Leben, das Alleinsein oder das Zusammenleben und den Umgang mit Mitmenschen aus?`
      },
      6: {
        title: '### 6. SPIEGEL',
        prompt: 'Wie man dieses Prinzip im Miteinander, in Gemeinschaft oder Gemeinde lebt (z. B. Barmherzigkeit statt Verurteilung). Enthält 2 bis 3 direkte, tiefgehende Fragen in ganzen Sätzen, die der Nutzer im Stillen für sich selbst reflektieren kann.'
      },
      7: {
        title: '### 7. LEUCHTKRAFT',
        prompt: 'Der Garten im Herzen: Der geschützte Ort der Stille und Begegnung mit Gott, an dem man ohne Leistung ankommen und Gnade empfangen darf. Abgeschlossen mit einem ehrlichen, erdnahen Herzensgebet in vollständigen Sätzen, das alle vorherigen Punkte aufgreift.'
      }
    };

    let prompt = '';
    let maxTokens = 2600;

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

STRIKTE LEITLINIEN:
1. ABSOLUTE VOLLSTÄNDIGKEIT: Fasse jeden einzelnen der 7 Posten prägnant in 2 bis maximal 4 vollständigen, tiefgründigen Sätzen zusammen. Beende ausnahmslos jeden Satz mit einem Satzzeichen (. ! ?). Höre NIEMALS mitten im Wort oder Satz auf!
2. MASSANZUG DES BERUFS: Nutze die konkrete Arbeitswelt (${fullProfession}), deren echte Werkzeuge, Montage-Situationen oder typische Herausforderungen als lebensnahe Metaphern (z. B. bei Handwerk/Küchenbau: Passleisten, schiefe Wände, Werkbank, Wasserwaage; nicht Software/Laptop!).
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
