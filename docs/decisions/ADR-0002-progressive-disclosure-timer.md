# 2. Re-Render-resistente Timer mit useRef & 4s-Notanker

* Datum: 2026-10-13  
* Status: **Akzeptiert**  
* Entscheidungsträger: Der Macher, Livia, Rene  

---

## Kontext & Problemstellung
In React 19 führten unkontrollierte State-Updates im übergeordneten Container (`App.tsx`) dazu, dass Kind-Komponenten neu gerendert wurden. Bei Verwendung von naiven `setTimeout`-Arrays in `useEffect` wurden laufende Timer vorzeitig gecleart. Die Folge: Lade-Skelette in der 7-Posten-Enthüllung froren unvollständig ein, wodurch der Nutzer in einem permanenten Ladezustand feststeckte.

## Betrachtete Optionen
1. **Reine `useState`-Counter mit `setTimeout`:** Fehleranfällig bei schnellen Benutzerinteraktionen oder Hintergrund-Tabs (Browser-Throttling).
2. **`useRef`-gesichertes Tracking mit `setInterval` und 4s-Notanker:** Der Fortschritt wird in einer Ref (`activeReportIdRef`) unabhängig von Re-Renders getrackt. Nach maximal 4 Sekunden schaltet ein Notanker alle verbleibenden Posten bedingungslos frei. Klick auf ein beliebiges Skelett entriegelt sofort alles.

## Entscheidung
Wir verwenden die `useRef`-gesicherte Entriegelung (`activeReportIdRef`) kombiniert mit:
1. Sequenzieller 550ms-Freischaltung für Posten 2 bis 7.
2. 4-Sekunden-Notanker für 100% Freigabe-Garantie.
3. Sofortiger Notfall-Entriegelung bei direktem Klick auf ein beliebiges Lade-Skelett.

## Konsequenzen
### Positiv:
* 0% Risiko eingefrorener Ladebalken.
* Perfekte Abstimmung zwischen Livias Animationen und React 19 State-Zyklen.
* Nutzer mit Eile können den Ladevorgang mit 1 Klick sofort überspringen.
