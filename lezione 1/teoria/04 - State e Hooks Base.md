---

# **2. useState e meccanismi interni avanzati**

---

## **2. L’aggiornamento asincrono dello stato e il batching**

### 🔹 Teoria

Lo stato aggiornato con `useState` non viene modificato immediatamente. React **programmerà il re-render** e **batcherà** più aggiornamenti in un unico passaggio per migliorare le prestazioni.

```tsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

Non otterremo `count = 3`, ma `count = 1`, perché ogni `setCount(count + 1)` è calcolato con lo stesso valore iniziale di `count`.

---

### Soluzione corretta: usare la funzione updater

```tsx
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

In questo modo, React utilizza l’**ultimo valore aggiornato** invece di calcolare 3 volte dallo stesso valore iniziale.

---

### Esempio pratico

```tsx
const [count, setCount] = useState(0);

const handleIncrement = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
};

return (
  <>
    <p>Contatore: {count}</p>
    <button onClick={handleIncrement}>Incrementa x3</button>
  </>
);
```

---

## **2.2 Stato immutabile: array e oggetti**

### 🔹 Teoria

React non rileva le mutazioni **interne** a un oggetto o array. Il re-render avviene solo se viene passato un **nuovo riferimento**.

Esempio **errato**:

```tsx
const [user, setUser] = useState({ name: 'Mario', age: 25 });

function aggiornaNome() {
  user.name = 'Luca';
  setUser(user); // React non rileva il cambiamento
}
```

---

### Soluzione corretta: usare lo spread operator

```tsx
setUser({ ...user, name: 'Luca' });
```

In questo modo si crea un **nuovo oggetto**, che React rileva come aggiornamento.

---

### Esempio pratico

```tsx
const [user, setUser] = useState({ name: 'Mario', age: 25 });

const handleUpdate = () => {
  setUser(prev => ({ ...prev, name: 'Luca' }));
};

return (
  <>
    <p>Nome: {user.name}</p>
    <button onClick={handleUpdate}>Cambia Nome</button>
  </>
);
```

---

## **2.3 Stato primitivo vs stato strutturato**

### 🔹 Best practice

- Evita di usare più `useState` per dati che sono logicamente correlati
- Se lo stato rappresenta un'entità strutturata, è meglio usare un oggetto

Esempio:

```tsx
const [form, setForm] = useState({ nome: '', email: '' });

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setForm({ ...form, [e.target.name]: e.target.value });
}
```

---

## **2.4 Stato controllato vs stato non controllato**

### 🔹 Definizione

- **Stato controllato**: il valore dell’input è gestito dallo stato React (`value` e `onChange`)
- **Stato non controllato**: l’input gestisce il valore da sé (es. `defaultValue` + `useRef`)

Usa **stato controllato** quando:
- Devi validare
- Devi aggiornare lo stato globale
- Vuoi un comportamento prevedibile

---

## **Esercizio guidato 1 – Incrementi multipli e batching**

### Obiettivo
Dimostrare il comportamento del batching e della funzione updater.

### Istruzioni

1. Crea un componente `Incrementatore`
2. Stato iniziale: `count = 0`
3. Aggiungi due pulsanti:
   - Incrementa con `count + 1` tre volte
   - Incrementa con `prev => prev + 1` tre volte
4. Osserva le differenze

### Atteso

```tsx
function Incrementatore() {
  const [count, setCount] = useState(0);

  const errore = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const corretto = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <p>Contatore: {count}</p>
      <button onClick={errore}>Incrementa (errore)</button>
      <button onClick={corretto}>Incrementa (corretto)</button>
    </div>
  );
}
```

---

## **Esercizio guidato 2 – Modifica oggetti in stato**

### Obiettivo

Gestire correttamente l’aggiornamento immutabile di un oggetto nello state.

### Istruzioni

1. Stato iniziale: `{ nome: 'Anna', ruolo: 'Studente' }`
2. Aggiungi un bottone che modifica solo il `ruolo`
3. Mostra i dati prima e dopo

### Atteso

```tsx
function Utente() {
  const [user, setUser] = useState({ nome: 'Anna', ruolo: 'Studente' });

  const cambiaRuolo = () => {
    setUser(prev => ({ ...prev, ruolo: 'Sviluppatrice' }));
  };

  return (
    <div>
      <p>Nome: {user.nome}</p>
      <p>Ruolo: {user.ruolo}</p>
      <button onClick={cambiaRuolo}>Cambia ruolo</button>
    </div>
  );
}
```

---

### Best practice sull'utilizzo del parametro `prev` in `useState`

Nel contesto di React, quando si utilizza lo stato con `useState`, è possibile aggiornarlo passando:

- Un **valore diretto** (oggetto, stringa, numero, ecc.)
- Una **funzione** che riceve il valore corrente (`prev`) e restituisce il nuovo stato

L’utilizzo della **funzione di aggiornamento con `prev`** è considerato una buona pratica in diversi scenari.

---

## Quando e perché usare `prev => ...`

### 1. In caso di **aggiornamenti multipli nello stesso ciclo di render**

React batcha gli aggiornamenti di stato. Se si chiama `setState` più volte nello stesso evento, e si utilizza direttamente la variabile, tutte le chiamate useranno lo stesso valore. Usare `prev` garantisce che ogni aggiornamento utilizzi l’ultimo valore disponibile.

Esempio problematico:

