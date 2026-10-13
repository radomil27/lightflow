# 3. Gemini 3.8/3.7 Cloud-Kaskade & Zero-Error Offline-Heuristik

* Datum: 2026-10-13  
* Status: **Akzeptiert**  
* Entscheidungsträger: Rene (Security), Marco (Token-Controller), Der Macher  

---

## Kontext & Problemstellung
Auf Vercel Hobby/Free gilt ein hartes Ausführungslimit von **10 Sekunden** für Serverless Functions (`api/generate.ts`). Google Gemini kann bei hohem Traffic oder umfangreichen Exegesen über 10 Sekunden benötigen, was zu einem `FUNCTION_INVOCATION_TIMEOUT` (HTTP 504) führte. Zudem sind Modell-Endpunkte wie Gemini 3.8 / 3.7 noch nicht weltweit in allen Zonen synchron freigeschaltet.

## Betrachtete Optionen
1. **Harter Abbruch mit Fehlermeldung im Frontend:** Schlechte User Experience für den Endnutzer.
2. **Kaskadierte Serverless-Engine + Lokale Offline-Heuristik:**
   * Google Gemini Kaskade: 3.8 → 3.7 → 2.5 Flash → 2.0 Flash → Flash-Latest.
   * `maxOutputTokens` begrenzt auf 2.000–2.500 Tokens (Ausführungszeit: 3–4s).
   * Bei 6-Sekunden-Grenzzeit oder Netzwerkausfall: Geräuschloses Umschalten auf die lokale Heuristik-Engine in `src/services/lightflowEngine.ts`.

## Entscheidung
Wir implementieren die Kaskade und den Zero-Error Offline-Fallback. Der Endnutzer sieht unter keinen Umständen einen Fehlerbildschirm.

## Konsequenzen
### Positiv:
* 100% Ausfallsicherheit auch im Flugzeugmodus oder bei Google-API-Engpässen.
* Serverless-Kosten und Timeouts auf Vercel bleiben minimal.
