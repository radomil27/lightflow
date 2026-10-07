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
    const userGender = profile.gender === 'female' ? 'female' : 'male';
    const genderLabel = userGender === 'female' ? 'Frau' : 'Mann';

    const rawFaithStage = (profile.faithStage || profile.journeyStage || '').toLowerCase();
    const faithStageKey: 'seeker' | 'disciple' | 'exhausted' =
      rawFaithStage.includes('such') || rawFaithStage.includes('zweifel') || rawFaithStage === 'seeker'
        ? 'seeker'
        : rawFaithStage.includes('müde') || rawFaithStage.includes('ausgelaugt') || rawFaithStage.includes('ausgebrannt') || rawFaithStage === 'exhausted'
        ? 'exhausted'
        : 'disciple';

    const faithStageLabel =
      faithStageKey === 'seeker'
        ? 'Am Suchen & Zweifeln (Fundamentsuche, Skepsis)'
        : faithStageKey === 'exhausted'
        ? 'Müde & Ausgebrannt (Braucht Gnade & Entlastung)'
        : 'Mitten im Alltag & Nachfolge (Ringen Fleisch vs. Geist, Gehorsam)';

    const journey = faithStageLabel;
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
        prompt: `Jesus spricht den Nutzer direkt und persönlich an.${userName ? ` Er darf den Nutzer genau EINMAL zu Beginn mit seinem Vornamen (${userName}) ansprechen (z. B. 'Komm erst einmal an, ${userName}...').` : ''} Er fasst das Herzstück und die Hauptaussage dieses konkreten Verses (${passage}) zusammen. Keine allgemeine Seelsorge-Floskel, sondern das, was ER in diesem Text wirklich sagt – sei es ein befreiender Zuspruch, eine ernste Ermutigung oder ein Weckruf. Bei Klagepsalmen (z. B. Psalm 22) wird die Anfechtung ungeschminkt stehengelassen – kein seichtes Wegtrösten. Umfang: Genau 2 bis 3 vollständige Sätze.`
      },
      2: {
        title: '### 2. KLARBLICK',
        prompt: `Reine Schrifterklärung und theologische Tiefenschärfe, abgestimmt auf den Denkstil (${profile.mindset}) und die Glaubensphase (${faithStageKey}):\n1. Was ist die historische/theologische Kernbotschaft dieses Textes?\n2. Wie hat Gott es gedacht? Welche biblische Wahrheit oder göttliche Absicht liegt zugrunde?\n3. Wo liegt die konkrete Warnung, die Stolperfalle oder der menschliche Denkfehler, den der Text aufdeckt?\nGlasklare, theologische und logische Erklärung in 3 bis 4 vollständigen Sätzen – ohne jedes psychologische Coaching-Sprech.`
      },
      3: {
        title: '### 3. TAGWERK',
        prompt: `Konkreter Gehorsam und praktische Nachfolge im Berufsfeld (${fullProfession}) – kein allgemeiner Karriere-Tipp:\n1. Einprägsames Merk-Bild / Werkzeug: Verknüpfe die Wahrheit des Verses mit einem typischen Werkzeug, Handgriff oder einer konkreten Situation aus dieser Branche, sodass der Nutzer tagsüber sofort an den Vers erinnert wird.\n2. Konkretes Alltagsszenario & Entscheidung (Fleisch vs. Geist): Wie würde man im alten Fleisch reagieren (Ärger, Druck, Rechthaberei, Ausbrennen) – und wie handelt man als Nachfolger Jesu im Geist?\n3. Das theologische WARUM (Gehorsam & Gottes Reich): Erkläre glasklar die theologische Begründung (Nicht zur Selbstoptimierung, sondern aus Ehrfurcht und Liebe zu Christus – welcher Mechanismus des Reiches Gottes steckt dahinter?).\nUmfang: Genau 3 bis 4 vollständige, kraftvolle Sätze. Funktioniert zu jeder Tageszeit.`
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
        prompt: `Ein kurzer Satz zur ehrlichen Selbstprüfung des Herzens vor Gottes heiligem Wort, gefolgt von exakt 2 nummerierten, scharfen Fragen:\n1. Eine Frage zur Abweichung / Warnung: Wo weiche ich im Alltag von Gottes Maßstab oder Gedanken in diesem Vers ab?\n2. Eine Frage zum konkreten Gehorsam / Nachfolge: Welchen praktischen Glaubensschritt oder Gehorsamsschritt verlangt dieses Wort heute unverzüglich von mir?`
      },
      7: {
        title: '### 7. LEUCHTKRAFT',
        prompt: `Ein kurzer Einleitungssatz der Stille, gefolgt von einer Leerzeile und einem bodenständigen Herzensgebet (4 bis 5 Sätze), das eine direkte Antwort auf DIESEN Bibeltext ist:\n- Antwortet Gott entsprechend der Textdimension (Anbetung bei Lobpreis, Flehen und Aushalten bei Klage, Bitte um Gehorsamskraft bei Geboten).\n- Dank für die konkrete Wahrheit des Verses.\n- Bitte um Wachsamkeit gegenüber der aufgedeckten Warnung.\n- Bitte um Kraft für die Umsetzung im Alltag.\nAbschluss mit 'Amen.'.`
      }
    };

    let prompt = '';
    let maxTokens = 2600;

    const synthesisInstruction = `GANZHEITLICHE PERSÖNLICHKEITS-SYNTHESE (VOR DER GENERIERUNG DURCHFÜHREN):
1. STRIKTE TEXTTREUE & KLARE KANTE (ABSOLUTE PRIORITÄT):
   - Der eingegebene Bibeltext (${passage}) bestimmt das Thema, die Schärfe und die Tonalität.
   - KEIN generischer Wellness-Einheitsbrei: Wenn der Text warnt (z. B. vor Heuchelei, Habgier, Trägheit, falscher Sicherheit), decke die Warnung schonungslos und klar auf. Wenn der Text tröstet, tröste. Wenn der Text zur Umkehr oder Tat ruft, formuliere einen klaren Handlungsauftrag.
   - Beziehe jede Aussage, jedes Bild und jedes Gebet direkt auf den Inhalt, die Personen und die Ereignisse dieser konkreten Bibelstelle.
2. VERBOT VON LEBENSRATGEBER-FLOSKELN:
   - Formuliere KEINE psychologischen Coaching-Tipps, Achtsamkeits-Ratschläge oder säkularen Motivationssprüche (z. B. kein 'atme tief durch', kein 'achte auf deine Selbstfürsorge', kein 'gönn dir Pausen um Kraft zu schöpfen', kein Wellness-Vokabular).
   - Lightflow ist kein Lebenshilfe-Blog, sondern ein geistliches Werkzeug: Du bist Schriftausleger und geistlicher Wegweiser, der das Wort Gottes unverfälscht erklärt.
   - Jede praktische Anwendung MUSS zwingend und logisch aus der biblischen Aussage des Verses abgeleitet sein (Indikativ führt zum Imperativ: Weil Gott so ist / weil Christus das getan hat, handeln wir so).
3. GESCHLECHTSSPEZIFISCHE FÜHRUNG (${genderLabel.toUpperCase()}):
   ${userGender === 'male' ? `- Der Nutzer ist ein MANN:
     - Fokus auf Selbstbeherrschung statt Wut, Trotz oder verletztem Ego.
     - Wahre Männlichkeit als königliche Stärke durch Demut, Dienen und Treue zu Gottes Wort.
     - Verantwortung tragen, Fels in der Brandung sein, kein Jammern und keine Opfer-Haltung.` : `- Die Nutzerin ist eine FRAU:
     - Fokus auf innere Ruhe und Vertrauen statt Grübeln, Kontrollzwang oder Getriebenheit.
     - Echte Würde in Christus statt Anpassung an Erwartungen anderer Menschen.
     - Klare Grenzen in Liebe setzen, emotionale Lasten an Gott abgeben, geborgene Stärke.`}
4. PHASEN-STEUERUNG DER GLAUBENSPHASE (${faithStageKey.toUpperCase()}):
   ${faithStageKey === 'seeker' ? `- Phase SEEKER (Am Suchen & Zweifeln): Kein theologischer Insider-Jargon. Fokus auf logische Erklärung, biblische Fakten und den Beweis im echten Leben.` : faithStageKey === 'exhausted' ? `- Phase EXHAUSTED (Müde & Ausgebrannt): Fokus auf Gnade, das vollbrachte Werk Christi am Kreuz und Ablegen fremder Lasten. Baue KEINE moralischen Forderungen oder Druck auf; schenke geistlichen Sauerstoff.` : `- Phase DISCIPLE (Mitten im Alltag & Nachfolge): Konkrete Szenarien mit Vorher-Nachher-Kontrast (Altes Fleisch vs. Neuer Geist), klare wörtliche Rede und greifbare Gehorsamsschritte.`}
5. PERSÖNLICHE ANREDE & NAMENS-DOSIERUNG:
   ${userName ? `- Der Nutzer heißt ${userName}. Jesus darf den Nutzer in Posten 1 (LICHTFUNKE) genau EINMAL zu Beginn persönlich beim Vornamen ansprechen (z. B. 'Komm erst einmal an, ${userName}...').
   - In den übrigen Posten (2 bis 6) wird der Name NICHT künstlich wiederholt (keine ständige Nennung wie ein Verkäufer).
   - In Posten 7 (Gebet) spricht der Nutzer zu Gott – dort wird der eigene Name ebenfalls NICHT genannt.` : '- Es ist kein Vorname hinterlegt. Sprich den Nutzer direkt mit „du“ / „dir“ an, ohne künstliche Anrede.'}
6. SPRACHE & ARGUMENTATION: Der Denkstil (${profile.mindset}) bestimmt, WIE du sprichst.
   - Pragmatisch/Lösungsorientiert/Analytisch: Direkte Kausalität, schnörkellose Sätze, praktische Logik statt verschachtelter Poesie.
   - Bildhaft/Emotional/Beziehungsorientiert: Warme Vergleiche, emotionale Resonanz und Raum zum Fühlen.
7. BEZIEHUNGSRAUM: Der Lebensstand (${profile.relationshipStatus}) bestimmt den lebenspraktischen Rahmen.
   - Familie/Kinder: Wenig Zeit für sich, Trubel, Verantwortung, Erwartungsdruck von außen.
   - Single/Alleinlebend: Die Stille der eigenen vier Wände am Abend, Autonomie, das Verarbeiten des Tages ohne Gegenüber.
8. METAPHERN-INTELLIGENZ & POSTEN 3 REGEL:
   - Nutze das Berufsfeld (${fullProfession}) als intuitive Metaphernquelle. Verwende die spezifischen Fachbegriffe, Werkzeuge, Handgriffe und typischen Reibungspunkte dieser Branche organisch im Text (ohne Belehrung).
   - Baue in Posten 3 zwingend ein handfestes Merk-Bild / Werkzeug ein und stelle das konkrete Alltagsszenario dar (Reaktion im Fleisch vs. Handeln im Geist mit theologischem Warum).
9. MULTIDIMENSIONALE TEXT-ANALYSE & BIBLISCHE KAUSALKETTE:
   BIBLISCHE TEXT-DIMENSIONEN:
   Analysiere die gegebene Bibelstelle (${passage}) vorab auf ihre enthaltenen Wirkkräfte. Identifiziere primäre und sekundäre Dimensionen aus dem 7-teiligen Spektrum der Schrift:
   1. Zuspruch & Verheißung (Gottes Treue, Gnade, Zusage)
   2. Warnung & Gericht (Aufdeckung von Heuchelei, Stolperfallen, Selbstbetrug)
   3. Gebot & Unterweisung (Verbindlicher Handlungsauftrag, Jüngerschaft)
   4. Lehre & Offenbarung (Theologisches Fundament: Wer Gott ist, was Christus getan hat)
   5. Bußruf & Umkehr (Dringliche Kurskorrektur, Verlassen des falschen Weges)
   6. Klage & Ehrlichkeit (Schmerz, Anfechtung und Ringen vor Gottes Angesicht ungeschminkt aushalten – kein seichtes Wegtrösten)
   7. Lob, Dank & Anbetung (Staunen über Gottes Größe und Werke)

   AUFLÖSUNG BEI MEHRFACH-TREFFERN (KAUSALKETTE):
   Wenn mehrere Dimensionen zutreffen (z. B. Lehre + Warnung + Gebot wie in Römer 12):
   - Vermische diese Töne nicht zu einem Brei. Halte die biblische Kausalkette strikt ein:
     1. LEHRE / ZUSPRUCH liefert das theologische Fundament und das geistliche 'Warum'.
     2. WARNUNG deckt den menschlichen Denkfehler und die Stolperfalle auf.
     3. GEBOT / BUßRUF formuliert den konkreten Gehorsamsschritt für den Tag.
   - Verteile die Wirkkräfte präzise auf die Posten:
     - Posten 1 (LICHTFUNKE): Greift die primäre Wirkkraft auf. Bei Klage (z. B. Psalm 22) wird Schmerz/Anfechtung ehrlich ausgehalten; bei Zuspruch tröstet Christus; bei Warnung ruft Er wach.
     - Posten 2 (KLARBLICK): Entfaltet die Lehre/Offenbarung und deckt die spezifische Warnung/Gefahr auf.
     - Posten 3 (TAGWERK): Setzt das Gebot/die Unterweisung direkt in das Berufsfeld (${fullProfession}) um – inklusive Merk-Bild und dem geistlichen 'Warum' aus der Lehre.
     - Posten 6 (SPIEGEL): Konfrontiert das Gewissen schonungslos mit der Warnung oder dem Umkehrruf.
     - Posten 7 (LEUCHTKRAFT): Antwortet Gott entsprechend der Textkraft (Anbetung bei Lobpreis, Flehen bei Klage, Bitte um Gehorsamskraft bei Geboten).`;

    if (selectedPosten) {
      maxTokens = 1200;
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN (UNSICHTBARER MASSANZUG):
${userName ? `- Vorname / Rufname: ${userName}\n` : ''}- Geschlecht: ${genderLabel}
- Glaubensphase: ${faithStageLabel}
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

WICHTIGE LEITLINIEN:
- STRIKTE TEXTTREUE & AUSLEGUNG: Der Bibeltext (${passage}) ist der Chef. Wenn der Text warnt, richte die Warnung auf. Wenn er tröstet, tröste. Bei Klage halte den Schmerz ehrlich aus. Kein seichtes "Alles wird gut"-Schema.
- MULTIDIMENSIONALE KAUSALKETTE: Halte die Dimensionen (Lehre, Warnung, Gebot, Klage) sauber getrennt. Lehre liefert das theologische Fundament/Warum, Warnung deckt die Stolperfalle auf, Gebot fordert den Gehorsam.
- VERBOT VON LEBENSRATGEBER-FLOSKELN: Kein psychologisches Coaching, keine Achtsamkeits-Ratschläge, kein Wellness-Vokabular. Reines Auslegen von Gottes Wort und praktischer Glaubensgehorsam (Indikativ führt zum Imperativ).
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
${userName ? `- Vorname / Rufname: ${userName}\n` : ''}- Geschlecht: ${genderLabel}
- Glaubensphase: ${faithStageLabel}
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Heutige Tagesverfassung: ${currentMood}

${synthesisInstruction}

STRIKTE LEITLINIEN:
1. STRIKTE TEXTTREUE & KLARE KANTE: Der Bibeltext (${passage}) bestimmt Inhalt und Tonart. Wenn der Text warnt, richte die Warnung auf. Wenn er tröstet, tröste. Bei Klage halte den Schmerz ungeschminkt aus. Kein seichter Wellness-Einheitsbrei!
2. MULTIDIMENSIONALE KAUSALKETTE: Vermische die biblischen Dimensionen nicht. Lehre liefert das Fundament und das geistliche Warum, Warnung deckt den Irrtum auf, Gebot formuliert den konkreten Gehorsam.
3. VERBOT VON LEBENSRATGEBER-FLOSKELN: Kein psychologisches Coaching, keine Achtsamkeits-Ratschläge, kein Wellness-Vokabular. Reines Auslegen von Gottes Wort und praktischer Glaubensgehorsam (Indikativ führt zum Imperativ).
4. ABSOLUTE VOLLSTÄNDIGKEIT: Fasse jeden einzelnen der 7 Posten prägnant in vollständigen, tiefgründigen Sätzen zusammen. Beende ausnahmslos jeden Satz mit einem Satzzeichen (. ! ?). Höre NIEMALS mitten im Wort oder Satz auf!
5. MASSANZUG DES BERUFS: Nutze die konkrete Arbeitswelt (${fullProfession}), deren echte Werkzeuge, Montage-Situationen oder typische Herausforderungen als lebensnahe Metaphern.
6. 100% BEZUG ZUM BIBELTEXT: Erkläre die Botschaft, Warnung und befreiende Wahrheit der Bibelstelle glasklar.
7. KEIN META-TALK: Erwähne niemals Phrasen wie "Weil du Handwerker bist..." oder "Aus der Perspektive deines Denkstils...". Webe die Realität unsichtbar ein.
8. AUTHENTISCH & KRAFTVOLL: Keine religiösen Phrasen, aber auch keine Verwässerung biblischer Klarheit.

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