```tsx
setCount(count + 1);
setCount(count + 1);
```

Esempio corretto:

```tsx
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

---

### 2. Quando lo **stato dipende dal valore precedente**

Se il nuovo valore è calcolato in funzione di quello corrente, è sempre consigliabile usare la funzione updater con `prev`.

Esempio:

```tsx
setList(prev => [...prev, nuovoElemento]);
```

Questo è particolarmente importante in componenti che ricevono aggiornamenti frequenti.

---

### 3. Per garantire **immutabilità e sicurezza**

Usare `prev` riduce il rischio di accedere a uno stato obsoleto che React non ha ancora aggiornato, in particolare in componenti che gestiscono eventi asincroni o aggiornamenti concorrenti.

---

### 4. Per migliorare la **leggibilità e la semantica**

Anche quando l'accesso diretto allo stato è valido, l’utilizzo di `prev => ...` comunica in modo esplicito che il nuovo stato è costruito a partire da quello precedente. Questo aiuta nella manutenzione del codice, soprattutto in team o su progetti di medie e grandi dimensioni.

---

### Quando si può evitare

L’unico caso in cui può essere accettabile non usare `prev` è quando:

- Lo stato non viene aggiornato più volte nello stesso ciclo
- Il nuovo valore è totalmente indipendente da quello precedente
- Si è certi che il valore dello stato nello scope sia aggiornato

Esempio:

```tsx
setModalOpen(true);
```

In questo caso non serve `prev`, perché non dipende dal valore precedente.

---

## Conclusione

Utilizzare `prev` come parametro della funzione di aggiornamento dello stato è una best practice raccomandata, soprattutto quando:

- Si eseguono aggiornamenti concatenati o condizionali
- Si modificano array o oggetti
- Il nuovo stato dipende direttamente dal valore precedente

Seguire questa pratica aiuta a scrivere codice più solido, prevedibile e resistente a futuri refactoring o modifiche del ciclo di rendering.













---

# **useRef in contesti pratici – Approfondimento tecnico e concettuale**

---

## **1. Cos’è `useRef` dal punto di vista interno**

`useRef` è un hook fornito da React che restituisce un oggetto mutabile persistente con la forma:

```ts
const ref = useRef(initialValue);
```

Il valore `initialValue` viene assegnato solo **al primo render**, mentre la proprietà `.current` può essere letta e modificata liberamente, senza causare un nuovo render del componente.

### Struttura dell’oggetto:

```ts
ref: { current: initialValue }
```

Questo oggetto viene **mantenuto stabile tra un render e l’altro**, cioè il riferimento a `ref` non cambia (immutabilità strutturale), ma la sua proprietà `current` è liberamente mutabile.

### Importanza architetturale

- `useRef` offre un **canale per conservare uno stato interno non visivo**, cioè che non deve influenzare il rendering dell’interfaccia
- È un’alternativa a `useState` quando:
  - Non si vuole causare un re-render
  - Si vuole tracciare qualcosa tra i render
  - Si vuole comunicare con il DOM (elementi fisici)

---

## **2. Accesso al DOM e manipolazione imperativa**

### Caso: focus automatico su un campo input

React è progettato per una manipolazione dichiarativa del DOM. Tuttavia, ci sono casi in cui serve **interagire direttamente** con un elemento reale: ad esempio, per impostare il focus su un input.

```tsx
import { useRef, useEffect } from 'react';

export default function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <input ref={inputRef} placeholder="Nome" />
  );
}
```

- useEffect è un Hook fornito da React che consente di eseguire del codice "di effetto collaterale" dopo che il componente è stato montato o aggiornato.

### Perché usare `useRef` e non `document.getElementById`

- Accesso diretto al DOM compatibile con il ciclo di vita di React
- Funziona in ambienti React Server/SSR (mentre il DOM diretto no)
- Evita side-effect esterni e facilita testabilità

---

## **3. Tracciamento di valori tra i render senza re-render**

### Caso: contatore di render

```tsx
const renderCount = useRef(0);
renderCount.current += 1;
console.log('Render #: ', renderCount.current);
```

### Caratteristiche chiave

- `renderCount` non fa parte dello stato React
- Modificarlo non innesca un re-render
- È un **contenitore persistente** utile per:
  - Tracciare metriche
  - Logiche di confronto (`previousValue`)
  - Event handling tra render

---

## **4. Differenza tra `useRef` e `useState` in contesti asincroni**

### Il problema delle closure

Le funzioni asincrone, come `setTimeout`, `setInterval`, o `Promise.then()`, **accedono allo stato del momento in cui sono state definite**. Se si usa `useState`, si rischia di usare un valore obsoleto.

### Esempio con `useState`:

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // potrebbe stampare sempre 0
  }, 1000);

  return () => clearInterval(id);
}, []);
```

### Soluzione con `useRef`:

```tsx
const count = useRef(0);

useEffect(() => {
  const id = setInterval(() => {
    count.current += 1;
    console.log(count.current);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

### Spiegazione

- `useRef` non viene coinvolto nelle chiusure del ciclo di render
- Il valore `current` è sempre l’ultima versione disponibile, perché l’oggetto è persistente
- `useRef` è quindi **immune al problema delle closure**

---

## **5. `useRef` come contenitore persistente**

`useRef` è lo strumento ideale per memorizzare:

- ID di timer, timeout, subscription
- Valori di riferimento tra render (`previousX`)
- Flag booleani o condizioni da tracciare senza visualizzazione
- Dati che devono sopravvivere allo smontaggio e rimontaggio del componente

---

## **6. Caso d’uso completo – Timer persistente**

### Requisiti:

- Mostrare il tempo trascorso in secondi
- Permettere start, stop, reset
- Anche se si resetta lo stato visuale, il tempo interno continua a essere corretto

### Codice:

```tsx
import { useRef, useState } from 'react';

