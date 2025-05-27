##  **Perché testare un'app React**

### 1. **Affidabilità del codice**

* I test automatizzati permettono di rilevare bug prima che raggiungano la produzione.
* Garantiscono che i componenti funzionino come previsto, anche dopo refactoring o nuove funzionalità.

### 2. **Documentazione vivente**

* I test ben scritti fungono da documentazione esecutiva: chi legge capisce cosa dovrebbe fare un componente, quali sono i suoi input e output attesi.

### 3. **Manutenzione e refactoring sicuro**

* In un'app in crescita, modificare codice senza test equivale a camminare nel buio.
* Con una suite di test, si può refattorizzare il codice con fiducia, sapendo che eventuali regressioni verranno intercettate.

### 4. **Velocità nello sviluppo**

* I test automatizzati sostituiscono il testing manuale ripetitivo.
* Si guadagna tempo nel lungo termine e si evita il rischio di errori umani nei controlli.

### 5. **Qualità del prodotto e fiducia nel deploy**

* Con test ben strutturati, ogni rilascio è più affidabile.
* La CI/CD può essere automatizzata per eseguire test prima del deploy, riducendo drasticamente il rischio di bug in produzione.

---

##  **Tipologie di test (con focus React)**

| Tipo di test         | Cosa verifica                             | Dove si applica in React                | Strumenti                   |
| -------------------- | ----------------------------------------- | --------------------------------------- | --------------------------- |
| **Unit test**        | Una singola funzione o componente isolato | Componenti, hooks, funzioni di utilità  | Jest, React Testing Library |
| **Integration test** | L'interazione tra componenti e moduli     | Componenti che usano store, router, API | RTL, Mock Service Worker    |
| **End-to-End (E2E)** | L’intera app come vista dall’utente       | Interazione completa via browser        | Cypress, Playwright         |

---

###  **1. Unit Test**

* Obiettivo: testare in isolamento una parte dell'app (es. un componente con stato interno).
* In React: testare il rendering di un componente, i comportamenti su eventi, lo stato e le props.

**Esempio:**
Verificare che il bottone "Aggiungi" aumenti il contatore:

```tsx
it('incrementa il contatore al click', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('Aggiungi'));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

###  **2. Integration Test**

* Obiettivo: testare l’interazione tra più unità (componenti, API, router, Redux).
* In React: componenti che dipendono da Redux, Router, Context API o fetch di dati.

**Esempio:**
Verificare che una lista venga caricata da un’API mockata e mostrata correttamente.

---

###  **3. End-to-End Test (E2E)**

* Obiettivo: testare l’intera applicazione come farebbe un utente reale.
* In React: cliccare pulsanti, navigare tra pagine, simulare login, ecc.

**Esempio:**
Con Cypress: aprire la home, cliccare su un link e verificare che la nuova pagina venga caricata.

---

##  Confronto con Angular

| Aspetto            | Angular                | React                                  |
| ------------------ | ---------------------- | -------------------------------------- |
| Test runner        | Karma, Jasmine         | Jest                                   |
| Accesso al DOM     | `fixture.debugElement` | `screen.getBy*`                        |
| Mocking dipendenze | TestBed + DI           | Manual mocking, jest.fn(), MSW         |
| Filosofia di test  | Strutturata e formale  | User-centric con React Testing Library |

---




















---

## Setup ambiente di testing con **Vite + Vitest + React Testing Library**

### Obiettivo

Configurare un ambiente di testing moderno e performante per componenti React, completo di:

* test unitari e comportamentali
* supporto a `jsdom` per simulare il DOM in ambiente Node
* matchers estesi con `@testing-library/jest-dom`
* simulazione di eventi utente con `@testing-library/user-event`

---

### 1. Creazione del progetto con Vite

https://medium.com/@vitor.vicen.te/setting-up-jest-js-for-a-vite-ts-js-react-project-the-ultimate-guide-7816f4c8b738

---

### 6. Scrittura di un test: esempio base

```tsx
// src/components/Hello.test.tsx
import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('mostra il messaggio di benvenuto', () => {
  render(<Hello name="Michael" />);
  expect(screen.getByText('Ciao, Michael')).toBeInTheDocument();
});
```

Componente `Hello.tsx`:

```tsx
type HelloProps = { name: string };

export default function Hello({ name }: HelloProps) {
  return <h1>Ciao, {name}</h1>;
}
```

---

### 7. Esecuzione dei test

Per eseguire l’intera suite:

```bash
npm run test
```

Per modalità continua (watch mode):

```bash
npm run test:watch
```

---

## Approfondimenti utili

### Differenze principali tra Vitest e Jest

| Caratteristica         | Vitest                            | Jest                              |
| ---------------------- | --------------------------------- | --------------------------------- |
| Performance            | Molto elevata (grazie a Vite/ESM) | Buona ma più lenta nei reload     |
| Configurazione         | Aperta e flessibile               | Più integrata ma meno trasparente |
| Watch mode             | Interattivo e rapido              | Completo ma più pesante           |
| Copertura (`coverage`) | Supportata                        | Nativamente supportata            |

---

### Consigli pratici

* Utilizzare `screen.getByText`, `getByRole`, `getByLabelText` per selezioni accessibili e future-proof.
* Usare `userEvent` invece di `fireEvent` per simulazioni più realistiche (es. typing, click).
* Evitare l’uso diretto di `container` o accessi DOM non controllati.
* Centralizzare i mock complessi in cartelle come `__mocks__` o usare `vi.mock()` localmente.

---


























### Introduzione a **Jest**: Caratteristiche principali

**Jest** è un test runner sviluppato da Meta (Facebook) ed è uno degli strumenti più usati per testare applicazioni JavaScript e React. Si tratta di una soluzione **all-in-one**, che include tutto il necessario per scrivere, eseguire e gestire test unitari e di integrazione.

---

## 1. **Test runner completo**

Jest fornisce un ambiente integrato per:

* esecuzione dei test
* gestione degli assert (`expect`)
* mocking automatico di moduli e funzioni
* generazione dei report di copertura

A differenza di altri strumenti (es. Mocha + Chai + Sinon), Jest non richiede componenti aggiuntivi: è un sistema **zero-config** nella maggior parte dei casi.

---

## 2. **Compatibilità con React e React Testing Library**

Jest è il test runner **predefinito** nei progetti creati con **Create React App**. Si integra perfettamente con:

* **React Testing Library**, per test comportamentali
* **Enzyme** (meno usato oggi)
* **babel**, **TypeScript** e **ESM**

---

## 3. **Funzioni principali**

### a. **Funzioni di test**

```ts
describe('Gruppo di test', () => {
  test('comportamento atteso', () => {
    expect(1 + 2).toBe(3);
  });
});
```

* `describe` definisce un blocco logico di test
* `test` o `it` rappresenta un singolo test case
* `expect` contiene le asserzioni da validare

---

### b. **Matchers potenti ed estendibili**

Jest offre una vasta gamma di matchers:

* `.toBe()` per uguaglianza primitiva
* `.toEqual()` per oggetti e array
* `.toBeTruthy()`, `.toBeNull()`, `.toBeDefined()`
* `.toContain()`, `.toHaveLength()`, `.toMatchObject()`
* `.toThrow()` per eccezioni

Può essere esteso con librerie come:

* `@testing-library/jest-dom`
* `jest-extended`

---

### c. **Mocking automatico e controllato**

Jest consente di simulare:

* funzioni: `jest.fn()`
* moduli interi: `jest.mock()`
* timer, date e fetch

Esempio:

```ts
const mockFn = jest.fn();
mockFn('ciao');
expect(mockFn).toHaveBeenCalledWith('ciao');
```

---

### d. **Supporto asincrono**

Jest gestisce promesse, async/await e callback:

```ts
test('richiesta async', async () => {
  const result = await fetchData();
  expect(result).toBe('ok');
});
```

---

### e. **Test isolati e controllati**

* **beforeEach**, **afterEach**: setup e teardown per ogni test
* **beforeAll**, **afterAll**: setup globale

```ts
beforeEach(() => {
  initializeTestDB();
});
```

---

### f. **Copertura del codice (`--coverage`)**

Jest genera report dettagliati sul codice coperto dai test:

```bash
npm test -- --coverage
```

Visualizza:

* percentuale di righe coperte
* funzioni/test mancate
* file senza test

---

## 4. **Supporto per TypeScript, Babel, ESM**

Jest supporta:

* **Babel** per usare JSX o sintassi ESNext
* **TypeScript** tramite `ts-jest`
* moduli **ESM** con configurazione dedicata (`"type": "module"`)

---

## 5. **Snapshot testing**

Permette di salvare lo stato "renderizzato" di un componente in un file `.snap`:

```ts
import { render } from '@testing-library/react';

test('match snapshot', () => {
  const { asFragment } = render(<MyComponent />);
  expect(asFragment()).toMatchSnapshot();
});
```

Utili per UI semplici, ma da usare con cautela per evitare falsi positivi durante i refactoring.

---

## 6. **Integrazione CI/CD**

Jest è pensato per integrarsi facilmente con:

* GitHub Actions
* GitLab CI
* CircleCI, Jenkins, etc.

Consente:

* esecuzione test su ogni commit/push
* blocco delle PR se falliscono i test
* report di copertura nei badge del repository

---

## Conclusione

| Vantaggio                       | Descrizione                                     |
| ------------------------------- | ----------------------------------------------- |
| Tutto incluso                   | Test runner, asserzioni, mocking, coverage      |
| Velocità e caching              | Esecuzione rapida grazie a intelligent caching  |
| Integrazione perfetta con React | Compatibilità diretta con React Testing Library |
| Estendibilità                   | Supporto a plugin e matchers personalizzati     |
| Ampio supporto della community  | Documentazione chiara e librerie collaudate     |

---























                

---

## Struttura di base di un test con Jest

### 1. **`describe()`**

* Definisce un **blocco logico di test** che raggruppa più test correlati.
* Utile per strutturare i test per modulo, componente, o comportamento.

### 2. **`test()` / `it()`**

* Definisce un **singolo test case**.
* `test()` e `it()` sono sinonimi; entrambi accettano:

  * una descrizione del caso di test
  * una funzione che implementa il test

### 3. **`expect()`**

* Funzione di asserzione: verifica che un valore abbia un determinato comportamento o proprietà.
* Può essere estesa con vari *matcher*, ad esempio `toBe`, `toEqual`, `toBeTruthy`, `toContain`, `toHaveLength`.

---

## Esempio base: testare una funzione pura

Supponiamo di avere la seguente funzione:

```ts
// src/utils/math.ts
export function sum(a: number, b: number): number {
  return a + b;
}
```

### Test: `math.test.ts`

```ts
// src/utils/math.test.ts
import { sum } from './math';

