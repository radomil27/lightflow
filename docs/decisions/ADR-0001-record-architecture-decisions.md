# 1. Einführung von Architecture Decision Records (ADR)

* Datum: 2026-10-13  
* Status: **Akzeptiert**  
* Entscheidungsträger: Chef, Thomas (Lead Developer), Das Antigravity-Team  

---

## Kontext & Problemstellung
Beim Beenden und Neustarten von Entwicklungs-Sessions in der Antigravity IDE ging der tiefere Kontext von Design-, Refactoring- und Architektur-Entscheidungen oft verloren. Agenten wie Livia (UI/UX) oder Der Macher (Fullstack) mussten den Code jedes Mal neu analysieren, um das *Warum* hinter bestimmten Implementierungen (z. B. `useRef` statt `useState`, Tailwind v4 CSS-Variables, Offline-Kaskaden) zu verstehen.

## Betrachtete Optionen
1. **Flüchtige Chat-Historie:** Entscheidungen bleiben nur in vorherigen Prompts und Logs.
2. **Großes monolithisches README:** Alle Notizen in ein einziges, unübersichtliches File schreiben.
3. **Strukturierte Architecture Decision Records (ADR nach Michael Nygard):** Kompakte, unveränderliche, nummerierte Markdown-Dokumente in `docs/decisions/`.

## Entscheidung
Wir etablieren ab Version v1.4.0 ein formales ADR-System im Verzeichnis [`docs/decisions/`](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/). Jede wesentliche technische Weichenstellung wird als nummeriertes Markdown-Dokument mit Kontext, Optionen, Entscheidung und Konsequenzen dokumentiert.

## Konsequenzen
### Positiv:
* 100% Kontext für alle Agenten zu Beginn jeder neuen Session.
* Nie wieder versehentliches Zurückbauen von bewussten Architektur-Entscheidungen bei Refactorings.
* Schnelles Onboarding neuer Modelle oder Team-Rollen.

### Zu beachten:
* Jeder Coding-Block muss durch den Memory-Sync-Wächter oder Thomas mit einem kurzen ADR-Update abgeschlossen werden.