export default function Timer(): JSX.Element {
  const [displayTime, setDisplayTime] = useState<number>(0);

  const internalTime = useRef<number>(0);

  // Tipizzazione per NodeJS (esecuzione in ambiente Node/Vite)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = (): void => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      internalTime.current += 1;
      setDisplayTime(internalTime.current);
    }, 1000);
  };

  const stop = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = (): void => {
    stop();
    internalTime.current = 0;
    setDisplayTime(0);
  };

  return (
    <div>
      <p>Secondi: {displayTime}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Analisi:

- `displayTime` è lo **stato visibile** aggiornato con `setState`
- `internalTime.current` è il **dato interno persistente**
- `intervalRef.current` controlla la presenza di un timer attivo
- Il flusso è completamente **controllato** e **separato tra logica e visualizzazione**

---

## Conclusione del modulo


- `useRef` è molto più di un riferimento al DOM: è un contenitore mutabile
- Va usato quando si vuole conservare dati persistenti senza render
- È particolarmente utile in logiche asincrone e temporizzate
- È complementare a `useState`, non un suo sostituto

### Quando preferire `useRef`:

| Situazione                                  | Preferire |
|--------------------------------------------|-----------|
| Valore che cambia senza impattare sul DOM  | `useRef`  |
| Valore che deve causare re-render          | `useState` |
| Accesso diretto a un elemento del DOM      | `useRef`  |
| Tracciare dati in funzioni asincrone       | `useRef`  |
| Sincronizzare valore con l'interfaccia     | `useState` |

---




















---

## **Esercizio: Gestione avanzata di un Contatore Interattivo**

### **Obiettivo**

Creare un componente chiamato `ContatoreAvanzato` che:

1. Mostra un contatore visivo aggiornato ogni secondo
2. Permette all’utente di avviare, fermare e resettare il contatore
3. Permette di **aumentare o diminuire manualmente il valore** tramite pulsanti
4. Utilizza `useRef` per:
   - Tracciare il valore interno del contatore, anche se il rendering viene resettato
   - Conservare l’ID del timer per gestire correttamente `start` e `stop`
5. Utilizza `setState(prev => prev + 1)` per **evitare problemi con le closure**
6. Mostra in un log quante volte è stato premuto il pulsante “+1” e “-1” (senza causare re-render)

---

## **Struttura e vincoli**

### Stato:

- `displayValue: number` → valore mostrato visivamente (con `useState`)
- `manualIncrements: number` → numero di volte in cui l’utente ha cliccato su “+1” (con `useRef`)
- `manualDecrements: number` → numero di clic su “-1” (con `useRef`)
- `timerValue: number` → valore interno del contatore (con `useRef`)
- `intervalRef` → ID del timer (con `useRef`)

---

## **Requisiti funzionali**

- Il timer si avvia cliccando su “Start” e si ferma con “Stop”
- Il valore viene incrementato ogni secondo tramite `setInterval`
- I pulsanti “+1” e “-1” modificano il valore visualizzato, ma **non resettano il timer**
- Ogni clic su “+1” o “-1” aggiorna un contatore interno visualizzato a parte
- Il pulsante “Reset” azzera tutto (valore visuale e interni)

---

## **Schema visivo atteso**

```
Contatore: 12
Manuali: +1 (5)  /  -1 (2)

[ +1 ] [ -1 ] [ Start ] [ Stop ] [ Reset ]
```

---

## **Obiettivi didattici**

- Comprendere la differenza tra `useState` e `useRef`
- Evitare errori dovuti a closure errate con `setState(prev => ...)`
- Imparare a separare la gestione del valore visuale dalla logica interna
- Gestire in modo corretto e pulito il ciclo `start/stop/reset` di un timer

---

<br><br><br><br><br><br><br><br><br><br><br><br>









---

## **Componente `ContatoreAvanzato.tsx` con Tailwind CSS**

```tsx
import { useRef, useState } from 'react';

export default function ContatoreAvanzato(): JSX.Element {
  const [displayValue, setDisplayValue] = useState<number>(0);

  const timerValue = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const manualIncrements = useRef<number>(0);
  const manualDecrements = useRef<number>(0);

  const start = (): void => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      timerValue.current += 1;
      setDisplayValue(prev => prev + 1);
    }, 1000);
  };

  const stop = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = (): void => {
    stop();
    timerValue.current = 0;
    manualIncrements.current = 0;
    manualDecrements.current = 0;
    setDisplayValue(0);
  };

  const incrementa = (): void => {
    setDisplayValue(prev => prev + 1);
    manualIncrements.current += 1;
  };

  const decrementa = (): void => {
    setDisplayValue(prev => prev - 1);
    manualDecrements.current += 1;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contatore: {displayValue}</h2>

      <p className="text-gray-600 mb-6">
        Manuali: <span className="font-medium text-green-700">+1 ({manualIncrements.current})</span> /
        <span className="font-medium text-red-700 ml-2">-1 ({manualDecrements.current})</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={incrementa}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          +1
        </button>

        <button
          onClick={decrementa}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          -1
        </button>

        <button
          onClick={start}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Start
        </button>

        <button
          onClick={stop}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Stop
        </button>

        <button
          onClick={reset}
          className="col-span-2 sm:col-span-1 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
```

---

## Note sullo stile Tailwind usato

- `max-w-md`, `mx-auto`, `mt-10`, `p-6`: layout centrato e contenuto leggibile
- `bg-white`, `rounded-xl`, `shadow-md`: pannello pulito e moderno
- `grid-cols-2 sm:grid-cols-3`: griglia reattiva per i pulsanti
- Colori semanticamente coerenti: verde per `+1`, rosso per `-1`, blu/giallo per controlli, grigio per reset

---


















---

# **`useEffect` in React – Teoria, logica e funzionamento**

---

## **1. Cos'è `useEffect`**

`useEffect` è un Hook di React che permette a un componente **funzionale** di eseguire **effetti collaterali** (side effects) dopo che il componente è stato renderizzato.

### Per effetto collaterale si intende:
- Modificare qualcosa **fuori dal componente**
- Avviare operazioni **asincrone o temporizzate**
- **Interagire con il DOM reale**
- Comunicare con servizi esterni (API, WebSocket, localStorage, ecc.)

### Senza `useEffect`, queste operazioni non sono consentite **dentro il corpo del componente**, che deve restare **puro** (cioè determinato unicamente dai props e dallo stato).

---

## **2. Quando viene eseguito `useEffect`**

Il codice dentro `useEffect` viene eseguito:
- **Dopo che il componente è stato renderizzato nel DOM**
- Non durante il render, ma **al termine del commit**

Il comportamento dipende dal **secondo argomento opzionale**, chiamato **array delle dipendenze**.

---

## **3. Sintassi e significato dell’array delle dipendenze**

```tsx
useEffect(() => {
  // codice dell'effetto
}, [dipendenze]);
```

### 3.1 Nessun array (esecuzione ad ogni render)

```tsx
useEffect(() => {
  console.log("Eseguito dopo ogni render");
});
```

### 3.2 Array vuoto `[]` (esecuzione solo al montaggio)

```tsx
useEffect(() => {
  console.log("Eseguito solo al montaggio");
}, []);
```

Equivalente a `componentDidMount` nei class components.

### 3.3 Dipendenze specifiche (esecuzione quando cambiano)

```tsx
useEffect(() => {
  console.log("Eseguito ogni volta che count cambia");
}, [count]);
```

Equivalente a `componentDidUpdate` per quelle specifiche variabili.

---

## **4. Effetto + Cleanup: il ciclo completo**

Se un effetto ha bisogno di essere annullato (es. timer, listener, connessioni), si può restituire una funzione di "pulizia":

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("Tick");
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);
```

### Questo comporta:

1. Al **montaggio**, viene avviato l’intervallo
2. Al **reset del componente** o se cambia una dipendenza, React chiama la funzione di cleanup
3. Al **disfacimento (unmount)**, React chiama anche il cleanup

---

## **5. Il ciclo di vita implicito (confronto sintetico)**

| Lifecycle Classico             | `useEffect` Equivalente                      |
|-------------------------------|----------------------------------------------|
| `componentDidMount`           | `useEffect(() => { ... }, [])`              |
| `componentDidUpdate`          | `useEffect(() => { ... }, [var])`           |
| `componentWillUnmount`        | `return () => { ... }` da `useEffect`       |

---

## **6. Il problema della closure**

In JavaScript, quando si definisce una funzione, essa **"ricorda"** il contesto in cui è stata creata, incluse le variabili.

Nel caso di `useEffect`, questo comportamento può portare a usare **valori "vecchi" dello stato** se non si includono le dipendenze giuste.

### Esempio problematico:

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // sempre 0
  }, 1000);
}, []);
```