describe('Funzione sum', () => {
  test('dovrebbe restituire la somma di due numeri positivi', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('dovrebbe restituire un numero negativo se la somma è negativa', () => {
    expect(sum(-4, -6)).toBe(-10);
  });
});
```

---

### Spiegazione dettagliata

```ts
describe('Funzione sum', () => {
```

* Organizza tutti i test relativi alla funzione `sum` in un blocco leggibile.

```ts
  test('dovrebbe restituire la somma di due numeri positivi', () => {
```

* Specifica il **comportamento atteso**. È una buona pratica scrivere descrizioni chiare e comportamentali.

```ts
    expect(sum(2, 3)).toBe(5);
```

* **`expect()`** riceve il risultato da verificare.
* **`.toBe(5)`** è il matcher che verifica l’uguaglianza stretta (===) con il valore atteso.

---

## Esempio con componente React

Supponiamo di avere un semplice componente:

```tsx
// src/components/Greeting.tsx
type GreetingProps = { name: string };
export default function Greeting({ name }: GreetingProps) {
  return <h1>Ciao, {name}</h1>;
}
```

### Test: `Greeting.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('mostra il nome passato come prop', () => {
    render(<Greeting name="Luca" />);
    expect(screen.getByText('Ciao, Luca')).toBeInTheDocument();
  });
});
```

**Note:**

* `render()` è fornito da **React Testing Library**.
* `screen.getByText()` è un selettore "user-centric".
* `.toBeInTheDocument()` viene da `@testing-library/jest-dom`.

---

## Best practice

| Buona pratica                          | Esempio                                           |
| -------------------------------------- | ------------------------------------------------- |
| Scrivere descrizioni chiare            | `it('mostra il titolo corretto')`                 |
| Usare `describe` per raggruppare test  | Un `describe` per ogni modulo o comportamento     |
| Isolare i test                         | Ogni `test` deve essere indipendente              |
| Usare `expect` con matchers espressivi | `toHaveTextContent`, `toContain`, `toThrow`, ecc. |

---
































---

## **Cos’è il coverage nei test**

La **copertura del codice** (code coverage) è una metrica che indica **quale percentuale del codice sorgente viene eseguita** durante l’esecuzione dei test automatizzati.

Misurare il coverage:

* Aiuta a identificare parti del codice **non testate**
* Non garantisce l'assenza di bug, ma migliora la **confidenza nel codice**
* È spesso **richiesto in ambienti enterprise e CI/CD**

---

## **Come attivare il coverage in Jest**

### Comando base:

```bash
npx jest --coverage
```

Oppure con npm/yarn:

```bash
npm test -- --coverage
```

Questo genera:

* Un **report in console**
* Una **cartella `coverage/`** con report HTML, JSON e lcov

---

## **Metriche generate da Jest**

Quando esegui `--coverage`, Jest fornisce le seguenti metriche per ogni file:

| Metrica    | Descrizione                                                    |
| ---------- | -------------------------------------------------------------- |
| `% Stmts`  | Percentuale di **statements** eseguiti (tutte le istruzioni)   |
| `% Branch` | Percentuale di **ramificazioni** eseguite (es. `if`, `switch`) |
| `% Funcs`  | Percentuale di **funzioni e metodi** invocati durante i test   |
| `% Lines`  | Percentuale di **linee di codice effettivamente eseguite**     |

### Esempio di output console:

```
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
--------------------------|---------|----------|---------|---------|----------------
All files                 |   90.91 |    75.00 |   85.71 |   90.91 |
 src/components/Button.tsx|  100.00 |    80.00 |   100.0 |   100.0 | 12
 src/utils/helpers.ts     |    83.3 |    66.7  |    75.0 |   83.33 | 7, 10-12
```

---

## **Analisi grafica: Report HTML**

Dopo aver lanciato:

```bash
npm test -- --coverage
```

Viene creata la directory:

```
coverage/lcov-report/index.html
```

Aprendo questo file in un browser, ottieni:

* Vista dettagliata della copertura per ogni file
* Evidenziazione delle **righe non coperte**
* Indicatori di warning o errori sotto soglie predefinite

---

## **Configurazione avanzata**

### 1. **Includere solo determinati file**

Puoi specificare quali file includere nella copertura:

```json
// package.json
"jest": {
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx"
  ]
}
```

### 2. **Impostare soglie minime (coverage threshold)**

Puoi forzare Jest a fallire se la copertura scende sotto certi valori:

```json
"jest": {
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 85,
      "lines": 90,
      "statements": 90
    }
  }
}
```

Questo è utile in CI/CD per garantire una qualità minima dei test.

---

##  **Best practice per il coverage**

| Buona pratica                                      | Spiegazione                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| Non puntare al 100%                                | Un coverage completo non garantisce assenza di bug                           |
| Usa il coverage per **identificare punti critici** | Focus su logiche di business, condizioni complesse, rami alternativi         |
| Combina coverage con test end-to-end               | Alcune parti del codice potrebbero essere coperte solo da test E2E           |
| Aggiungi commenti alle righe `istanbul ignore`     | Quando ignori una riga, documenta il motivo con `/* istanbul ignore next */` |

---

## Esempio CI/CD (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test e Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm test -- --coverage

      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/lcov-report
```

---

## Conclusione

**La copertura del codice è uno strumento fondamentale per monitorare e migliorare la qualità dei test**, ma non deve essere l’unico indicatore. Il focus deve rimanere sulla **validazione dei comportamenti critici**, **gestione degli edge case**, e **robustezza complessiva della suite**.

---




























### `--watch` in Jest

L'opzione `--watch` di Jest attiva la **modalità di esecuzione continua** dei test. Si tratta di uno strumento molto utile durante lo sviluppo, in quanto consente di **rieseguire automaticamente i test correlati ai file modificati**. Questo permette un ciclo di sviluppo rapido, evitando di dover rilanciare manualmente tutti i test ogni volta.

---

## Caratteristiche principali della modalità `--watch`

### 1. **Test incrementale**

Jest tiene traccia dei file modificati nel sistema di versionamento (es. Git) e riesegue:

* Solo i test legati ai file modificati
* I test falliti nell’ultima esecuzione

Questo rende la fase di test molto veloce ed efficiente.

### 2. **Interfaccia interattiva**

Quando si lancia `jest --watch`, Jest mostra un menu interattivo nel terminale:

```
Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

### 3. **Uso tipico**

Durante lo sviluppo locale si esegue:

```bash
jest --watch
```

Oppure, se si usa `npm`:

```bash
npm test -- --watch
```

### 4. **Comandi disponibili in watch mode**

| Comando | Significato                                                         |
| ------- | ------------------------------------------------------------------- |
| `a`     | Esegue **tutti** i test, ignorando le modifiche                     |
| `f`     | Esegue **solo i test falliti** nella precedente esecuzione          |
| `p`     | Filtra per **nome del file** (Regex)                                |
| `t`     | Filtra per **nome del test** (Regex sul testo in `it()` o `test()`) |
| `q`     | Esce dalla modalità watch                                           |
| `Enter` | Esegue i test relativi ai file modificati (default)                 |

---

## Differenza tra `--watch` e `--watchAll`

| Opzione      | Descrizione                                                |
| ------------ | ---------------------------------------------------------- |
| `--watch`    | Esegue solo i test **associati a file modificati**         |
| `--watchAll` | Esegue **tutti i test**, indipendentemente dalle modifiche |

`--watch` è preferibile in sviluppo quotidiano, mentre `--watchAll` è utile per testare tutto dopo un refactoring o in ambienti non Git-based.

---

## Configurazione predefinita

In progetti creati con **Create React App**, la modalità `--watch` è attivata di default quando si esegue:

```bash
npm test
```

In ambienti con `Vite + Vitest`, il comportamento può essere simulato con:

```bash
vitest --watch
```

Anche se l'interfaccia differisce leggermente, il concetto di test automatico sui file modificati rimane analogo.

---

## Vantaggi pratici

* Riduce il tempo di esecuzione dei test durante lo sviluppo
* Facilita il TDD (Test Driven Development)
* Permette di identificare rapidamente regressioni e bug
* Rende più fluido il ciclo modifica-test-valida

---

## Conclusione

La modalità `--watch` è uno strumento fondamentale per lo sviluppo React moderno. È pensata per massimizzare la produttività, fornendo feedback immediato dopo ogni modifica. In team di sviluppo esperti, come nel caso di sviluppatori provenienti da Angular, l’uso corretto della modalità watch consente un workflow continuo e altamente efficiente.




































### `--verbose` in Jest

L’opzione `--verbose` serve per **visualizzare in modo dettagliato l’esecuzione dei test**, mostrando nella console **ogni singolo test case**, con il relativo stato (superato, fallito, ignorato). È particolarmente utile per il debugging, il monitoraggio dei test in CI/CD o per comprendere con precisione cosa viene eseguito.

---

## Cosa fa `--verbose`

* Mostra **ogni chiamata a `test()` o `it()`**, indicando il **nome del test**, il **tempo di esecuzione**, e l’esito.
* Organizza i test secondo la struttura dei blocchi `describe`.
* Evidenzia chiaramente i test falliti e quelli superati.

---

## Esecuzione

```bash
jest --verbose
```

Oppure con npm:

```bash
npm test -- --verbose
```

Può essere combinato con altre opzioni come `--coverage` o `--watch`.

---

## Esempio di output in console

```
 PASS  src/utils/math.test.ts
  Funzione sum
    ✓ somma due numeri positivi (3 ms)
    ✓ gestisce numeri negativi (1 ms)

 PASS  src/components/Greeting.test.tsx
  Greeting
    ✓ mostra il nome passato come prop (2 ms)

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.786 s
```

Con test falliti:

```
 FAIL  src/utils/divide.test.ts
  Funzione divide
    ✕ gestisce divisione per zero (15 ms)

  ● Funzione divide › gestisce divisione per zero

    Error: Divisione per zero non permessa
        at divide (src/utils/divide.ts:5:11)
```

---

## Differenza con output standard

| Modalità        | Comportamento                                                    |
| --------------- | ---------------------------------------------------------------- |
| Output standard | Mostra solo il risultato delle **suite** di test                 |
| `--verbose`     | Mostra anche ogni **singolo test case**, con descrizione e tempo |

---

## Quando usare `--verbose`

| Situazione                    | Motivazione                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| Debug locale                  | Per capire esattamente quali test sono eseguiti             |
| Test complessi                | Per seguire test annidati o suddivisi in molti `describe`   |
| Integrazione CI/CD            | Per rendere leggibili i log e verificare quali test passano |
| Test multipli con nomi simili | Per evitare ambiguità nell'identificazione dei test         |

---

## Configurazione persistente

Puoi attivare `verbose` di default nel `package.json`:

```json
"jest": {
  "verbose": true
}
```

Oppure nel file `jest.config.js`:

```js
module.exports = {
  verbose: true,
};
```

---

## Combinazione con altre opzioni

* `--verbose --coverage`: mostra risultati dettagliati e report di copertura
* `--verbose --watch`: modalità interattiva dettagliata
* `--verbose --runInBand`: utile in CI per visualizzare test sequenziali e dettagliati

---

## Conclusione

L’opzione `--verbose` è uno strumento essenziale per il debugging dei test in ambienti complessi. Permette una visione chiara, dettagliata e strutturata dell’esecuzione dei test, facilitando l’analisi degli errori, il monitoraggio della suite e il miglioramento continuo della qualità del codice.








































### Testing sincrono e asincrono in Jest

**con `async/await` e `done`**

---

## Obiettivo

Gestire test che includono **codice asincrono**, come:

* Promesse
* `async/await`
* Callback (es. `setTimeout`, chiamate a API simulate)

Jest fornisce tre modalità principali per gestire **test asincroni**:

1. Restituire una Promise
2. Usare `async/await`
3. Usare il callback `done` (modalità manuale)

---

## 1. Test sincrono – forma base

```ts
test('somma due numeri', () => {
  expect(2 + 3).toBe(5);
});
```

Questo è un test **sincrono**: eseguito e verificato immediatamente.

---

## 2. Test asincrono – restituzione esplicita di una Promise

Se il codice sotto test restituisce una Promise, è possibile restituirla direttamente:

```ts
function fetchData(): Promise<string> {
  return Promise.resolve('OK');
}

test('la promessa ritorna OK', () => {
  return fetchData().then((data) => {
    expect(data).toBe('OK');
  });
});
```

Jest attende automaticamente che la Promise sia **risolta** o **rifiutata**. Se non si restituisce la Promise, Jest considera il test terminato **prima** che la Promise venga risolta.

---

## 3. Test asincrono con `async/await` (consigliato)

Approccio moderno e più leggibile:

```ts
test('la funzione async ritorna OK', async () => {
  const data = await fetchData();
  expect(data).toBe('OK');
});
```

Può essere combinato con blocchi `try/catch` per testare errori:

```ts
test('la funzione async genera un errore', async () => {
  expect.assertions(1);
  try {
    await fetchDataThatFails();
  } catch (e) {
    expect(e).toMatch('Errore previsto');
  }
});
```

In alternativa, si può usare:

```ts
await expect(fetchDataThatFails()).rejects.toThrow('Errore previsto');
```

---

## 4. Test asincrono con `done` (callback)

Metodo **più basso livello**, utile per testare callback non basati su Promise (es. `setTimeout`, `fs.readFile`):

```ts
function fetchDataWithCallback(callback: (result: string) => void) {
  setTimeout(() => {
    callback('OK');
  }, 100);
}

test('funzione callback restituisce OK', (done) => {
  function callback(data: string) {
    expect(data).toBe('OK');
    done(); // segnala a Jest che il test è completato
  }

  fetchDataWithCallback(callback);
});
```

Se `done()` **non viene chiamato**, Jest considera il test **fallito per timeout**. Se viene chiamato due volte, Jest fallisce il test con un errore.

---

## Confronto tra i metodi

| Metodo        | Quando usarlo                                             | Vantaggi                                  |
| ------------- | --------------------------------------------------------- | ----------------------------------------- |
| `Promise`     | Quando il codice restituisce direttamente una Promise     | Semplice, leggibile                       |
| `async/await` | Quando si vogliono scrivere test più chiari e sequenziali | Sintassi moderna e pulita                 |
| `done`        | Quando si testano callback o codice legacy                | Compatibile con API non basate su Promise |

---

## Esempio completo con API mockata (async/await)

```ts
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('carica i dati da una API', async () => {
  mockedAxios.get.mockResolvedValue({ data: { message: 'ciao' } });

  const response = await axios.get('/api/test');
  expect(response.data.message).toBe('ciao');
});
```

---

## Conclusione

Gestire il codice asincrono nei test è fondamentale quando si lavora con API, timer, callback o qualsiasi operazione che non restituisce un risultato immediato. L’approccio consigliato è usare `async/await` per la maggior parte dei casi, e `done` solo quando si lavora con API callback-style.





































### **mocked Axios** con Jest

**Testing asincrono e mocking delle chiamate API**

---

## Contesto

Quando si testano componenti o funzioni che eseguono **chiamate HTTP con `axios`**, non si vuole effettuare davvero la chiamata a un server. È quindi necessario **mockare il modulo `axios`** per:

* evitare dipendenze esterne (API reali)
* controllare il comportamento della risposta (successo, errore, timeout, ecc.)
* testare l'interazione del codice con l'API (es. gestione dello stato, messaggi di errore, loading, ecc.)

---

## Obiettivo

Mockare `axios` in Jest per simulare chiamate HTTP e testare il comportamento del codice che le utilizza.

---

## 1. Setup e mock base

Supponiamo di avere una funzione che usa `axios`:

```ts
// src/api/userApi.ts
import axios from 'axios';

