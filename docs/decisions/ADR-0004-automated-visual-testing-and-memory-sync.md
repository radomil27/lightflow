# 4. Playwright Visual/State-Testing & Autonomer Memory-Sync

* Datum: 2026-10-13  
* Status: **Akzeptiert**  
* Entscheidungsträger: Chef, Thomas (Lead), Rene (Security Gatekeeper)  

---

## Kontext & Problemstellung
Zwei verbleibende Risikofaktoren im schnellen Entwicklungsalltag:
1. **Visuelle & State-Regressionen:** Typ-Sicherheit garantiert keine fehlerfreien UI-Animationen, Modal-Schließlogiken oder reaktiven Zustandsketten.
2. **Session-Amnesie:** Nach Neustart der Entwicklungsumgebung müssen Agenten den Kontext wieder mühsam zusammensuchen.

## Betrachtete Optionen
1. **Manuelle Stichprobentests:** Zu langsam, menschliche Fehler unvermeidbar.
2. **Automatisierte Playwright-Suite („Nico“) + Bidirektionaler Memory-Sync:**
   * Wächter 1 (Nico): Headless E2E- und State-Tests nach jedem Build. Rene gibt erst bei grünem Playwright-Lauf sein Go für Commits.
   * Wächter 2 (Memory-Sync): Strukturierte ADRs in `docs/decisions/` und automatisierte Synchronisation in `scripts/sync-memory.js`.

## Entscheidung
Wir etablieren beide Wächter ab Version v1.4.0 fest im Team-Workflow.

## Konsequenzen
### Positiv:
* Vollautomatische Verifikation aller Kern-User-Flows in unter 5 Sekunden.
* Nie wieder Kontextverlust über IDE-Sessions hinweg.
