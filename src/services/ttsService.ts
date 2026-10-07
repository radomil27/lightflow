/**
 * TTS Service (Cloud Text-to-Speech)
 * Unterstützt OpenAI TTS (tts-1) und Google Cloud Text-to-Speech via REST API
 * mit clientseitig hinterlegtem API-Key.
 */

export interface TtsOptions {
  provider: 'openai' | 'google';
  apiKey: string;
  text: string;
}

/**
 * Bereinigt Markdown-Symbole für flüssiges Vorlesen
 */
export function sanitizeSpeechText(text: string): string {
  return text
    .replace(/[*#_`~>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Generiert Audio via OpenAI Audio Speech API
 * Endpoint: POST https://api.openai.com/v1/audio/speech
 */
export async function fetchOpenAiTts(text: string, apiKey: string): Promise<string> {
  const clean = sanitizeSpeechText(text);
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: clean,
      voice: 'onyx', // Warme, getragene Stimme; alternativ alloy
      speed: 0.92,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS Fehler (${response.status}): ${errorText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Generiert Audio via Google Cloud Text-to-Speech REST API
 * Endpoint: POST https://texttospeech.googleapis.com/v1/text:synthesize?key=API_KEY
 */
export async function fetchGoogleTts(text: string, apiKey: string): Promise<string> {
  const clean = sanitizeSpeechText(text);
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey.trim()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: clean },
      voice: {
        languageCode: 'de-DE',
        name: 'de-DE-Neural2-B', // Warme, hochwertige deutsche Neural2-Stimme
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.90,
        pitch: -0.5,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google TTS Fehler (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error('Google TTS lieferte keinen Audioinhalt');
  }

  const binaryString = atob(data.audioContent);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes.buffer], { type: 'audio/mp3' });
  return URL.createObjectURL(blob);
}