export async function getUser(id: number) {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
}
```

---

## 2. Mock di axios con Jest

### A. Importazione e conversione tipizzata

```ts
import axios from 'axios';
import { getUser } from './userApi';

jest.mock('axios'); // indica a Jest di sostituire l’intero modulo axios

const mockedAxios = axios as jest.Mocked<typeof axios>;
```

### B. Test: risposta simulata

```ts
test('getUser ritorna i dati utente correttamente', async () => {
  const fakeUser = { id: 1, name: 'Luca' };

  mockedAxios.get.mockResolvedValue({ data: fakeUser });

  const user = await getUser(1);
  expect(user).toEqual(fakeUser);
  expect(mockedAxios.get).toHaveBeenCalledWith('/api/users/1');
});
```

---

## 3. Altri metodi axios supportati

Puoi mockare qualsiasi metodo di `axios`:

```ts
mockedAxios.post.mockResolvedValue(...);
mockedAxios.put.mockRejectedValue(...);
mockedAxios.delete.mockImplementation(...);
```

---

## 4. Esempio con errore

```ts
test('getUser gestisce errore API', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Errore API'));

  await expect(getUser(1)).rejects.toThrow('Errore API');
});
```

---

## 5. Uso con componenti React

Supponiamo che un componente chiami `getUser()` nel suo `useEffect`:

```tsx
function UserProfile({ id }: { id: number }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(id).then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

### Testando il componente:

```tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';
import { getUser } from '../api/userApi';

jest.mock('../api/userApi');
const mockedGetUser = getUser as jest.Mock;

test('mostra il nome dell\'utente', async () => {
  mockedGetUser.mockResolvedValue({ name: 'Luca' });

  render(<UserProfile id={1} />);
  expect(await screen.findByText('Luca')).toBeInTheDocument();
});
```

---

## 6. Riepilogo metodi comuni di `jest.Mocked<typeof axios>`

| Metodo                     | Descrizione                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `mockResolvedValue(value)` | Simula una promessa risolta con `value`                              |
| `mockRejectedValue(error)` | Simula una promessa rifiutata con `error`                            |
| `mockImplementation(fn)`   | Fornisce una funzione personalizzata                                 |
| `mockClear()`              | Resetta il mock                                                      |
| `mock.calls`               | Accesso alle chiamate effettuate (`[args]`)                          |
| `toHaveBeenCalledWith()`   | Verifica che una funzione sia stata chiamata con argomenti specifici |

---

## 7. Alternativa: `msw` (Mock Service Worker)

Per test più realistici e vicini all’ambiente browser, è possibile usare [`msw`](https://mswjs.io/), che simula risposte HTTP intercettando effettivamente le richieste. È particolarmente utile per test di integrazione con React Testing Library.

---

## Conclusione

Il mocking di `axios` con Jest è fondamentale per isolare i test, controllare gli scenari di successo o errore, e garantire che la logica del componente o del modulo gestisca correttamente la risposta. L’approccio con `jest.mock()` è semplice, potente e flessibile per la maggior parte dei casi.




























### **MSW (Mock Service Worker)**

**Simulare API realistiche nei test di React**

---

## Cos’è MSW

**MSW (Mock Service Worker)** è una libreria avanzata per **mockare richieste HTTP** in ambiente **browser o Node**, **intercettando le vere fetch o chiamate axios** con un approccio **realistico e user-centric**.

### Differenza principale rispetto al mocking classico (`jest.mock()`):

* `jest.mock()` simula **le funzioni**
* **MSW** simula **il comportamento di un server reale**, intercettando **le chiamate HTTP** indipendentemente dalla libreria usata (`fetch`, `axios`, `XMLHttpRequest`, ecc.)

---

## Perché usare MSW

| Vantaggio                       | Spiegazione                                                               |
| ------------------------------- | ------------------------------------------------------------------------- |
| Realismo                        | Simula il comportamento reale di un’API, non solo la funzione chiamata    |
| Isolamento del test             | Non si effettuano chiamate reali                                          |
| Agnosticità dalla libreria HTTP | Funziona con `fetch`, `axios`, `superagent`, `XMLHttpRequest`, ecc.       |
| Coerenza tra sviluppo e test    | Gli stessi handler possono essere usati in test e in ambiente di sviluppo |
| Debuggabilità                   | Mostra le richieste nel DevTools di rete (in modalità browser)            |

---

## Architettura

* **Handlers**: definiscono le risposte da restituire per le richieste simulate
* **Mock Server**: intercetta le richieste ed esegue gli handler (in Node o nel browser)
* **Setup file**: collega MSW alla suite di test (Vitest o Jest)

---

## Esempio completo: Testing con MSW

### 1. Installazione

```bash
npm install msw --save-dev
```

---

### 2. Definizione degli handler

```ts
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({ id, name: 'Luca' })
    );
  }),
];
```

---

### 3. Setup del server mockato (ambiente Node per Jest o Vitest)

```ts
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

### 4. Setup globale per Jest o Vitest

#### `src/setupTests.ts`

```ts
import { server } from './mocks/server';

// Avvia il server prima di tutti i test
beforeAll(() => server.listen());

// Resetta gli handler dopo ogni test
afterEach(() => server.resetHandlers());

// Chiude il server dopo l'intera suite
afterAll(() => server.close());
```

---

### 5. Componente da testare

```tsx
// src/components/UserProfile.tsx
import { useEffect, useState } from 'react';

export default function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

---

### 6. Test con React Testing Library e MSW

```tsx
// src/components/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('mostra il nome dell\'utente mockato', async () => {
  render(<UserProfile id="123" />);
  expect(await screen.findByText('Luca')).toBeInTheDocument();
});
```

---

## Modificare la risposta in un singolo test

Puoi ridefinire un handler temporaneamente:

```ts
import { rest } from 'msw';
import { server } from '../mocks/server';

test('gestisce errore API', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<UserProfile id="123" />);
  expect(await screen.findByText('Errore')).toBeInTheDocument();
});
```

---

## Supporto in ambiente browser

Per usare MSW anche in **sviluppo locale**, esiste una configurazione client:

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

E in `main.tsx` o `index.tsx`:

```ts
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}
```

---

## Differenza tra `jest.mock()` e MSW

| Aspetto                            | `jest.mock()`             | `msw`                        |
| ---------------------------------- | ------------------------- | ---------------------------- |
| Tipo di mocking                    | Mock di moduli e funzioni | Mock di richieste HTTP       |
| Lato                               | Interno (unit test)       | Esterno (simula il server)   |
| Richiede riscrittura logica        | Sì (mock delle funzioni)  | No (la fetch rimane intatta) |
| Utilizzo con React Testing Library | Sì                        | Sì                           |
| Supporto fetch/axios               | Manuale                   | Automatico                   |

---

## Conclusione

MSW è oggi lo standard de facto per il mocking **realistico e flessibile** delle API in ambienti React. È consigliato nei casi in cui:

* si vogliono scrivere test comportamentali coerenti con il reale comportamento della rete
* si ha bisogno di testare anche gli stati intermedi (loading, errore)
* si vuole usare lo stesso set di API mock anche in **sviluppo**, **test unitari** e **e2e**

---






















### Filosofia di React Testing Library (RTL): **testare come l’utente interagisce**

---

## Premessa

React Testing Library (**RTL**) nasce da una precisa **filosofia di testing**: non testare l’**implementazione interna** dei componenti, ma **il loro comportamento percepito dall’utente finale**.
In altre parole:

> **“Il test dovrebbe verificare ciò che l’utente vede e fa, non come il componente è costruito.”**

---

## Obiettivo

L’obiettivo di RTL è quello di:

* **Ridurre i test fragili**, cioè quelli che falliscono in caso di refactoring anche se il comportamento dell’interfaccia non cambia.
* **Favorire test user-centric**, basati su ciò che viene **renderizzato nel DOM** e su **eventi realistici**.
* Simulare l’interazione utente in modo **accessibile**, esattamente come farebbe un utente reale (clic, input, navigazione, ecc.).

---

## Differenza chiave con Enzyme o test basati sull’implementazione

| Approccio                | RTL                                     | Enzyme / Approccio classico             |
| ------------------------ | --------------------------------------- | --------------------------------------- |
| Selezione elementi       | Basata su **testo visibile o ruolo**    | Basata su classi, id, struttura interna |
| Obiettivo                | **Cosa** fa il componente               | **Come** lo fa                          |
| Interazione              | `userEvent.click`, `type`, ecc.         | Simulazione manuale (`simulate`)        |
| Accessibilità            | Alta: usa `getByRole`, `getByLabelText` | Bassa: usa `find` o `querySelector`     |
| Fragilità ai refactoring | Bassa                                   | Alta                                    |

---

## Principi fondamentali di RTL

### 1. **Testare il comportamento, non l’implementazione**

Evita di testare dettagli interni come:

* stato locale
* chiamate a funzioni interne
* struttura del JSX

Preferisci invece:

* verificare il contenuto visibile
* simulare input e click
* osservare il DOM finale

### 2. **Testare solo ciò che l’utente può percepire**

Se qualcosa non è **visibile/accessibile** all’utente, non andrebbe incluso nel test (a meno che non sia parte del flusso critico come aria-label).

### 3. **Simulare eventi realistici**

Usa `userEvent` invece di `fireEvent`:

* `userEvent.type` per simulare digitazione vera (con ritardo)
* `userEvent.click` per click realistici (es. `pointerDown`, `pointerUp`, `click`)

---

## Esempio pratico

### Componente

```tsx
function LoginForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <button type="submit">Invia</button>
    </form>
  );
}
```

### Test con RTL (user-centric)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('l’utente può inserire un’email e inviare il form', async () => {
  render(<LoginForm />);

  const emailInput = screen.getByLabelText('Email');
  await userEvent.type(emailInput, 'test@example.com');

  const submitButton = screen.getByRole('button', { name: /invia/i });
  await userEvent.click(submitButton);

  expect(emailInput).toHaveValue('test@example.com');
});
```

> **Nota**: non si accede al DOM via `querySelector`, né si testano props o stato. Si testa **come l’utente interagisce con l’interfaccia**.

---

## Metodi di selezione consigliati da RTL (in ordine di priorità)

| Metodo                 | Quando usarlo                                                             |
| ---------------------- | ------------------------------------------------------------------------- |
| `getByRole`            | Per elementi con ruoli accessibili (`button`, `textbox`, `heading`, ecc.) |
| `getByLabelText`       | Per input associati a etichette (`label`)                                 |
| `getByPlaceholderText` | Per input con placeholder                                                 |
| `getByText`            | Per contenuti testuali visibili                                           |
| `getByAltText`         | Per immagini con testo alternativo (`alt`)                                |
| `getByTestId`          | **Solo come ultima risorsa** (usare `data-testid`)                        |

---

## Benefici concreti

* **Maggiore stabilità nel tempo**: i test non si rompono per piccoli refactoring interni.
* **Maggiore allineamento al comportamento reale**: si testano solo gli output e gli effetti osservabili.
* **Maggiore accessibilità**: l’uso di `getByRole`, `getByLabelText` spinge a scrivere componenti accessibili.

---

## Conclusione

La filosofia di **React Testing Library** è **centrata sull’utente**. L'obiettivo non è testare i dettagli interni del componente, ma verificare **cosa vede e fa l'utente finale**. Questo approccio porta a test più affidabili, accessibili e significativi.

---






















React Testing Library (RTL) offre una varietà di metodi per selezionare elementi nel DOM durante i test. Questi metodi sono progettati per riflettere il modo in cui gli utenti interagiscono con l'interfaccia, promuovendo test più affidabili e accessibili. Di seguito, una panoramica dei metodi più comuni, i loro contesti d'uso e esempi pratici.([Level Up Coding][1])

---

##  Metodi di Selezione Principali

### 1. `getByRole`

* **Descrizione**: Seleziona elementi in base al loro ruolo ARIA (es. `button`, `textbox`, `heading`).
* **Contesto d'uso**: Preferito per la maggior parte delle selezioni, in quanto riflette l'accessibilità e l'interazione dell'utente.
* **Esempio**:

  ```tsx
  const submitButton = screen.getByRole('button', { name: /invia/i });
  ```



### 2. `getByLabelText`

* **Descrizione**: Seleziona elementi associati a un'etichetta (`<label>`).
* **Contesto d'uso**: Ideale per campi di input nei moduli.
* **Esempio**:

  ```tsx
  const emailInput = screen.getByLabelText('Email');
  ```



### 3. `getByText`

* **Descrizione**: Seleziona elementi in base al loro contenuto testuale visibile.
* **Contesto d'uso**: Utile per trovare elementi come paragrafi, titoli o link.
* **Esempio**:

  ```tsx
  const welcomeMessage = screen.getByText('Benvenuto');
  ```



### 4. `getByPlaceholderText`

* **Descrizione**: Seleziona elementi in base al testo del placeholder.
* **Contesto d'uso**: Quando non è presente un'etichetta, ma un placeholder descrittivo.
* **Esempio**:

  ```tsx
  const searchInput = screen.getByPlaceholderText('Cerca...');
  ```



### 5. `getByDisplayValue`

* **Descrizione**: Seleziona elementi in base al loro valore visualizzato.
* **Contesto d'uso**: Per verificare il valore corrente di input, textarea o select.
* **Esempio**:

  ```tsx
  const nameInput = screen.getByDisplayValue('Mario Rossi');
  ```



### 6. `getByAltText`

* **Descrizione**: Seleziona immagini in base al testo alternativo (`alt`).
* **Contesto d'uso**: Per verificare la presenza e il contenuto di immagini.
* **Esempio**:

  ```tsx
  const logoImage = screen.getByAltText('Logo aziendale');
  ```



### 7. `getByTitle`

* **Descrizione**: Seleziona elementi in base all'attributo `title`.
* **Contesto d'uso**: Quando altri metodi non sono applicabili e l'elemento ha un `title` descrittivo.
* **Esempio**:

  ```tsx
  const infoIcon = screen.getByTitle('Informazioni');
  ```



### 8. `getByTestId`

* **Descrizione**: Seleziona elementi in base all'attributo `data-testid`.
* **Contesto d'uso**: Da usare come ultima risorsa quando altri metodi non sono applicabili.
* **Esempio**:

  ```tsx
  const customElement = screen.getByTestId('custom-element');
  ```



---

##  Varianti dei Metodi

RTL offre diverse varianti dei metodi di selezione per gestire differenti scenari:

* **`getBy...`**: Restituisce l'elemento corrispondente o lancia un errore se non trovato.
* **`queryBy...`**: Restituisce l'elemento corrispondente o `null` se non trovato; utile per verificare l'assenza di un elemento.
* **`findBy...`**: Restituisce una promessa che si risolve quando l'elemento è trovato; utile per elementi che appaiono asincronamente.

Per selezionare più elementi:

* **`getAllBy...`**: Restituisce un array di elementi corrispondenti o lancia un errore se nessuno trovato.
* **`queryAllBy...`**: Restituisce un array di elementi corrispondenti o un array vuoto se nessuno trovato.
* **`findAllBy...`**: Restituisce una promessa che si risolve con un array di elementi corrispondenti.

---

##  Linee Guida per la Scelta dei Metodi

Secondo le [linee guida ufficiali di RTL](https://testing-library.com/docs/queries/about/#priority), l'ordine di preferenza per la selezione degli elementi è:([testing-library.com][2])

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` (solo se necessario)([Level Up Coding][1], [codedrivendevelopment.com][3], [testing-library.com][2])