**Perché succede?**

Il valore di `count` dentro l’effetto è **quello al momento del primo render**, perché la funzione passata a `useEffect` è una closure definita in quel contesto. Non cambia nel tempo.

---

## **7. Soluzioni**

### Soluzione 1: includere `count` tra le dipendenze

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // corretto
  }, 1000);

  return () => clearInterval(id);
}, [count]);
```

### Soluzione 2: usare `useRef` per tenere il valore aggiornato

```tsx
const countRef = useRef(0);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // sempre aggiornato
  }, 1000);

  return () => clearInterval(id);
}, []);
```

---

## **8. Conclusione concettuale**

### `useEffect` è necessario quando:
- Si vuole interagire con il mondo esterno (timer, fetch, listener, storage)
- Si vuole reagire a un cambiamento di stato in modo controllato
- Si ha bisogno di logiche **che non possono stare dentro il rendering**

### Principali errori da evitare:
- Non inserire le dipendenze corrette
- Leggere variabili di stato "vecchie"
- Usare `useEffect` per gestire solo calcoli derivabili da `render` (meglio evitare)

---














---

## **ESEMPIO SEMPLICE – Contatore locale nel titolo della pagina**

### Obiettivo:
Aggiornare dinamicamente il titolo della pagina (`document.title`) ogni volta che il valore `count` cambia.

---

### `TitleUpdater.tsx`

```tsx
import { useEffect, useState } from 'react';