Questo approccio promuove test più robusti e accessibili, riducendo la dipendenza da dettagli dell'implementazione interna dei componenti.

---

Per ulteriori dettagli e esempi, puoi consultare la [cheatsheet ufficiale di RTL](https://testing-library.com/docs/react-testing-library/cheatsheet/).([testing-library.com][4])

[1]: https://levelup.gitconnected.com/the-difference-between-get-find-query-react-testing-library-bcd996ba3baa?utm_source=chatgpt.com "The difference between get, find, query (React Testing Library)."
[2]: https://testing-library.com/docs/queries/about/?utm_source=chatgpt.com "About Queries - Testing Library"
[3]: https://codedrivendevelopment.com/notes/react-testing-library-query-types?utm_source=chatgpt.com "React Testing Library query types - Notes | Code Driven Development"
[4]: https://testing-library.com/docs/react-testing-library/cheatsheet/?utm_source=chatgpt.com "Cheatsheet - Testing Library"

























### Best Practice in React Testing Library: **evitare `container`, `instance`, `act`**

React Testing Library (RTL) promuove un approccio al testing che scoraggia l'accesso diretto all'implementazione interna del componente. Alcune pratiche comuni nei test più datati o scritti con Enzyme (o Jest puro) **sono considerate anti-pattern in RTL**.

Vediamo **perché è importante evitare** l’uso diretto di:

* `container`
* `instance`
* `act()`

e quali sono le alternative consigliate.

---

## 1. `container`

### Cos'è:

`container` è il nodo root del DOM restituito da `render()`.
Esempio:

```tsx
const { container } = render(<MyComponent />);
const div = container.querySelector('.some-class');
```

### Perché evitarlo:

* **Si basa su selettori CSS**, non su interazioni user-centric.
* È **fragile**: basta cambiare una classe o una struttura HTML interna e il test fallisce, anche se il comportamento è invariato.
* Ignora completamente **l'accessibilità** e l'esperienza utente.

### Alternativa consigliata:

Usa i metodi forniti da `screen`:

```tsx
const element = screen.getByRole('heading', { level: 2 });
```

oppure:

```tsx
const input = screen.getByLabelText('Email');
```

---

## 2. `instance` (riferimenti diretti a istanze di componenti)

### Cos'è:

In librerie come Enzyme era comune accedere all'istanza del componente per verificare stato, metodi, ecc.:

```tsx
const wrapper = shallow(<MyComponent />);
wrapper.instance().myMethod();
```

### Perché evitarlo:

* **RTL non espone le istanze dei componenti** (e fa bene).
* Accedere all’istanza viola l’incapsulamento e sposta il test dal **comportamento osservabile** all’**implementazione interna**.
* Diventa fragile ai refactor (es. conversione da class-based a functional + hook).

### Alternativa consigliata:

Testa l'effetto visibile dell’interazione:

```tsx
userEvent.click(screen.getByRole('button', { name: 'Aggiungi' }));
expect(screen.getByText('Hai cliccato 1 volta')).toBeInTheDocument();
```

---

## 3. `act()`

### Cos'è:

`act()` è una funzione di React (e re-exportata da RTL) che garantisce che **tutti gli aggiornamenti di stato siano processati** prima di eseguire le asserzioni.

Esempio:

```tsx
act(() => {
  fireEvent.click(button);
});
```

### Perché evitarlo *esplicitamente*:

* **React Testing Library lo usa automaticamente internamente**.
* Se usato manualmente senza necessità, **rende i test più verbosi e confusi**.
* Se ti accorgi che devi usare `act()` a mano, probabilmente stai:

  * testando logiche troppo interne
  * usando codice non aggiornato
  * non aspettando una Promise

### Quando è accettabile:

* In test molto avanzati su custom hook o librerie esterne che non sono completamente compatibili.
* Quando si testano **hook personalizzati** con `@testing-library/react-hooks`.

### Alternativa consigliata:

Usa `await` per gli aggiornamenti asincroni e `userEvent` per le interazioni:

```tsx
await userEvent.type(screen.getByRole('textbox'), 'ciao');
expect(screen.getByDisplayValue('ciao')).toBeInTheDocument();
```

---

## Riepilogo

| Elemento    | Perché evitarlo                                     | Alternativa                          |
| ----------- | --------------------------------------------------- | ------------------------------------ |
| `container` | Basato sul DOM interno, fragile, non user-centric   | `screen.getByRole`, `getByText` etc. |
| `instance`  | Viola l’incapsulamento, accede all’implementazione  | Testa l’effetto visibile             |
| `act()`     | RTL lo usa già, inutilmente verboso se usato a mano | Usa `await`, `userEvent`, `findBy*`  |

---

## Conclusione

React Testing Library incoraggia a **testare l’interfaccia pubblica del componente**, non i dettagli della sua costruzione interna.
Seguire queste best practice porta a test:

* più **robusti**
* più **manutenibili**
* più **vicini all’esperienza utente reale**






















### Gestione del DOM Virtuale in React Testing Library

**`screen`, `render`, `cleanup`**

---

React Testing Library utilizza un **DOM virtuale JSDOM** per simulare un ambiente browser durante i test. Gestire correttamente questo DOM è fondamentale per eseguire test affidabili, isolati e leggibili.

---

## 1. `render`: montare un componente in un ambiente simulato

### Cos’è

`render()` è la funzione principale di RTL per **montare un componente React** in un DOM virtuale fornito da JSDOM.

```tsx
import { render } from '@testing-library/react';

render(<MyComponent />);
```

### Cosa fa:

* Monta il componente in un contenitore DOM invisibile (usato da JSDOM)
* Rende disponibile l’albero DOM risultante
* Restituisce un oggetto con utility utili (es. `getByText`, `rerender`, `container`, ecc.)

### Parametri opzionali:

```tsx
render(<MyComponent />, {
  wrapper: MyCustomProvider,
});
```

Utile per fornire contesti (es. Redux, Router) globali al componente testato.

---

## 2. `screen`: accesso globale al DOM renderizzato

### Cos’è

`screen` è un **proxy globale** a tutte le API di selezione (come `getByText`, `getByRole`, ecc.) legate all’ultima chiamata a `render()`.

### Esempio:

```tsx
import { render, screen } from '@testing-library/react';

render(<MyComponent />);
expect(screen.getByText('Benvenuto')).toBeInTheDocument();
```

### Vantaggi:

* Evita di destrutturare il ritorno di `render`
* Migliora la leggibilità e standardizza l’approccio

```tsx
// invece di:
const { getByText } = render(<Comp />);
getByText(...);

// preferibile:
render(<Comp />);
screen.getByText(...);
```

### Nota:

`screen` riflette **solo l’ultimo render**, non uno storico cumulativo.

---

## 3. `cleanup`: smontare il DOM virtuale

### Cos’è

`cleanup()` smonta il componente e **pulisce il DOM virtuale**. Serve a **resettare l’ambiente** tra un test e l’altro.

### Quando è necessario:

* In Jest, **viene chiamato automaticamente** dopo ogni test grazie alla configurazione interna di RTL.
* In ambienti alternativi (Mocha, AVA, custom runner) può essere necessario chiamarlo manualmente:

  ```ts
  import { cleanup } from '@testing-library/react';

  afterEach(() => {
    cleanup();
  });
  ```

### Perché è importante:

* Evita **conflitti tra test**
* Garantisce che i test siano **isolati**
* Previene **leaks di memoria o riferimenti DOM non validi**

---

## Riepilogo delle differenze

| Funzione  | Scopo                                | Quando si usa                          |
| --------- | ------------------------------------ | -------------------------------------- |
| `render`  | Monta un componente nel DOM virtuale | All’inizio di ogni test                |
| `screen`  | Accede al DOM dell’ultimo `render()` | Per leggere elementi e fare asserzioni |
| `cleanup` | Smonta il DOM virtuale tra i test    | Automatico (in Jest), manuale altrove  |

---

## Best practice

* **Usa sempre `screen`**: migliora chiarezza e leggibilità.
* **Evita di accedere a `container`** (vedi best practice precedenti).
* **Affidati al `beforeEach/afterEach` automatico**, ma conosci `cleanup()` per ambienti personalizzati.
* **Mantieni i test indipendenti**: ogni `test` deve fare il proprio `render` ed evitare dipendenze tra casi.

---

## Esempio completo

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Greeting from './Greeting';

test('mostra messaggio dopo click', async () => {
  render(<Greeting />);
  
  await userEvent.click(screen.getByRole('button', { name: /mostra/i }));
  
  expect(screen.getByText('Ciao utente')).toBeInTheDocument();
});
```

---





























### Testing del Rendering dei Componenti React: Visibilità, Contenuto Testuale e Classi

Il testing del rendering dei componenti React con React Testing Library (RTL) si concentra sull'esperienza dell'utente, verificando ciò che è effettivamente visibile e interagibile nell'interfaccia. Questo approccio promuove test più affidabili e meno suscettibili a cambiamenti interni del componente.

---

####  Visibilità degli Elementi

Per verificare se un elemento è presente nel DOM e visibile all'utente:

```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('il titolo è visibile', () => {
  render(<h1>Benvenuto</h1>);
  const heading = screen.getByRole('heading', { name: /benvenuto/i });
  expect(heading).toBeVisible();
});
```



* `toBeVisible()` è fornito da `@testing-library/jest-dom` e verifica che l'elemento sia visibile secondo le regole CSS.([Codecademy][1])

---

####  Contenuto Testuale

Per assicurarsi che un elemento contenga un determinato testo:

```tsx
test('il paragrafo contiene il testo corretto', () => {
  render(<p>Ciao, mondo!</p>);
  const paragraph = screen.getByText(/ciao, mondo!/i);
  expect(paragraph).toBeInTheDocument();
});
```



* `getByText` cerca un elemento con il testo specificato.
* `toBeInTheDocument()` verifica che l'elemento sia presente nel DOM.([FreeCodeCamp][2])

---

####  Verifica delle Classi CSS

Sebbene RTL scoraggi l'uso di classi come selettori nei test, è possibile verificarne la presenza:

```tsx
test('il bottone ha la classe "primario"', () => {
  render(<button className="primario">Clicca</button>);
  const button = screen.getByRole('button', { name: /clicca/i });
  expect(button).toHaveClass('primario');
});
```



* `toHaveClass()` verifica che l'elemento abbia la classe specificata.
* È consigliabile utilizzare questo metodo solo quando la classe ha un impatto diretto sull'esperienza utente visibile, come nel caso di stili condizionali.([Stack Overflow][3])

---

####  Considerazioni sull'Uso delle Classi nei Test

Secondo le linee guida di RTL, è preferibile evitare di selezionare elementi basandosi su classi CSS, poiché:

* Le classi sono dettagli di implementazione e possono cambiare facilmente.
* Gli utenti finali non interagiscono con le classi, ma con l'interfaccia visibile.

Tuttavia, se è necessario verificare la presenza di una classe, è accettabile farlo con `toHaveClass()`, come mostrato sopra.

---

####  Esempio Completo

Ecco un esempio che combina le verifiche di visibilità, contenuto testuale e classi:

```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Messaggio({ tipo }) {
  return (
    <div className={`messaggio ${tipo}`}>
      {tipo === 'errore' ? 'Si è verificato un errore.' : 'Operazione riuscita.'}
    </div>
  );
}

test('mostra messaggio di errore con classe corretta', () => {
  render(<Messaggio tipo="errore" />);
  const message = screen.getByText(/si è verificato un errore/i);
  expect(message).toBeVisible();
  expect(message).toHaveClass('messaggio', 'errore');
});
```



---

####  Conclusione

* **Visibilità**: Utilizzare `toBeVisible()` per verificare che gli elementi siano visibili all'utente.
* **Contenuto Testuale**: Utilizzare `getByText` e `toBeInTheDocument()` per verificare la presenza di testi specifici.
* **Classi CSS**: Utilizzare `toHaveClass()` con cautela, solo quando la classe influisce direttamente sull'interfaccia utente visibile.

Adottando queste pratiche, i test saranno più robusti, manutenibili e allineati con l'esperienza reale dell'utente.

---

[1]: https://www.codecademy.com/learn/learn-react-testing/modules/react-testing-library/cheatsheet?utm_source=chatgpt.com "React Testing Library Cheatsheet - Codecademy"
[2]: https://www.freecodecamp.org/news/write-unit-tests-using-react-testing-library/?utm_source=chatgpt.com "React Testing Library Tutorial – How to Write Unit Tests for React Apps"
[3]: https://stackoverflow.com/questions/53389956/how-to-test-a-classname-with-the-jest-and-react-testing-library?utm_source=chatgpt.com "How to test a className with the Jest and React testing library"






















### Snapshot Testing in React: quando usarlo e quando evitarlo

**Snapshot testing** è una funzionalità offerta da Jest che consente di catturare la rappresentazione renderizzata di un componente in un momento specifico e confrontarla automaticamente con versioni future.
L’obiettivo è rilevare **modifiche involontarie** nell’output di un componente.

---

## Cos'è uno snapshot

Uno **snapshot** è un file `.snap` generato automaticamente da Jest che contiene una rappresentazione serializzata del DOM renderizzato (di solito JSX/HTML).
Esempio:

```tsx
import { render } from '@testing-library/react';
import MyComponent from './MyComponent';

test('render del componente', () => {
  const { asFragment } = render(<MyComponent />);
  expect(asFragment()).toMatchSnapshot();
});
```

Jest crea un file con il markup corrente del componente. Al test successivo, Jest confronta il nuovo output con quello salvato.

---

## Vantaggi dello snapshot testing

### 1. Rilevamento di regressioni

Ti avvisa se il componente è cambiato rispetto alla versione precedente, evitando modifiche non intenzionali nel DOM.

### 2. Nessuna logica di selezione

Non è necessario specificare `getByText`, `getByRole`, ecc. L’intero albero DOM viene salvato come riferimento.

### 3. Manutenzione semplice (in teoria)

Aggiornare uno snapshot è semplice: basta eseguire:

```bash
jest -u
```

per rigenerare gli snapshot quando le modifiche sono volute.

---

## Limiti e svantaggi

### 1. Test fragili e poco significativi

Piccole modifiche (es. un nuovo `div`, una nuova classe CSS) fanno fallire il test anche se non vi è alcun impatto reale sull’utente.

### 2. Copertura illusoria

Avere uno snapshot non equivale ad avere un test utile. Il test passa finché l’output è identico, ma **non verifica che il comportamento sia corretto**.

### 3. Abuso nei team grandi

Nei progetti collaborativi è facile che gli snapshot vengano aggiornati automaticamente (con `jest -u`) **senza essere revisionati**, perdendo il controllo sulle modifiche.

### 4. Output poco leggibile

Gli snapshot lunghi diventano rapidamente difficili da interpretare e mantenere. Modifiche minime generano differenze difficili da esaminare nei diff di Git.

---

## Quando usare lo snapshot testing

| Situazione                                | Usalo? | Motivazione                                                                  |
| ----------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| Componenti molto semplici e stabili       | Sì     | Se il componente cambia raramente, lo snapshot può proteggere da regressioni |
| Componente UI senza interazioni complesse | Sì     | Esempio: icona, badge, layout statico                                        |
| Test visivi o documentazione              | Sì     | Se usato come riferimento per una visualizzazione documentale                |

---

## Quando evitare lo snapshot testing

| Situazione                                  | Evitalo | Motivazione                                                              |
| ------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| Componenti dinamici o complessi             | Sì      | Lo snapshot cambierebbe ad ogni modifica legittima                       |
| Comportamenti basati su stato o interazione | Sì      | Meglio usare test comportamentali con RTL (es. `getByText`, `userEvent`) |
| Snapshot troppo lunghi o dettagliati        | Sì      | Difficili da leggere, interpretare e mantenere                           |
| Uso indiscriminato in CI/CD                 | Sì      | Facilita aggiornamenti automatici non controllati nei merge              |

---

## Esempio: snapshot utile

```tsx
test('MyButton rendering statico', () => {
  const { asFragment } = render(<MyButton label="Click me" />);
  expect(asFragment()).toMatchSnapshot();
});
```

Utile se:

* Il bottone è semplice
* Non contiene stato interno o eventi
* Cambia raramente

---

## Esempio: snapshot da evitare

```tsx
test('Componente con contenuto dinamico', () => {
  const { asFragment } = render(<UserList />);
  expect(asFragment()).toMatchSnapshot();
});
```

Non utile se:

* L’output dipende da una lista che cambia
* Ci sono condizionali, stati, o API
* Il DOM cambia spesso

---

## Conclusione

**Snapshot testing può essere utile, ma va usato con moderazione e criterio.**
Preferisci i test **comportamentali**, focalizzati su ciò che l’utente può vedere o fare. Usa gli snapshot solo per componenti stabili, statici e ben isolati.



























### Test su Componenti con **Props Condizionali**

**Verificare il rendering e il comportamento in base alle props**

---

In React, i componenti possono modificare il proprio output in base alle **props** ricevute. I test su questi componenti devono quindi verificare **tutti i comportamenti condizionati**, assicurandosi che:

* il rendering sia corretto per ogni combinazione significativa di props
* il comportamento cambi correttamente in risposta alle props
* gli effetti visivi o le classi siano coerenti con lo stato dichiarato

---

## 1. Esempio semplice: props boolean

### Componente

```tsx
type AlertProps = {
  error?: boolean;
};

function Alert({ error = false }: AlertProps) {
  return (
    <div role="alert" className={error ? 'alert error' : 'alert success'}>
      {error ? 'Errore!' : 'Operazione riuscita'}
    </div>
  );
}
```

---

### Test

```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';

test('mostra messaggio di successo di default', () => {
  render(<Alert />);
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Operazione riuscita');
  expect(alert).toHaveClass('success');
});

test('mostra messaggio di errore se error=true', () => {
  render(<Alert error={true} />);
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Errore!');
  expect(alert).toHaveClass('error');
});
```

---

## 2. Esempio con props stringa + rendering condizionato

### Componente

```tsx
type BadgeProps = {
  status: 'online' | 'offline' | 'busy';
};

function StatusBadge({ status }: BadgeProps) {
  if (status === 'offline') return null;

  return <span className={`badge ${status}`}>{status}</span>;
}
```

---

### Test

```tsx
test('renderizza badge per status online', () => {
  render(<StatusBadge status="online" />);
  const badge = screen.getByText('online');
  expect(badge).toBeInTheDocument();
  expect(badge).toHaveClass('badge', 'online');
});

test('non renderizza nulla se status è offline', () => {
  render(<StatusBadge status="offline" />);
  expect(screen.queryByText('offline')).toBeNull();
});
```

---

## 3. Best Practice

| Pratica                                        | Motivazione                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| Testare ogni ramo condizionale                 | Verifica che ogni possibile valore della prop sia gestito correttamente |
| Usare `queryBy*` quando l’elemento può mancare | Evita eccezioni se il nodo non viene renderizzato                       |
| Verificare classi, contenuti e ruoli           | Assicura output coerente con l’esperienza utente                        |
| Evitare test generici                          | Ogni combinazione significativa di props deve avere il suo test         |

---

## 4. Quando usare `rerender`

Se vuoi testare **il cambio di props nello stesso test**, puoi usare `rerender`:

```tsx
const { rerender } = render(<Alert />);
expect(screen.getByText('Operazione riuscita')).toBeInTheDocument();

rerender(<Alert error={true} />);
expect(screen.getByText('Errore!')).toBeInTheDocument();
```

Utile quando il componente è **dinamico ma senza stato locale**, e vuoi testare solo il comportamento condizionato alle props.

---

## Conclusione

I test su componenti con props condizionali sono fondamentali per garantire la **robustezza del rendering** e la **correttezza della UI** in condizioni diverse. Concentrati su:

* ogni variazione rilevante di props
* contenuto e visibilità condizionali
* impatto visivo (classi, ruoli, testo, attributi)

























### Testare componenti React con **stato locale** e **hook (`useState`, `useEffect`)**

**Verificare comportamento, side effects, e reattività all’interazione**

---

In React, la logica del componente è spesso guidata da **hook di stato (`useState`)** e **hook di effetto (`useEffect`)**. Nei test, non si deve verificare **l’esistenza dello stato**, ma **l’effetto che produce** sul DOM o sul comportamento del componente.

> In linea con la filosofia di React Testing Library:
> **testa l’effetto visibile, non l’implementazione interna.**

---

## 1. Esempio con `useState`: contatore

### Componente

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Hai cliccato {count} volte</p>
      <button onClick={() => setCount(count + 1)}>Clicca</button>
    </>
  );
}
```

### Test

```tsx
test('incrementa il contatore al click', async () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /clicca/i });

  await userEvent.click(button);
  await userEvent.click(button);

  expect(screen.getByText('Hai cliccato 2 volte')).toBeInTheDocument();
});
```

---

## 2. Esempio con `useEffect`: fetch dati

### Componente con effetto all'avvio

```tsx
function UserInfo({ userId }: { userId: number }) {
  const [name, setName] = useState('');

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setName(data.name));
  }, [userId]);

  return <p>{name ? `Utente: ${name}` : 'Caricamento...'}</p>;
}
```

---

### Mock con MSW o Jest (semplificato)

```tsx
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Luca' }),
  })
) as jest.Mock;

test('carica e mostra il nome utente', async () => {
  render(<UserInfo userId={1} />);
  expect(screen.getByText('Caricamento...')).toBeInTheDocument();

  expect(await screen.findByText('Utente: Luca')).toBeInTheDocument();
});
```

---

## 3. Uso combinato: `useState` + `useEffect` interattivo

### Componente

```tsx
function DelayedMessage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return visible ? <p>Messaggio dopo delay</p> : <p>In attesa...</p>;
}
```

### Test con gestione del tempo

```tsx
jest.useFakeTimers();

test('mostra messaggio dopo timeout', () => {
  render(<DelayedMessage />);
  expect(screen.getByText('In attesa...')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(500);
  });

  expect(screen.getByText('Messaggio dopo delay')).toBeInTheDocument();
});
```

---

## Best practice

| Pratica                                 | Motivazione                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| Evita di testare direttamente lo stato  | Verifica **l’effetto nel DOM**, non `count`, `name`, ecc.    |
| Usa `userEvent` per modificare lo stato | Simula interazione utente invece di chiamare funzioni a mano |
| Usa `findBy*` per effetti asincroni     | Aspetta che il DOM cambi a seguito di `useEffect`            |
| Usa `jest.useFakeTimers()` per timeout  | Controlla `setTimeout`, `setInterval`, debounce, ecc.        |

---

## Quando usare `act()`

* Quando si modifica **manualmente** lo stato o il tempo (es. con `jest.advanceTimersByTime`)
* **Non è necessario** nella maggior parte dei test RTL, perché `render`, `userEvent`, `findBy*` gestiscono già le modifiche internamente

---

## Conclusione

Per testare componenti con `useState` e `useEffect`, focalizzati sempre su:

* l’effetto **visibile sul DOM**
* il comportamento **percepibile dall’utente**
* gli aggiornamenti asincroni o ritardati (quando rilevanti)



























### Testing di **Componenti Memoizzati** e **Pure Components**

**Verificare il comportamento e l’ottimizzazione del rendering**

---

In React, i componenti **memoizzati** e **pure components** sono ottimizzazioni che evitano il re-render se le props non cambiano.
Dal punto di vista dei test, questo introduce due obiettivi distinti:

1. Verificare che **il comportamento funzionale rimanga corretto**
2. (Opzionalmente) Verificare che **il re-render venga evitato** in caso di props invariate (solo nei test di performance o ottimizzazione)

---

## 1. Memoizzazione: `React.memo`

### Componente di esempio

```tsx
import React from 'react';

type MessageProps = { text: string };

const Message = React.memo(({ text }: MessageProps) => {
  console.log('Message render');
  return <p>{text}</p>;
});

export default Message;
```

### Comportamento:

* Viene renderizzato **solo se `text` cambia**
* Per `React.memo`, il confronto è **shallow** (oggetti devono avere reference diversa per innescare il re-render)

---

### Test: verifica del comportamento

```tsx
test('renderizza il testo corretto', () => {
  render(<Message text="Ciao" />);
  expect(screen.getByText('Ciao')).toBeInTheDocument();
});
```

Qui RTL **non si occupa di ottimizzazione del re-render**, ma del **risultato osservabile**.
Testare l’ottimizzazione vera e propria richiede strumenti aggiuntivi (vedi più sotto).

---

## 2. Verifica di **comportamenti ottimizzati** (solo se necessario)

Se vuoi testare che un componente **non si ri-renderizzi inutilmente**, puoi:

* usare una **mock function come wrapper**
* controllare **quante volte il componente figlio viene renderizzato**

### Esempio: uso di `jest.fn()` per contare i render

```tsx
const RenderCounter = jest.fn();

const MemoComponent = React.memo(({ label }: { label: string }) => {
  RenderCounter();
  return <div>{label}</div>;
});

function Wrapper({ value }: { value: string }) {
  return <MemoComponent label={value} />;
}
```

### Test

```tsx
test('non ri-renderizza se le props sono uguali', () => {
  const { rerender } = render(<Wrapper value="ciao" />);
  expect(RenderCounter).toHaveBeenCalledTimes(1);

  rerender(<Wrapper value="ciao" />);
  expect(RenderCounter).toHaveBeenCalledTimes(1); // nessun re-render
});
```

---

## 3. PureComponent (classi)

### Esempio:

```tsx
class PureGreeting extends React.PureComponent<{ name: string }> {
  render() {
    return <h1>Ciao {this.props.name}</h1>;
  }
}
```

> `PureComponent` è simile a `React.memo`: evita re-render se le props **primitive** non cambiano.

### Test comportamentale:

```tsx
test('mostra il saluto con il nome', () => {
  render(<PureGreeting name="Luca" />);
  expect(screen.getByText('Ciao Luca')).toBeInTheDocument();
});
```

---

## 4. Best practice

| Obiettivo                     | Cosa testare                                                       | Come farlo                            |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| Comportamento funzionale      | Output visibile, interazioni, testo, classi                        | `render`, `screen.getBy*`             |
| Ottimizzazione dei render     | Verifica che il componente non si ri-renderizzi con props uguali   | Mock function + `render` + `rerender` |
| Supporto a oggetti o funzioni | Usa `useCallback`, `useMemo` per mantenere referenze               | Solo in test di ottimizzazione reale  |
| Evitare falsi positivi        | Verifica solo gli effetti osservabili, non implementazioni interne | Non testare se un hook è usato        |

---

## Conclusione

React Testing Library **non testa direttamente il numero di render**, ma si concentra sull’**output risultante** e sull’**interazione percepita**.

Tuttavia, se desideri testare l’ottimizzazione del rendering (es. per regressioni di performance), puoi usare:

* mock di render
* `console.log` intercettato
* `Profiler` React (in ambienti e2e)

























### Mocking avanzato: `jest.mock()` per moduli

Il mocking avanzato in Jest consente di sostituire completamente moduli o funzioni durante i test, simulandone il comportamento. Questo è utile per:

* isolare il codice testato da dipendenze esterne
* simulare API, hook, utility complesse
* testare flussi diversi (successo, errore, edge cases)

---

## 1. Cos’è `jest.mock()`?

`jest.mock(moduleName)` dice a Jest di sostituire quel modulo con una **versione mockata automaticamente o manualmente**.

### Sintassi base:

```ts
jest.mock('nome-del-modulo');
```

Questo crea un mock **automatico**: tutte le funzioni diventano `jest.fn()`.

---

## 2. Esempio base: mock automatico

### Modulo reale

```ts
// utils/api.ts
export const fetchData = () => {
  return fetch('/api/data').then(res => res.json());
};
```

### Test con mock

```ts
import { fetchData } from '../utils/api';

jest.mock('../utils/api');

const mockedFetchData = fetchData as jest.Mock;

test('usa il mock di fetchData', async () => {
  mockedFetchData.mockResolvedValue({ data: 'mockata' });

  const result = await fetchData();
  expect(result.data).toBe('mockata');
  expect(mockedFetchData).toHaveBeenCalled();
});
```

---

## 3. Mock con implementazione personalizzata (`jest.mock` + factory)

Puoi passare una **factory function** a `jest.mock()` per specificare un comportamento personalizzato:

```ts
jest.mock('../utils/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mockata' })),
}));
```

---

## 4. Mock parziale (con mantenimento di alcune funzioni)

Se vuoi **mockare solo una funzione** di un modulo e lasciare intatte le altre:

```ts
import * as api from '../utils/api';

jest.mock('../utils/api', () => ({
  ...jest.requireActual('../utils/api'),
  fetchData: jest.fn(),
}));
```

Ora puoi usare `api.fetchData` come mock mentre tutto il resto rimane originale.

---

## 5. Mock di moduli esterni (es. axios)

### `axios.ts`

```ts
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

test('mock di axios.get', async () => {
  mockedAxios.get.mockResolvedValue({ data: { message: 'ok' } });

  const res = await axios.get('/api');
  expect(res.data.message).toBe('ok');
});
```

---

## 6. Mock di hook personalizzati

Supponiamo di avere:

```ts
// hooks/useAuth.ts
export const useAuth = () => ({ isLoggedIn: true });
```

### Test

```ts
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../hooks/useAuth';

const mockedUseAuth = useAuth as jest.Mock;

test('simula utente non loggato', () => {
  mockedUseAuth.mockReturnValue({ isLoggedIn: false });

  render(<MyComponent />);
  expect(screen.queryByText('Logout')).not.toBeInTheDocument();
});
```

---

## Best Practice

| Obiettivo                       | Approccio consigliato                                    |
| ------------------------------- | -------------------------------------------------------- |
| Isolare completamente un modulo | `jest.mock('modulo')` + implementazione manuale          |
| Simulare solo una funzione      | `jest.requireActual` + override della funzione specifica |
| Gestire API async               | `mockResolvedValue` / `mockRejectedValue`                |
| Mockare hook React              | Esporre hook esterni e mockare con `jest.fn()`           |

---

## Conclusione

`jest.mock()` è uno strumento potente per scrivere test isolati, flessibili e realistici. Usato correttamente, permette di simulare qualsiasi scenario senza dipendere da servizi reali o stati complessi.



























### Confronto tra `jest.mock()` e `axios.get` (e simili)

**Mocking di moduli vs mocking di singole funzioni**

---

##  Obiettivo: testare in isolamento

Quando si testano funzioni o componenti che fanno chiamate HTTP (es. con `axios.get()`), è importante **non inviare vere richieste** a un server. In Jest puoi ottenere questo risultato in due modi principali:

---

## 1. **Mockare l’intero modulo con `jest.mock('axios')`**

###  Quando usarlo:

* Quando vuoi **simulare tutto il comportamento** del modulo `axios`, inclusi `get`, `post`, `put`, ecc.
* Per creare un **mock globale e persistente** durante tutto il test
* Per evitare qualsiasi chiamata reale (di rete o di libreria)

###  Come funziona:

```ts
import axios from 'axios';

jest.mock('axios'); // sostituisce completamente axios con un mock

const mockedAxios = axios as jest.Mocked<typeof axios>;

test('axios.get restituisce dati simulati', async () => {
  mockedAxios.get.mockResolvedValue({ data: { message: 'ok' } });

  const response = await axios.get('/api/test');
  expect(response.data.message).toBe('ok');
  expect(mockedAxios.get).toHaveBeenCalledWith('/api/test');
});
```

###  Vantaggi:

* Controllo completo su tutte le funzioni (`get`, `post`, ecc.)
* Nessuna chiamata vera alla rete
* Riutilizzabile in molti test

###  Svantaggi:

* Il mock vale **per tutti i test**, a meno che non venga resettato
* Se axios è usato in più punti (es. come istanza), potrebbe servire ulteriore configurazione

---

## 2. **Mockare `axios.get` direttamente con `jest.spyOn()` o `jest.fn()`**

###  Quando usarlo:

* Quando vuoi **mockare una sola funzione (`get`)** e lasciare le altre operative
* Per creare un mock **temporaneo e limitato al test**

###  Esempio con `jest.spyOn()`:

```ts
import axios from 'axios';

test('mock di axios.get con spyOn', async () => {
  const spy = jest.spyOn(axios, 'get').mockResolvedValue({ data: { ok: true } });

  const result = await axios.get('/api');
  expect(result.data.ok).toBe(true);
  expect(spy).toHaveBeenCalled();

  spy.mockRestore(); // buona pratica: ripristina l’originale
});
```

###  Vantaggi:

* Maggiore **precisione** e **granularità**
* Meno invasivo: le altre funzioni di axios continuano a funzionare

###  Svantaggi:

* Più verboso
* Serve ricordarsi di ripristinare il mock se influisce su altri test (`mockRestore()`)

---

## Confronto riassuntivo

| Caratteristica                         | `jest.mock('axios')`               | `jest.spyOn(axios, 'get')`          |
| -------------------------------------- | ---------------------------------- | ----------------------------------- |
| Mock globale e totale                  | ✅                                  | ❌ (solo la funzione specifica)      |
| Più facile da usare in progetti React  | ✅                                  | ⚠️ meglio per test di unità isolati |
| Serve reset tra test                   | ✅ (`jest.resetAllMocks()`)         | ✅ (`mockRestore()`)                 |
| Controllo preciso su una sola funzione | ❌                                  | ✅                                   |
| Usato per `axios.get`, `.post` ecc.    | ✅ globale                          | ✅ ma uno per funzione               |
| Funziona bene con istanze axios        | ⚠️ no, richiede mock più specifico | ✅ se si spia un’istanza             |

---

## Quando usare l’uno o l’altro?

| Scenario                                                | Metodo consigliato         |
| ------------------------------------------------------- | -------------------------- |
| Componenti React che usano `axios.get()` in `useEffect` | `jest.mock('axios')`       |
| Funzioni isolate che chiamano `axios.get()`             | `jest.spyOn(axios, 'get')` |
| Test di regressione globale                             | `jest.mock()`              |
| Vuoi testare `.get` ma lasciare `.post` reale           | `jest.spyOn()`             |

---

## Conclusione

Usa `jest.mock('axios')` per bloccare completamente tutte le chiamate reali a `axios` in test di **componenti o moduli complessi**.
Usa `jest.spyOn()` quando vuoi **mockare temporaneamente una sola funzione**, ad esempio in test unitari.




























### Mocking di API con `msw` o `jest.fn()`

**Approcci a confronto per testare chiamate HTTP in React**

---

Mockare le API è essenziale per testare in isolamento i componenti React che effettuano richieste HTTP. I due approcci più comuni sono:

* **`msw` (Mock Service Worker)**: simula il comportamento reale della rete
* **`jest.fn()` o `jest.mock()`**: sostituisce manualmente funzioni o moduli

Ogni approccio ha vantaggi specifici, a seconda dello scopo del test.

---

## 1. Mocking con `jest.fn()` o `jest.mock()`

### Caratteristiche

* Mock manuale della funzione (`fetch`, `axios`, `getData`, ecc.)
* L’approccio è diretto, esplicito, e adatto ai test unitari

---

### Esempio con `global.fetch` (vanilla)

```tsx
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Luca' }),
  })
) as jest.Mock;
```

### Componente

```tsx
function UserInfo() {
  const [name, setName] = useState('');
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setName(data.name));
  }, []);
  return <p>{name}</p>;
}
```

### Test

```tsx
test('mostra il nome utente da API mockata', async () => {
  render(<UserInfo />);
  expect(await screen.findByText('Luca')).toBeInTheDocument();
});
```

---

### Vantaggi

* Semplice per testare funzioni isolate
* Controllo totale su cosa restituisce `fetch`
* Nessuna dipendenza esterna

### Svantaggi

* Non simula realmente il comportamento del browser
* Rischio di test poco realistici se il codice usa `axios`, `fetch`, `XMLHttpRequest`, ecc.
* Poco flessibile se ci sono molte API diverse o risposte condizionali

---

## 2. Mocking con `msw` (Mock Service Worker)

### Caratteristiche

* Intercetta le richieste HTTP reali effettuate da `fetch`, `axios`, ecc.
* Simula un server vero a livello di rete, mantenendo il comportamento originale del browser

---

### Setup

#### handlers.ts

```ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ name: 'Luca' }));
  }),
];
```

#### server.ts

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

#### setupTests.ts

```ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### Test

```tsx
test('mostra nome utente usando MSW', async () => {
  render(<UserInfo />);
  expect(await screen.findByText('Luca')).toBeInTheDocument();
});
```

---

### Vantaggi

* Mock realistico e agnostico rispetto alla libreria HTTP (axios, fetch, ecc.)
* Le richieste appaiono nei DevTools (in modalità browser)
* Permette di testare loading, errori, stati condizionali
* Gli stessi handler possono essere riutilizzati per testing, sviluppo locale e E2E

### Svantaggi

* Richiede una configurazione iniziale
* Più indicato per test di integrazione e componenti, meno per unit test di funzioni pure

---

## Confronto riassuntivo

| Caratteristica             | `jest.fn()` / `jest.mock()`    | `msw`                                  |
| -------------------------- | ------------------------------ | -------------------------------------- |
| Complessità iniziale       | Bassa                          | Media                                  |
| Accuratezza del mock       | Limitata                       | Alta (simula il comportamento di rete) |
| Supporta `fetch`, `axios`  | Sì, ma richiede mock specifico | Sì, senza modifiche al codice          |
| Test unitari               | Ottimo                         | Eccessivo per semplici funzioni        |
| Test di componenti         | Sufficiente                    | Ideale                                 |
| Simula errori / delay      | Solo con logica manuale        | Sì, integrato con `ctx.delay`, ecc.    |
| DevTools/network debugging | No                             | Sì (in browser con `setupWorker`)      |

---

## Quando scegliere cosa

| Scenario                                                | Strumento consigliato |
| ------------------------------------------------------- | --------------------- |
| Vuoi testare una funzione che chiama `fetch`            | `jest.fn()`           |
| Vuoi testare un componente React con effetto da API     | `msw`                 |
| Vuoi simulare vari scenari di risposta (es. errore 500) | `msw`                 |
| Stai facendo TDD su funzioni pure                       | `jest.fn()`           |

---

## Conclusione

* Usa `jest.fn()` o `jest.mock()` per test **unitari rapidi e isolati**
* Usa `msw` per test **comportamentali e di integrazione realistici**, specie con React



























### Mock di funzioni di callback e timer con `jest.fn()` e `jest.spyOn`

**Simulare, controllare e verificare funzioni e temporizzazioni in Jest**

---

In Jest, `jest.fn()` e `jest.spyOn()` sono strumenti fondamentali per testare:

* **callback passate come prop**
* **funzioni eseguite su evento**
* **temporizzatori (`setTimeout`, `setInterval`)**
* **lato reattivo di `useEffect`, `useCallback` o funzioni custom**

---

## 1. `jest.fn()`: creare una funzione mock generica

### Sintassi

```ts
const mockCallback = jest.fn();
```

Puoi usarla per:

* contare quante volte è stata chiamata
* sapere con quali argomenti
* controllare il valore di ritorno
* intercettare chiamate asincrone

---

### Esempio: callback passata come prop

```tsx
function Button({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Clicca</button>;
}
```

#### Test con `jest.fn()`

```tsx
test('chiama la callback al click', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);

  await userEvent.click(screen.getByText('Clicca'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## 2. Simulare un comportamento con `mockImplementation`

```ts
const log = jest.fn((x) => `ciao ${x}`);
expect(log('Luca')).toBe('ciao Luca');
```

---

## 3. Verificare ritorni e parametri

```ts
const callback = jest.fn();
callback('a', 2);

expect(callback).toHaveBeenCalledWith('a', 2);
expect(callback).toHaveReturned(); // almeno una volta
```

---

## 4. `jest.spyOn()`: spiare (e opzionalmente mockare) funzioni reali

### Differenza con `jest.fn()`:

* `jest.fn()` crea una funzione **standalone**
* `jest.spyOn(obj, 'method')` **intercetta una funzione esistente**

---

### Esempio: `console.log`

```ts
const spy = jest.spyOn(console, 'log');

console.log('ciao');
expect(spy).toHaveBeenCalledWith('ciao');

spy.mockRestore(); // buona pratica
```

---

### Esempio: funzione importata

```ts
// utils/logger.ts
export function log(msg: string) {
  console.log(msg);
}
```

```ts
import * as logger from './utils/logger';

test('spia log', () => {
  const spy = jest.spyOn(logger, 'log');
  logger.log('test');
  expect(spy).toHaveBeenCalledWith('test');
});
```

---

## 5. Timer: mocking di `setTimeout`, `setInterval`

Jest consente di controllare i timer nativi con **timer finti**:

### Setup

```ts
jest.useFakeTimers();
```

---

### Esempio con `setTimeout`

```tsx
function TimeoutMessage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(id);
  }, []);
  return <div>{visible ? 'Pronto' : 'Attendi...'}</div>;
}
```

### Test

```tsx
test('mostra messaggio dopo 1 secondo', () => {
  jest.useFakeTimers();
  render(<TimeoutMessage />);

  expect(screen.getByText('Attendi...')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText('Pronto')).toBeInTheDocument();
});
```

---

### Metodi disponibili

| Metodo                         | Descrizione                                     |
| ------------------------------ | ----------------------------------------------- |
| `jest.useFakeTimers()`         | Attiva i timer finti                            |
| `jest.advanceTimersByTime(ms)` | Fa avanzare il tempo simulato                   |
| `jest.runAllTimers()`          | Esegue tutte le code `setTimeout`/`setInterval` |
| `jest.clearAllTimers()`        | Resetta tutti i timer                           |
| `jest.useRealTimers()`         | Ripristina i timer reali                        |

---

## Quando usare `jest.fn()` e `jest.spyOn()`

| Obiettivo                               | Strumento            |
| --------------------------------------- | -------------------- |
| Creare un mock manuale                  | `jest.fn()`          |
| Controllare chiamate a funzioni passate | `jest.fn()`          |
| Intercettare funzioni reali             | `jest.spyOn()`       |
| Spiare funzioni importate da moduli     | `jest.spyOn()`       |
| Simulare `setTimeout`, `setInterval`    | `jest.useFakeTimers` |

---

## Conclusione

* Usa `jest.fn()` per mockare funzioni callback nei test di interazione
* Usa `jest.spyOn()` per intercettare metodi esistenti senza riscriverli
* Usa `jest.useFakeTimers()` per controllare il flusso del tempo nei test asincroni



























### Mocking del router con `react-router-dom`: guida approfondita

In un'app React che usa `react-router-dom`, è comune dover testare:

* Componenti che leggono parametri di URL (`useParams`)
* Componenti che navigano (`useNavigate`)
* Route protette o layout con `<Outlet>`
* Comportamenti legati al contesto di routing (`useLocation`, `useSearchParams`)

Durante i test, è quindi fondamentale **mockare correttamente le funzionalità del router**, per mantenere isolamento e controllo.

---

## 1. Mock **completo** del router per testare `useNavigate`, `useParams`, `useLocation`

### Caso 1: `useNavigate`

#### Componente

```tsx
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return <button onClick={() => navigate('/dashboard')}>Vai</button>;
}
```

#### Test con `jest.mock()`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

test('naviga su /dashboard al click', async () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  render(<Home />);
  await userEvent.click(screen.getByRole('button', { name: /vai/i }));

  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
```

---

### Caso 2: `useParams`

#### Componente

```tsx
import { useParams } from 'react-router-dom';

export default function Post() {
  const { id } = useParams();
  return <h1>Post {id}</h1>;
}
```

#### Test

```tsx
import { useParams } from 'react-router-dom';
import Post from './Post';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

test('mostra l’id corretto', () => {
  (useParams as jest.Mock).mockReturnValue({ id: '42' });

  render(<Post />);
  expect(screen.getByText('Post 42')).toBeInTheDocument();
});
```

---

### Caso 3: `useLocation` e `useSearchParams`

```tsx
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/profile',
    search: '?mode=edit',
  }),
  useSearchParams: () => [
    new URLSearchParams('?mode=edit'),
    jest.fn(), // setSearchParams
  ],
}));
```

---

## 2. Uso di `MemoryRouter` per test funzionali

Per testare la **navigazione reale** tra route (senza mocking), usa `<MemoryRouter>` e `<Routes>`. Questo è ideale nei test **di integrazione**.

### Esempio

```tsx
import { MemoryRouter, Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
    </Routes>
  );
}

test('naviga realmente tra route', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByText('Vai'));
  expect(await screen.findByText('Dashboard')).toBeInTheDocument();
});
```

---

## 3. Testare `Outlet` in layout

Se il componente testato contiene un `<Outlet />`, occorre usare una configurazione completa con `<Routes>` e `element`.

```tsx
function Layout() {
  return (
    <div>
      <nav>Menu</nav>
      <Outlet />
    </div>
  );
}

test('verifica outlet con pagina figlia', () => {
  render(
    <MemoryRouter initialEntries={['/child']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="child" element={<h1>Contenuto</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Menu')).toBeInTheDocument();
  expect(screen.getByText('Contenuto')).toBeInTheDocument();
});
```

---

## Riepilogo: tecniche di mocking del router

| Caso da testare            | Tecnica consigliata                             |
| -------------------------- | ----------------------------------------------- |
| `useNavigate`              | `jest.mock()` con `jest.fn()`                   |
| `useParams`, `useLocation` | `jest.mock()` con valori simulati               |
| Navigazione reale          | `MemoryRouter` con `initialEntries`             |
| Outlet + figli             | `<Routes>` + route nidificate                   |
| Comportamento con `Link`   | `MemoryRouter` + simulazione click              |
| Redirect, fallback         | Verifica `path="*"` o navigazione programmatica |

---

## Conclusione

Per testare in modo efficace componenti React che usano `react-router-dom`:

* Usa `jest.mock()` per isolare e controllare hook di routing (`useNavigate`, `useParams`, `useLocation`)
* Usa `<MemoryRouter>` per test di integrazione realistici tra route
* Verifica sempre **l'effetto visibile nel DOM**, non la presenza dei path






























### Mocking dello **Redux Store**: guida approfondita per i test

Quando si testano componenti che interagiscono con Redux, è fondamentale **isolare il comportamento** e **controllare lo stato** fornito al componente.
Questo si ottiene attraverso il mocking dello **store** o delle funzioni `useSelector` / `useDispatch`.

---

## Obiettivi principali del mocking Redux

* Simulare lo **stato globale** fornito al componente
* Verificare **se e come viene eseguito il dispatch** di un’azione
* Rimuovere la dipendenza dalla logica di riduzione e middlewares reali
* Evitare che il test sia un test end-to-end o di integrazione completa

---

## Tecniche disponibili

| Tecnica                                  | Quando usarla                                    |
| ---------------------------------------- | ------------------------------------------------ |
| Mock di `useSelector` e `useDispatch`    | Unit test di un singolo componente               |
| `Provider` con store mock personalizzato | Integrazione con più componenti connessi         |
| `configureStore` di Redux Toolkit        | Test realistici ma controllabili con slice reali |

---

## 1. **Mock diretto di `useSelector` e `useDispatch`** con `jest.mock()`

### Esempio

```tsx
// store/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;
```

### Componente

```tsx
function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <>
      <h1>{user.name}</h1>
      <button onClick={() => dispatch({ type: 'auth/logout' })}>Logout</button>
    </>
  );
}
```

### Test

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';

jest.mock('../store/hooks');

const mockDispatch = jest.fn();

(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
(useAppSelector as jest.Mock).mockImplementation((selector) =>
  selector({ auth: { user: { name: 'Luca' } } })
);

test('renderizza il nome e chiama logout al click', async () => {
  render(<Profile />);

  expect(screen.getByText('Luca')).toBeInTheDocument();
  await userEvent.click(screen.getByText('Logout'));
  expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
});
```

### Vantaggi

* Test **molto isolato**
* Nessuna necessità di Redux Toolkit o reducer
* Massimo controllo su selettori e dispatch

### Svantaggi

* Più verboso se ci sono molti `useSelector`
* Si perde la verifica del comportamento dei reducer reali

---

## 2. **Mock store con Redux Toolkit e `Provider`**

Per test **di integrazione più realistici**, è meglio fornire un vero `store` (semplificato) tramite `<Provider>`.

### Setup

```tsx
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const mockStore = configureStore({
  reducer: {
    auth: () => ({ user: { name: 'Luca' } }), // reducer mock
  },
});
```

### Test

```tsx
render(
  <Provider store={mockStore}>
    <Profile />
  </Provider>
);

expect(screen.getByText('Luca')).toBeInTheDocument();
```

### Vantaggi

* Usa gli hook e provider reali
* Può essere esteso a test multipli con slice diversi

### Svantaggi

* Meno isolamento (non test puro del componente)
* Se il componente usa azioni asincrone (`thunk`), serve mockare anche middleware

---

## 3. **Verificare azioni asincrone con Redux Thunk**

Se stai usando `createAsyncThunk`, puoi **mockare la funzione dispatchata**:

```ts
const asyncThunk = require('../store/actions').logoutThunk;

jest.mock('../store/actions', () => ({
  logoutThunk: jest.fn(() => ({ type: 'auth/logout' })),
}));
```

E testare così:

```tsx
await userEvent.click(screen.getByText('Logout'));
expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
```

Oppure con `logoutThunk` come funzione mockata, controllando che sia chiamata.

---

## 4. Best practice

| Obiettivo                              | Approccio consigliato                              |
| -------------------------------------- | -------------------------------------------------- |
| Isolare completamente il componente    | Mock `useSelector` e `useDispatch` con `jest.fn()` |
| Test realistico con store semplificato | `Provider` + `configureStore()` con reducer mock   |
| Verificare `dispatch`                  | Mock `useDispatch` e traccia `mockDispatch`        |
| Testare `createAsyncThunk`             | Mock esplicito della thunk (con `jest.fn()`)       |

---

## Conclusione

Mockare Redux è fondamentale per scrivere test **veloci, affidabili e mirati**.

* Per **unit test**, usa `jest.mock()` su `useSelector` e `useDispatch`
* Per test **di integrazione** più realistici, crea un `store` con Redux Toolkit e fornisci `Provider`
* Per azioni asincrone, **mocka le thunk** e verifica le chiamate


























### Testing di **form dinamici e validation** in React

**React Testing Library + librerie di validazione (es. Yup, Zod, native)**

---

## Obiettivi del test

Un form dinamico è un form in cui:

* **i campi cambiano** in base allo stato o ad altre selezioni
* la **validazione può essere condizionata** o personalizzata

Il test deve verificare:

1. Il **render dinamico dei campi** (in base a scelte, interazioni, condizioni)
2. La **validazione** dei campi:

   * quando viene attivata (onBlur, onChange, onSubmit)
   * cosa mostra (messaggi di errore)
3. Il **comportamento del form** all'invio:

   * con dati validi
   * con dati invalidi
   * interazione disabilitata finché non valido

---

## 1. Esempio: form dinamico con validazione e condizione

```tsx
import { useState } from 'react';

export function DynamicForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return alert('Email non valida');
    if (role === 'azienda' && company === '') return alert('Azienda richiesta');
    onSubmit({ role, email, company });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Ruolo
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">--</option>
          <option value="persona">Persona</option>
          <option value="azienda">Azienda</option>
        </select>
      </label>

      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      {role === 'azienda' && (
        <label>
          Azienda
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      )}

      <button type="submit">Invia</button>
    </form>
  );
}
```

---

## 2. Test completo con React Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicForm } from './DynamicForm';

test('mostra il campo azienda solo se selezionato', async () => {
  render(<DynamicForm onSubmit={jest.fn()} />);
  expect(screen.queryByLabelText(/azienda/i)).toBeNull();

  await userEvent.selectOptions(screen.getByLabelText(/ruolo/i), 'azienda');
  expect(screen.getByLabelText(/azienda/i)).toBeInTheDocument();
});

test('mostra errore se email non valida', async () => {
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<DynamicForm onSubmit={jest.fn()} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'nonvalida');
  await userEvent.click(screen.getByRole('button', { name: /invia/i }));

  expect(alertMock).toHaveBeenCalledWith('Email non valida');
  alertMock.mockRestore();
});