export default function TitleUpdater(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `Hai cliccato ${count} volte`;
  }, [count]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-xl font-semibold mb-4">Aggiorna Titolo</h1>
      <p className="text-lg mb-4">Contatore: {count}</p>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Aumenta
      </button>
    </div>
  );
}
```

---

### Cosa insegna:
- `useEffect` viene usato per **sincronizzare un effetto collaterale** (modifica al DOM) con una variabile di stato (`count`)
- `useState` con funzione updater (`prev => prev + 1`)
- Componente completamente tipizzato e stilizzato

---

## **ESEMPIO INTERMEDIO – Notifica al cambio di nome**

### Obiettivo:
Ogni volta che l’utente cambia il nome, mostrare un messaggio di conferma temporaneo.

---

### `NameChangeNotifier.tsx`

```tsx
import { useEffect, useState } from 'react';

export default function NameChangeNotifier(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (name.trim() === '') return;

    setMessage(`Il nome è stato aggiornato: ${name}`);

    const timeout = setTimeout(() => {
      setMessage('');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Modifica Nome</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="Scrivi un nome..."
      />
      {message && (
        <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
}
```

---

### Cosa insegna:
- `useEffect` con cleanup (`clearTimeout`) per **gestire un messaggio temporaneo**
- Esecuzione dell’effetto **condizionata dal valore** (`name`)
- Separazione tra stato applicativo (`name`) e stato UI (`message`)
- Applicazione reattiva controllata, senza effetti asincroni esterni

---

















---

## **Esercizio: Sincronizzazione tra due contatori**

---

### **Obiettivo**
Creare due contatori indipendenti. Usare `useEffect` per **sincronizzare uno dei due** ogni volta che l’altro raggiunge un multiplo di 5.

---

### **Descrizione**

L’interfaccia contiene:

- Due contatori:
  - **Contatore principale**
  - **Contatore sincronizzato**
- Due pulsanti:
  - “Incrementa principale”
  - “Reset contatori”
- Ogni volta che il contatore principale raggiunge un valore multiplo di 5, il contatore sincronizzato deve aggiornarsi **per riflettere lo stesso valore**
- Altrimenti, il contatore sincronizzato resta invariato

---

### **Requisiti tecnici**

- Usare `useState` per entrambi i contatori
- Usare `useEffect` per ascoltare i cambiamenti del **contatore principale**
- Nel `useEffect`, verificare se `count % 5 === 0`, e in quel caso aggiornare `countSync`
- Usare `reset` per azzerare entrambi

---

### **Comportamenti attesi**

| Azione                        | Risultato                                  |
|------------------------------|--------------------------------------------|
| Click su “Incrementa principale” | Aumenta solo `count`                       |
| Quando `count` è 5, 10, 15…   | `countSync` si aggiorna allo stesso valore |
| Click su “Reset”             | Entrambi tornano a 0                       |

---

### **Vincoli**

- `countSync` deve essere aggiornato **solo da `useEffect`**, mai direttamente
- Non usare `useRef` o `useEffect` multipli
- Non usare `useEffect` con array vuoto

---

### **Estensioni facoltative**

- Mostrare un messaggio “Sincronizzato” per 1 secondo (con secondo `useEffect`)
- Bloccare il pulsante “Incrementa” se `count` > 30

---

### **Conoscenze applicate**

- Comprensione di `useEffect` e dipendenze
- Controllo condizionale all’interno del lifecycle
- Separazione tra aggiornamenti diretti e derivati
- Esempio semplice ma concreto di sincronizzazione tra stati

---
















**Soluzione completa** dell’esercizio **“Sincronizzazione tra due contatori”**, realizzata in **React + TypeScript + Tailwind CSS**, con:

- Due contatori (`count`, `countSync`)
- Sincronizzazione tramite `useEffect`
- Messaggio temporaneo “Sincronizzato”
- Blocco del pulsante oltre i 30 click
- Struttura pulita e didatticamente coerente

---

## **Componente: `SyncCounter.tsx`**

```tsx
import { useEffect, useState } from 'react';

export default function SyncCounter(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [countSync, setCountSync] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  // Sincronizza countSync ogni 5 click
  useEffect(() => {
    if (count !== 0 && count % 5 === 0) {
      setCountSync(count);
      setShowMessage(true);
    }
  }, [count]);

  // Nasconde il messaggio dopo 1 secondo
  useEffect(() => {
    if (!showMessage) return;

    const timeout = setTimeout(() => {
      setShowMessage(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [showMessage]);

  // Gestione incremento
  const incrementa = () => {
    if (count < 30) {
      setCount(prev => prev + 1);
    }
  };

  // Reset totale
  const reset = () => {
    setCount(0);
    setCountSync(0);
    setShowMessage(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Contatori Sincronizzati
      </h1>

      <div className="mb-6 space-y-2">
        <p className="text-lg">
          Contatore principale: <span className="font-bold">{count}</span>
        </p>
        <p className="text-lg">
          Contatore sincronizzato: <span className="font-bold">{countSync}</span>
        </p>

        {showMessage && (
          <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded inline-block">
            Sincronizzato con {count}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={incrementa}
          disabled={count >= 30}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Incrementa
        </button>

        <button
          onClick={reset}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {count >= 30 && (
        <p className="mt-4 text-sm text-red-600 font-medium">
          Limite massimo raggiunto (30)
        </p>
      )}
    </div>
  );
}
```

---

## Spiegazione delle parti chiave

| Sezione                           | Descrizione |
|----------------------------------|-------------|
| `useEffect([count])`             | Sincronizza `countSync` ogni 5 incrementi e mostra il messaggio |
| `useEffect([showMessage])`       | Nasconde il messaggio “Sincronizzato” dopo 1 secondo |
| `incrementa`                     | Limita i click a 30 |
| `reset`                          | Azzera tutti gli stati |
| `disabled` e messaggio di blocco | Impediscono l’incremento oltre 30 e informano l’utente |

---

## Estensioni facoltative incluse

- Messaggio temporaneo gestito con `useEffect` e `setTimeout`
- Controllo della soglia massima per `count`
- Disabilitazione interattiva del pulsante con feedback visivo

---






























---

# **Pattern e Best Practice nella Gestione dello Stato Locale**

---

## **1. Stato minimo necessario**

### Teoria

> Lo stato di un componente dovrebbe contenere solo ciò che **non può essere derivato da props o altri valori già presenti nello stato stesso**.

Memorizzare informazioni ridondanti o calcolabili in modo derivato introduce:

- Rischi di incoerenza
- Aggiornamenti duplicati
- Logica di sincronizzazione superflua

### Esempio sbagliato

```tsx
const [tasks, setTasks] = useState([...]);
const [completedCount, setCompletedCount] = useState(0); // evitabile
```

`completedCount` può essere derivato da `tasks`:

```tsx
const completedCount = tasks.filter(t => t.completed).length;
```

### Conclusione

Evita di salvare nello stato:
- Dati computabili da altri stati o props
- Valori che derivano da trasformazioni di array
- Conteggi o aggregazioni

---

## **3. Evitare duplicazione di stato**

### Problema

Salvare due stati che rappresentano la **stessa fonte di verità**, anche se sotto forme diverse, può portare a bug logici.

### Esempio

```tsx
const [items, setItems] = useState<Item[]>([]);
const [selectedIds, setSelectedIds] = useState<number[]>([]);
```

Meglio usare:

```tsx
const [items, setItems] = useState<Item[]>([
  { id: 1, name: 'A', selected: false },
  ...
]);
```

oppure, se serve scalabilità, usare `useReducer`.

---

## **4. Gestione di array complessi**

### Contesto

Quando si gestisce una lista di elementi con interazione (checkbox, selezione multipla, modifica nome...), lo stato deve riflettere la **struttura completa** ma mantenere **immutabilità**.

### Esempio: toggle

```tsx
setItems(prev =>
  prev.map(item =>
    item.id === targetId ? { ...item, selected: !item.selected } : item
  )
);
```

### Ridenominazione

```tsx
setItems(prev =>
  prev.map(item =>
    item.id === targetId ? { ...item, name: newName } : item
  )
);
```

### Considerazioni

- Evitare mutazioni dirette
- Usare identificatori univoci (`id`)
- Manipolare array sempre con `map`, `filter`, `findIndex` evitando push/splice

---

## **5. Pattern per gestire form state**

### Problema classico

Molti sviluppatori dichiarano un `useState` per ogni campo:

```tsx
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
```

### Pattern consigliato

Gestire tutti i campi in **un unico oggetto**:

```tsx
const [formData, setFormData] = useState({
  nome: '',
  email: '',
});
```

Aggiornamento dinamico:

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};
```

HTML:

```tsx
<input name="nome" onChange={handleChange} value={formData.nome} />
<input name="email" onChange={handleChange} value={formData.email} />
```

### Vantaggi

- Scalabilità
- Meno codice ripetuto
- Accesso semplice a tutto il form con un solo stato

---

## **Esercizio Pratico – Gestione Utenti con Form Dinamico e Stato Locale Avanzato**

---

### **Obiettivo**

Realizzare un'applicazione React che consenta di:

- Inserire utenti tramite un form controllato
- Visualizzare l'elenco degli utenti inseriti
- Modificare dinamicamente i dati di ciascun utente
- Gestire tutto lo stato in modo strutturato e scalabile
- Utilizzare `useEffect` per **sincronizzare il titolo della pagina** in base al numero di utenti presenti

---

### **Requisiti tecnici**

- **`useState` con un oggetto** per gestire tutti i campi del form (nome, ruolo)
- **`useState` con un array di utenti**
- Aggiunta e modifica **nello stesso modulo**
- Identificazione univoca dell’utente (es. `id` numerico con `Date.now()`)
- Uso di **`useEffect`** per aggiornare il titolo della pagina quando cambia il numero di utenti

---

### **Stato**

#### 1. `formData: { nome: string, ruolo: string }`  
Contiene i dati del form in modifica o creazione.

#### 2. `utenti: { id: number, nome: string, ruolo: string }[]`  
Contiene l'elenco completo degli utenti salvati.

#### 3. `editingId: number | null`  
Indica se stai modificando un utente esistente. `null` significa "creazione nuova".

---

### **Comportamenti richiesti**

- Il form è **controllato**: ogni campo ha un `value` e un `onChange`
- Se si clicca “Modifica” su un utente, il form si popola con i dati da modificare
- Dopo ogni salvataggio (nuovo o modifica), il form si resetta
- L’array degli utenti viene **modificato in modo immutabile**:
  - `map` per aggiornamenti
  - `filter` per rimozioni (opzionale)
- Il titolo della pagina (`document.title`) viene aggiornato con `useEffect` per mostrare:  
  `"Utenti salvati: X"` dove X è il numero di utenti

---

### **Vincoli e buone pratiche da rispettare**

- Nessuna duplicazione di dati: il numero di utenti viene derivato da `utenti.length`
- Nessuna logica di trasformazione dentro `useState`
- Non usare `useRef` per i dati del form (sono parte dell’interfaccia visiva)
- `useEffect` deve essere **pulito**, con dipendenza corretta

---

### **Schema visivo**

```
[NOME _________] [RUOLO _________]   [Salva]

Lista Utenti:
- Ada Lovelace (Matematica) [Modifica]
- Alan Turing (Informatica) [Modifica]

[Titolo pagina: "Utenti salvati: 2"]
```

---



















- Stato unico per il form
- Stato array per gli utenti
- Modifica e salvataggio immutabile
- `useEffect` per aggiornare il titolo della pagina
- Tipizzazione forte
- Layout responsive e leggibile

---

## **Componente: `UserManager.tsx`**

```tsx
import { useEffect, useState } from 'react';

type Utente = {
  id: number;
  nome: string;
  ruolo: string;
};

type FormData = {
  nome: string;
  ruolo: string;
};

export default function UserManager(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({ nome: '', ruolo: '' });
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Aggiorna il titolo della pagina con il numero di utenti salvati
  useEffect(() => {
    document.title = `Utenti salvati: ${utenti.length}`;
  }, [utenti.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNome = formData.nome.trim();
    const trimmedRuolo = formData.ruolo.trim();
    if (trimmedNome === '' || trimmedRuolo === '') return;

    if (editingId !== null) {
      setUtenti(prev =>
        prev.map(utente =>
          utente.id === editingId
            ? { ...utente, nome: trimmedNome, ruolo: trimmedRuolo }
            : utente
        )
      );
    } else {
      const nuovoUtente: Utente = {
        id: Date.now(),
        nome: trimmedNome,
        ruolo: trimmedRuolo,
      };
      setUtenti(prev => [...prev, nuovoUtente]);
    }

    // Reset
    setFormData({ nome: '', ruolo: '' });
    setEditingId(null);
  };

  const handleEdit = (utente: Utente) => {
    setFormData({ nome: utente.nome, ruolo: utente.ruolo });
    setEditingId(utente.id);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Gestione Utenti</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <input
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div>
          <input
            name="ruolo"
            type="text"
            value={formData.ruolo}
            onChange={handleChange}
            placeholder="Ruolo"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? 'Modifica' : 'Salva'}
        </button>
      </form>

      <h2 className="text-lg font-medium mb-2 text-gray-700">Lista Utenti</h2>
      <ul className="space-y-2">
        {utenti.map(utente => (
          <li
            key={utente.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>
              {utente.nome} <span className="text-sm text-gray-500">({utente.ruolo})</span>
            </span>
            <button
              onClick={() => handleEdit(utente)}
              className="text-sm text-blue-600 hover:underline"
            >
              Modifica
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Comportamenti implementati

| Funzione                | Comportamento |
|-------------------------|---------------|
| `handleChange`          | Aggiorna il campo corrispondente usando `name` dinamico |
| `handleSubmit`          | Salva o modifica l’utente in modo immutabile |
| `handleEdit`            | Carica l’utente nel form per modificarlo |
| `useEffect`             | Aggiorna dinamicamente `document.title` al cambio di `utenti.length` |
| Stato unificato         | `formData` è un oggetto unico, scalabile e chiaro |
| Lista con `map`         | Visualizza ogni utente con modifica associata |

---






















## **Best practice nell'uso di Tailwind CSS nei progetti React**

Tailwind CSS è un framework utility-first che consente di costruire interfacce rapide e personalizzabili attraverso classi semantiche. L'approccio è radicalmente diverso dai CSS tradizionali, in quanto elimina la separazione tra logica e stile, portando le definizioni di stile direttamente nel markup. Questo offre grande velocità di prototipazione, ma può facilmente degenerare in codice difficile da manutenere se non vengono rispettate alcune regole architetturali.

### 1. **Separazione semantica tramite componenti React**

In un'applicazione React, ogni componente dovrebbe **incapsulare sia la logica che lo stile**. È buona norma creare componenti riutilizzabili con classi Tailwind già assegnate, evitando di replicare strutture complesse in più file. Si preferisce la creazione di **atomic components** o **design primitives** (es. `Button`, `Card`, `InputGroup`) già stilizzati.

### 2. **Gestione del layout tramite classi di spaziatura**

Tailwind offre un sistema completo di **margin (`m-`, `mt-`, `mb-`, ...) e padding (`p-`, `px-`, `py-`, ...)**, che consente di gestire il layout in modo predittivo e coerente. È fondamentale usarlo per garantire il corretto allineamento tra i componenti e mantenere un design consistente. Si raccomanda di **non usare div contenitori vuoti solo per applicare margini o padding**, ma di applicare la spaziatura direttamente sul componente logico responsabile del layout.

### 3. **Classi riutilizzabili con `clsx` o `classnames`**

Man mano che le classi Tailwind aumentano, è buona pratica utilizzare utility come `clsx` o `classnames` per comporre classi condizionali, evitando stringhe lunghe e difficili da leggere nel `className`. Questo è particolarmente utile per gestire **stati dinamici** (attivo, disabilitato, errore, tema, ecc.).

Esempio:

```tsx
import clsx from 'clsx';

const buttonClass = clsx(
  'px-4 py-2 rounded',
  isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
);
```

### 4. **Raccolta di pattern ripetuti in classi componibili (`@apply`)**

Quando si rileva la ripetizione di molte classi comuni, è possibile definire stili riutilizzabili in un file CSS con la direttiva `@apply`. Questo vale soprattutto per **componenti frequenti** (es. bottoni, badge, card).

Esempio:

```css
/* styles.css */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
```

```tsx
<button className="btn-primary">Salva</button>
```

Questo approccio migliora la leggibilità e facilita la centralizzazione degli stili base.

### 5. **Responsività e breakpoint espliciti**

Tailwind facilita l’adattamento responsivo con breakpoint come `sm:`, `md:`, `lg:`, `xl:`. È buona pratica **non duplicare interi blocchi JSX**, ma usare questi prefissi per modificare visibilità, spaziature o layout all'interno dello stesso nodo.

Esempio:

```tsx
<p className="text-sm md:text-base lg:text-lg">Testo adattivo</p>
```

### 6. **Gestione dei temi e varianti**

Per gestire dark mode o temi custom, Tailwind supporta `dark:` o sistemi personalizzati con `data-theme`. È importante impostare questi meccanismi fin dall’inizio del progetto se è prevista la personalizzazione del tema, per evitare refactoring complessi.

Esempio:

```tsx
<div className="bg-white text-black dark:bg-gray-800 dark:text-white">
  Contenuto
</div>
```

### 7. **Evitare codice non leggibile ("className hell")**

Sebbene Tailwind promuova un approccio dichiarativo, un uso eccessivo di classi inline può rendere il markup illeggibile. Le buone pratiche includono:

- Suddividere il componente in più sottocomponenti
- Utilizzare funzioni helper per composizioni complesse
- Definire classi astratte via `@apply` se il pattern è ripetuto

### 8. **Utilizzare plugin Tailwind ufficiali per funzionalità avanzate**

Tailwind è estensibile. Per gestione form, tipografia, animazioni, è buona prassi includere i plugin ufficiali (`@tailwindcss/forms`, `@tailwindcss/typography`, ecc.) per evitare soluzioni custom poco coerenti con l'ecosistema.

---





















































---

# **Esercizio Finale – Click Challenge a Tempo**

## **Obiettivo**

Realizzare un’applicazione React che simuli una sfida a tempo: ogni utente inserisce il proprio nome e ha 15 secondi per cliccare un pulsante il maggior numero di volte possibile. Al termine della sessione, il punteggio viene salvato in una classifica ordinata.

L’esercizio integra in modo coerente e applicato l’utilizzo di:

- `useState` per gestire lo stato dell’utente, il punteggio e la classifica
- `useEffect` per la gestione del countdown e la terminazione automatica della sessione
- `useRef` per salvare il riferimento al timer (`setInterval`) senza causare re-render

---

## **Funzionalità richieste**

1. **Inserimento del nome**
   - L’utente deve inserire il proprio nome in un campo di input
   - Dopo aver confermato, si accede alla schermata di gioco

2. **Schermata di gioco**
   - Visualizza:
     - il nome dell’utente
     - il tempo rimanente (15 secondi)
     - il numero di clic effettuati
     - un pulsante "Clicca!"
   - Il timer si aggiorna ogni secondo
   - L’utente può cliccare il pulsante finché il tempo non è esaurito
   - Il bottone viene disattivato allo scadere del tempo

3. **Classifica**
   - Al termine della sessione, il punteggio dell’utente viene salvato in una lista
   - La classifica mostra tutti gli utenti che hanno giocato, **ordinati per numero di clic in ordine decrescente**
   - È possibile ricominciare una nuova partita inserendo un altro nome

---

## **Requisiti tecnici**

### Stato gestito con `useState`
- `username` – nome dell’utente attuale
- `count` – numero di clic nella sessione
- `timeLeft` – secondi rimanenti
- `isPlaying` – booleano che indica se la sessione è attiva
- `scoreboard` – array di oggetti `{ name: string, score: number }`

### Valori gestiti con `useRef`
- `intervalRef` – ID del timer per poterlo annullare al termine

### Effetto con `useEffect`
- Avvio e decremento del countdown a partire da 15 secondi
- Arresto automatico del timer e aggiornamento della classifica al termine

---

## **Struttura del progetto suggerita**

```
src/
├── components/
│   ├── Game.tsx          → schermata di gioco
│   ├── Scoreboard.tsx    → classifica finale
│   └── UsernameForm.tsx  → form iniziale per inserire il nome
├── App.tsx
```

---

## **Vincoli**

- Nessuna libreria esterna (solo React)
- Tutti gli hook (`useState`, `useEffect`, `useRef`) devono essere usati in modo pertinente
- Niente localStorage o fetch: tutti i dati vivono solo nello stato

---

## **Obiettivi didattici**

- Consolidare il ciclo di vita di un componente e il flusso degli stati
- Imparare a gestire valori persistenti non reattivi con `useRef`
- Allenare la logica condizionale e la composizione di componenti con props
- Riflettere sull’organizzazione dello stato in funzione della UI e dell’esperienza utente

---