test('mostra errore se campo azienda mancante', async () => {
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<DynamicForm onSubmit={jest.fn()} />);

  await userEvent.selectOptions(screen.getByLabelText(/ruolo/i), 'azienda');
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /invia/i }));

  expect(alertMock).toHaveBeenCalledWith('Azienda richiesta');
  alertMock.mockRestore();
});

test('invoca submit con dati validi', async () => {
  const submitMock = jest.fn();
  render(<DynamicForm onSubmit={submitMock} />);

  await userEvent.selectOptions(screen.getByLabelText(/ruolo/i), 'azienda');
  await userEvent.type(screen.getByLabelText(/email/i), 'ok@example.com');
  await userEvent.type(screen.getByLabelText(/azienda/i), 'OpenAI');
  await userEvent.click(screen.getByRole('button', { name: /invia/i }));

  expect(submitMock).toHaveBeenCalledWith({
    role: 'azienda',
    email: 'ok@example.com',
    company: 'OpenAI',
  });
});
```

---

## 3. Testing con librerie di validazione (es. Yup, React Hook Form)

Se il form usa **React Hook Form + Yup**, puoi testare gli errori nel DOM:

```tsx
expect(await screen.findByText('Campo obbligatorio')).toBeInTheDocument();
```

E verificare che un campo abbia classe `aria-invalid`, `is-invalid`, ecc.

---

## 4. Best practice

| Aspetto                           | Pratica consigliata                                               |
| --------------------------------- | ----------------------------------------------------------------- |
| Comportamento dinamico            | Usa `queryBy*` prima della condizione, poi `getBy*` dopo          |
| Validazione asincrona             | Usa `findByText`, `await` e `act()` per errori generati da schema |
| Simulare submit con dati invalidi | Verifica blocco invio, messaggi, e non chiamata di `onSubmit`     |
| Controllo sulla funzione          | Usa `jest.fn()` o `jest.spyOn()` per verificare `onSubmit`        |
| Accessibilità e selettori         | Usa `getByLabelText`, `getByRole`, `getByText`                    |

---

## Conclusione

Testare form dinamici e validazioni richiede:

* simulare il comportamento dell’utente nel modificare stato e campi
* verificare che l’interfaccia reagisca correttamente (input visibili, errori mostrati)
* controllare che l’invio avvenga solo quando i dati sono corretti


























### Guida completa a **React Developer Tools** (React Web Tools)

**Profilazione, ispezione componenti e debugging dell’albero React**

---

## Cos'è React Developer Tools

**React Developer Tools** è un'estensione ufficiale disponibile per **Chrome** e **Firefox**, che consente di **ispezionare l'albero dei componenti React**, **analizzare lo stato**, **verificare le props** e **profilare le performance**.
È uno strumento indispensabile per il debugging e l'ottimizzazione delle applicazioni React nel browser.

---

## Installazione

* Chrome: [https://chrome.google.com/webstore/detail/react-developer-tools](https://chrome.google.com/webstore/detail/react-developer-tools)
* Firefox: [https://addons.mozilla.org/it/firefox/addon/react-devtools/](https://addons.mozilla.org/it/firefox/addon/react-devtools/)

Dopo l’installazione, quando si visita un sito che utilizza React in modalità **non production**, appariranno due nuove schede in DevTools:

* **Components**
* **Profiler**

---

## 1. Scheda "Components"

Questa sezione mostra l’**albero dei componenti React** come è effettivamente montato nella pagina.

### Funzionalità principali:

#### Visualizzazione struttura:

* Visualizza la **gerarchia dei componenti**, sia personalizzati sia built-in.
* Permette di **navigare facilmente** tra genitori e figli.

#### Ispezione props e state:

* Selezionando un componente, è possibile vedere:

  * Props ricevute
  * Stato interno (`useState`, `useReducer`)
  * Valori derivati da context

#### Modifica valori:

* È possibile modificare **dinamicamente** lo stato o le props (se supportato) per testare il comportamento del componente.

#### Evidenziazione:

* Se attiva l’opzione "Highlight updates", React DevTools evidenzierà in verde i componenti che vengono aggiornati nel DOM durante le interazioni.

---

## 2. Scheda "Profiler"

Questa sezione serve per **misurare le performance di rendering** dell’albero React.

### Come si usa:

1. Vai sulla scheda **Profiler**
2. Premi il pulsante **Record**
3. Interagisci con l’app
4. Premi **Stop**

React DevTools mostrerà:

* Un **grafico temporale** dei render
* Il **tempo impiegato** da ciascun componente
* Quali componenti sono stati renderizzati
* Eventuali ottimizzazioni inefficaci (es. componenti memoizzati che si aggiornano comunque)

### Utilizzo pratico:

* Identificare **componenti che si aggiornano troppo spesso**
* Capire se un re-render è stato causato da **cambiamento di props**, di stato o da **context**
* Verificare la corretta applicazione di `React.memo`, `useMemo`, `useCallback`

---

## Esempio di flusso di debugging

Supponiamo di avere un componente `UserList` che sembra rallentare l'applicazione.
Con React DevTools puoi:

1. Aprire il profiler
2. Avviare la registrazione
3. Interagire con i filtri del componente o caricare una nuova lista
4. Fermare la registrazione
5. Analizzare quanto tempo ha impiegato `UserList` per renderizzare
6. Capire se `UserList` ha ri-renderizzato anche quando le props non sono cambiate
7. Valutare se usare `React.memo`, `useMemo`, o rifattorizzare la struttura

---

## Quando React DevTools non funziona

* Non funziona su build **production minificate** (React rimuove i metadata)
* Alcuni bundler personalizzati potrebbero interferire
* In Vite, è consigliabile **attivare `devtools: true`** nelle opzioni di plugin se usi plugin React

---

## Integrazione con `why-did-you-render`

Per testare i re-render evitabili direttamente nel browser, puoi integrare React DevTools con la libreria \[`@welldone-software/why-did-you-render`] (solo in sviluppo).

---

## Differenze rispetto ad altri strumenti

| Strumento               | Scopo principale                 | Tipo di utilizzo         |
| ----------------------- | -------------------------------- | ------------------------ |
| React DevTools          | Debugging e profiling componenti | Interattivo, in DevTools |
| Lighthouse              | Auditing performance e SEO       | Analisi generale         |
| MSW / Jest              | Mocking e test                   | Ambiente di test         |
| Webpack Bundle Analyzer | Analisi del peso del bundle      | Ottimizzazione build     |

---

## Conclusione

React Developer Tools è uno strumento fondamentale per:

* Capire cosa succede nel tuo albero di componenti
* Verificare se i render sono giustificati
* Misurare performance reali
* Intervenire su problemi di aggiornamenti non necessari

È utile sia in fase di sviluppo quotidiano che per analisi avanzate in debugging o ottimizzazione.

