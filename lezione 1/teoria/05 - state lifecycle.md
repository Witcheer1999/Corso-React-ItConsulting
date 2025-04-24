### Slide 1: Cos'è lo State in React?

* **Concetto Chiave:** Lo "state" (stato) rappresenta la **memoria** di un componente React.
* **A Cosa Serve:** Contiene dati che possono cambiare nel tempo a seguito di interazioni dell'utente, risposte di rete, o altri eventi.
* **Impatto:** Quando lo state di un componente cambia, React **ri-renderizza** (aggiorna) automaticamente quel componente e, potenzialmente, i suoi discendenti per riflettere i nuovi dati nell'interfaccia utente (UI).
* **Differenza dalle Props:** Le `props` sono dati passati da un componente genitore (sono "esterne" e generalmente immutabili *dal* componente che le riceve), mentre lo `state` è gestito internamente dal componente stesso.

---

### Slide 2: L'Hook `useState` - Il Fondamento dello State

* **Introduzione:** `useState` è un *Hook* di React che permette ai componenti funzionali di avere uno stato locale.
* **Sintassi Base:**
    ```javascript
    import React, { useState } from 'react';

    function Contatore() {
      // Dichiara una variabile di stato 'conteggio' e una funzione 'setConteggio' per aggiornarla.
      // 0 è il valore iniziale dello stato.
      const [conteggio, setConteggio] = useState(0);

      // ... resto del componente
    }
    ```
* **Come Funziona:**
    * `useState(valoreIniziale)`: Chiamata all'hook con l'argomento che sarà il valore dello stato al **primo render**.
    * Restituisce un array con due elementi:
        1.  `conteggio`: La variabile che contiene il **valore attuale** dello stato.
        2.  `setConteggio`: La **funzione** da chiamare per **aggiornare** il valore dello stato. Chiamare questa funzione *pianifica* un re-render.

---

### Slide 3: Cosa Causa un Re-render?

Un componente React si ri-renderizza principalmente per due motivi:

1.  **Aggiornamento dello State:** Quando si chiama la funzione `set` restituita da `useState` (es. `setConteggio(1)`) con un valore diverso da quello attuale (o sempre, nel caso di oggetti/array, se la referenza è nuova - vedi immutabilità). React pianifica un aggiornamento per quel componente.
2.  **Re-render del Genitore:** Quando un componente genitore si ri-renderizza, per impostazione predefinita, anche tutti i suoi componenti figli diretti vengono ri-renderizzati. Questo avviene indipendentemente dal fatto che le `props` passate ai figli siano cambiate o meno (esistono tecniche di ottimizzazione come `React.memo`, `useMemo`, `useCallback` per evitarlo se necessario).

* **Nota:** Il "re-render" in React non significa necessariamente una manipolazione costosa del DOM reale. React prima calcola il nuovo Virtual DOM, lo confronta con quello precedente (processo chiamato "Riconciliazione"), e aggiorna il DOM reale solo dove sono avvenute effettive differenze.

---

### Slide 4: Cosa Si Mantiene Durante un Re-render? Lo Stato!

* **Persistenza dello State:** La cosa più importante che React **mantiene** tra i re-render di una specifica istanza di componente è il suo **stato** (e i `ref`).
* **Come:** React associa lo stato non al codice della funzione in sé, ma all'**istanza** del componente nella sua specifica posizione nell'albero UI. Finché il componente rimane montato nello stesso "posto", React preserva il suo ultimo stato.
* **Esempio:**
    ```javascript
    function Esempio() {
      const [contatore, setContatore] = useState(0);
      console.log("Componente renderizzato, contatore:", contatore); // Mostra il valore attuale

      // ... JSX che usa 'contatore' e un bottone che chiama setContatore(contatore + 1)
    }
    ```
    Ogni volta che il bottone viene cliccato, `setContatore` viene chiamato, il componente si ri-renderizza, ma `contatore` avrà il valore aggiornato (1, poi 2, ecc.), non tornerà a 0.

---

### Slide 5: Cosa Si Perde (o Viene Ricreato) ad Ogni Re-render?

* **Variabili Locali:** Qualsiasi variabile o costante dichiarata direttamente all'interno del corpo della funzione del componente (che non sia uno stato o un ref) viene **ricreata da zero** ad ogni re-render.
    ```javascript
    function EsempioPerdita() {
      let variabileLocale = 0; // Questa viene reimpostata a 0 ad ogni render!
      const [stato, setStato] = useState(0);

      console.log("Variabile Locale:", variabileLocale); // Sempre 0
      console.log("Stato:", stato); // Valore persistente

      const handleClick = () => {
        variabileLocale += 1; // Modifica inutile, verrà persa al prossimo render
        setStato(stato + 1); // Questo causa il re-render e preserva il nuovo valore di 'stato'
      };
      // ...
    }
    ```
* **Funzioni Interne:** Anche le funzioni definite all'interno del componente (come `handleClick` nell'esempio sopra) vengono tecnicamente **ricreate** ad ogni render. Questo di solito non è un problema, ma è importante saperlo per ottimizzazioni (es. `useCallback`) o quando si passano funzioni come `props` o nelle dipendenze di `useEffect`.

---

### Slide 6: Il Problema degli Aggiornamenti Asincroni e "Stale State"

* **Asincronicità:** Le chiamate alla funzione `set` dello stato (es. `setConteggio`) **non aggiornano lo stato immediatamente**. React le "mette in coda" (batching) per ottimizzare le performance ed esegue gli aggiornamenti in un momento successivo (di solito prima del prossimo paint del browser).
* **Stale State:** Se tenti di leggere la variabile di stato *subito dopo* aver chiamato la funzione `set` nella stessa esecuzione di codice, otterrai il valore *vecchio* (stale), non quello appena impostato.
* **Problema Comune:** Aggiornare lo stato più volte basandosi sul valore corrente letto dalla variabile può portare a errori.
    ```javascript
    function AggiornamentoErrato() {
      const [contatore, setContatore] = useState(0);

      const incrementaDiTre = () => {
        // !!! PROBLEMA !!!
        // Tutte e tre le chiamate leggono lo stesso valore di 'contatore'
        // dell'istante in cui 'incrementaDiTre' è stata chiamata.
        // Se contatore è 0, tutte e tre chiameranno setContatore(0 + 1).
        setContatore(contatore + 1);
        setContatore(contatore + 1);
        setContatore(contatore + 1);
        // Risultato: il contatore incrementerà solo di 1, non di 3!
      };
      // ...
    }
    ```

---

### Slide 7: La Soluzione: Aggiornamenti Funzionali con `prev`

* **Forma Funzionale:** Per garantire che un aggiornamento di stato si basi sul valore **più recente** (anche rispetto ad altri aggiornamenti in coda nella stessa batch), si può passare una **funzione** alla funzione `set`.
* **Sintassi:** `setStato(prevState => newState)`
* **Come Funziona:** React chiamerà questa funzione passandole lo stato **attuale garantito** (`prevState`) al momento dell'applicazione dell'aggiornamento. Il valore restituito dalla funzione diventerà il nuovo stato.
* **Esempio Corretto:**
    ```javascript
    function AggiornamentoCorretto() {
      const [contatore, setContatore] = useState(0);

      const incrementaDiTre = () => {
        // Forma funzionale: sicura per aggiornamenti multipli
        setContatore(prevContatore => prevContatore + 1);
        setContatore(prevContatore => prevContatore + 1);
        setContatore(prevContatore => prevContatore + 1);
        // Ora funziona: React mette in coda 3 funzioni.
        // 1. Esegue la prima: prev=0 => restituisce 1. Stato diventa 1.
        // 2. Esegue la seconda: prev=1 => restituisce 2. Stato diventa 2.
        // 3. Esegue la terza: prev=2 => restituisce 3. Stato diventa 3.
      };
      // ...
    }
    ```
* **Quando Usarla:** **Sempre** quando il nuovo stato dipende direttamente dal valore precedente.

---

### Slide 8: Funzioni che "Ripartono" e Implicazioni

* **Riesecuzione del Corpo:** Come detto, ad ogni re-render, l'intera funzione del componente viene eseguita nuovamente da capo a fondo.
* **Cosa Significa:**
    * Le variabili locali vengono reinizializzate.
    * Le funzioni definite all'interno vengono ricreate (hanno una nuova referenza in memoria).
    * Il JSX viene ricalcolato (questo è il Virtual DOM).
* **Implicazioni:**
    * **Performance:** Ricreare funzioni complesse o passate come props a componenti ottimizzati (`React.memo`) può vanificare l'ottimizzazione. Soluzione: `useCallback`.
    * **Logica Effetti (`useEffect`):** Se una funzione ricreata è nella lista delle dipendenze di `useEffect`, l'effetto verrà rieseguito ad ogni render, potenzialmente causando cicli infiniti o chiamate API superflue. Soluzione: `useCallback` o rivedere le dipendenze.
    * **Calcoli Costosi:** Se fai calcoli pesanti direttamente nel corpo della funzione, verranno ripetuti ad ogni render. Soluzione: `useMemo`.

---

### Slide 9: Best Practice - Immutabilità dello Stato

* **Regola d'Oro:** **MAI** modificare lo stato (specialmente oggetti o array) direttamente. Tratta lo stato come se fosse immutabile.
* **Perché?** React determina se ri-renderizzare confrontando il vecchio stato con il nuovo. Per oggetti e array, confronta le **referenze** in memoria. Se modifichi direttamente l'oggetto/array esistente, la referenza non cambia, e React potrebbe non "vedere" l'aggiornamento, saltando il re-render.
* **Come Fare (Esempi):**
    * **Array:**
        ```javascript
        // SBAGLIATO: Modifica diretta (mutazione)
        // lista.push(nuovoElemento); setLista(lista);

        // GIUSTO: Creare un nuovo array
        setLista([...lista, nuovoElemento]); // Aggiungere elemento
        setLista(lista.filter(item => item.id !== idDaRimuovere)); // Rimuovere
        setLista(lista.map(item => item.id === idDaModificare ? {...item, valore: nuovoValore} : item)); // Modificare
        ```
    * **Oggetti:**
        ```javascript
        // SBAGLIATO: Modifica diretta
        // utente.eta = utente.eta + 1; setUtente(utente);

        // GIUSTO: Creare un nuovo oggetto
        setUtente({...utente, eta: utente.eta + 1}); // Aggiornare una proprietà
        setUtente({...utente, indirizzo: {...utente.indirizzo, citta: 'Nuova Citta'}}); // Proprietà nidificata
        ```

---

### Slide 10: Best Practice - Mantenere lo State Locale / Lifting State Up

* **Località:** Inizia sempre dichiarando lo stato nel componente più specifico (più "in basso" nell'albero) che lo utilizza. Non mettere tutto nello stato del componente radice dell'applicazione se non serve.
* **Condivisione tra Fratelli:** Se due componenti "fratelli" (siblings) hanno bisogno di accedere o modificare lo stesso stato, non possono passarselo direttamente.
* **"Lifting State Up" (Sollevare lo Stato):** La soluzione è trovare il loro **antenato comune più vicino** nell'albero dei componenti.
    1.  Sposta lo stato (`useState`) e le funzioni per modificarlo in quell'antenato comune.
    2.  Passa il valore dello stato come `props` ai figli che ne hanno bisogno per leggerlo.
    3.  Passa le funzioni di modifica come `props` ai figli che devono poter aggiornare lo stato.

---

### Slide 11: Best Practice - Evitare State Ridondante

* **Non Duplicare Informazioni:** Se un dato può essere **calcolato** al momento del render a partire dalle `props` o da un altro pezzo di stato esistente, **non** metterlo in una variabile di stato separata.
* **Perché:** Mantenere stati sincronizzati è complesso e fonte di bug. Calcolare al momento è più semplice e meno prono a errori.
* **Esempio:**
    ```javascript
    function ProfiloUtente({ utente }) { // utente è una prop: { nome: 'Mario', cognome: 'Rossi' }
      // SBAGLIATO: Stato ridondante
      // const [nomeCompleto, setNomeCompleto] = useState('');
      // useEffect(() => {
      //   setNomeCompleto(`${utente.nome} ${utente.cognome}`);
      // }, [utente.nome, utente.cognome]); // Complicato!

      // GIUSTO: Calcolare durante il render
      const nomeCompleto = `${utente.nome} ${utente.cognome}`;

      return <div>{nomeCompleto}</div>;
    }
    ```
* **Quando è OK:** A volte *potrebbe* essere necessario "copiare" una prop nello stato iniziale, ad esempio, se vuoi permettere all'utente di modificare un valore che *inizialmente* proviene dalle props (come in un campo di form pre-compilato).

---

### Slide 12: Ricapitolando - Punti Chiave

* Lo **State** è la memoria interna e mutevole di un componente.
* `useState` è l'Hook per aggiungere state ai componenti funzionali.
* Chiamare la funzione `set` restituita da `useState` **pianifica un re-render**.
* Lo **State persiste** tra i re-render della stessa istanza del componente.
* Le **variabili locali** e le **funzioni interne** vengono **ricreate** ad ogni re-render.
* Gli aggiornamenti di stato sono **asincroni**; usa la **forma funzionale (`prev => ...`)** quando il nuovo stato dipende dal precedente.
* Pratica l'**immutabilità**: crea sempre nuovi array/oggetti invece di modificare quelli esistenti.
* Mantieni lo **state locale** quando possibile; usa il **lifting state up** per condividerlo.
* **Evita state ridondante**; calcola i dati derivati durante il render.

---

























---

# Cos’è Flux?

## 1. Il problema di partenza

In un'app React semplice, possiamo gestire lo stato locale con `useState`, e va bene finché:

- L’app è piccola
- Lo stato è semplice e non condiviso

Ma quando i componenti diventano molti e devono **comunicare tra loro**, diventa difficile:

- Sapere da dove viene un certo dato
- Gestire cambiamenti complessi
- Mantenere ordine e prevedibilità

Serve un **modo strutturato per far fluire i dati**, in modo chiaro, controllato e centralizzato.

---

## 2. Flux: l’idea base

Flux è un **modello architetturale** creato da Facebook per gestire il **flusso dei dati in React** in maniera **unidirezionale** (sempre in una sola direzione, mai incrociata).

### Flusso dei dati in Flux:

```
→ Action
   → Dispatcher
      → Store
         → View (Componenti React)
```

### Tradotto:

1. **L’utente interagisce con la UI** (clicca, scrive, ecc.)
2. L’interazione genera una **action** (un evento descritto da un oggetto)
3. La **dispatcher** consegna l’action allo **store**
4. Lo **store aggiorna lo stato**
5. I componenti **React leggono lo stato aggiornato** e si ri-renderizzano

---

## 3. Esempio narrativo semplice

Pensa a un negozio:

- L’utente fa un ordine → `action`
- Il commesso riceve e smista gli ordini → `dispatcher`
- Il magazzino aggiorna le scorte → `store`
- Il sito mostra la disponibilità aggiornata → `view`

---

# Cos’è Redux?

Redux è una **libreria JavaScript** che implementa i concetti di Flux in modo semplice, coerente e adatto a React.

Redux toglie la parte del "dispatcher" e la semplifica. Ti rimangono **tre elementi chiave**:

### 1. **Store** – Dove vive lo stato dell’app  
### 2. **Action** – Cosa è successo  
### 3. **Reducer** – Come cambia lo stato in base a cosa è successo  

---

# Come funziona Redux in React?

### Immagina questo ciclo:

```
Componenti → dispatch(action) → reducer → nuovo stato → UI aggiornata
```

### Spiegazione:

1. Il componente React **non modifica lo stato direttamente**
2. Invia un evento chiamato `action`
3. Redux prende l’azione e la passa a una funzione chiamata `reducer`
4. Il `reducer` calcola il **nuovo stato** dell’app
5. Lo **store** salva il nuovo stato
6. React **rilegge lo stato aggiornato** e si aggiorna in automatico

---

# I singoli elementi in dettaglio

## 1. **Store**

- È un oggetto che contiene **tutto lo stato globale**
- Creato con `createStore(reducer)`
- È unico: c’è **un solo store per tutta l’app**
- Viene reso disponibile ai componenti tramite `<Provider>`

---

## 2. **Action**

- È un **oggetto** che descrive cosa è accaduto
- Ha una `type` obbligatoria e, se serve, dei dati (`payload`)

```ts
{
  type: 'AGGIUNGI_TODO',
  payload: { testo: 'Comprare il pane' }
}
```

---

## 3. **Reducer**

- È una funzione che:
  - Riceve **lo stato attuale**
  - Riceve **l’action**
  - Restituisce **il nuovo stato**

```ts
function reducer(state, action) {
  switch (action.type) {
    case 'AGGIUNGI_TODO':
      return [...state, action.payload];
    default:
      return state;
  }
}
```

> Importante: il `reducer` **non modifica direttamente** lo stato originale, ma ne crea una copia aggiornata.

---

## 4. **Dispatch**

- È la funzione che invia l’action
- È come dire: “è successo questo, aggiornate lo stato”

```tsx
dispatch({ type: 'AGGIUNGI_TODO', payload: { testo: 'Esempio' } });
```

---

## Come si usa Redux in un'app React?

### 1. Crea il reducer

```ts
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENTA':
      return state + 1;
    default:
      return state;
  }
}
```

### 2. Crea lo store

```ts
import { createStore } from 'redux';
const store = createStore(counterReducer);
```

### 3. Rendi lo store disponibile all’app

```tsx
import { Provider } from 'react-redux';

<Provider store={store}>
  <App />
</Provider>
```

### 4. Nei componenti React

#### Per leggere lo stato:

```tsx
const contatore = useSelector((state) => state);
```

#### Per inviare un’azione:

```tsx
const dispatch = useDispatch();
dispatch({ type: 'INCREMENTA' });
```

---

# Struttura consigliata per progetti reali

```
/redux/
├── store.ts          → creazione dello store
├── actions.ts        → definizione delle actions
├── reducer.ts        → definizione dei reducer
/components/
├── Contatore.tsx     → componenti React che usano lo stato globale
App.tsx
```

---

## Vantaggi di Redux

- Stato centralizzato: **tutti i dati in un solo punto**
- Flusso dati unidirezionale: **facile da tracciare e da testare**
- Ottimo per app complesse: **dashboard, editor, e-commerce**

---

## Quando usarlo

- App complesse con **molti componenti che condividono stato**
- Stato che deve **restare sincronizzato** tra più sezioni
- Necessità di **debug visivo** (Redux DevTools)

---

## Quando evitare Redux

- In app semplici dove basta `useState` o `useContext`
- Se il sovraccarico architetturale non è giustificato

---

















































---

# Obiettivo del progetto

Creeremo un **contatore** globale:

- Visualizza il numero attuale
- Può essere incrementato o decrementato
- Lo stato è gestito da Redux puro, senza Toolkit

---

# 1. Installazione delle librerie

Assumendo che tu abbia già un progetto creato con **Vite + React + TypeScript**, installa Redux e React-Redux:

```bash
npm install redux react-redux
```

---

# 2. Struttura del progetto

```
/src
├── /redux
│   ├── store.ts
│   └── counterReducer.ts
├── App.tsx
└── main.tsx
```

---

# 3. File `counterReducer.ts`

```ts
// Questo reducer gestisce lo stato del contatore

// Stato iniziale
const initialState = 0;

// Il reducer è una funzione pura che riceve stato e azione
export default function counterReducer(state = initialState, action: { type: string }) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state; // Se l'azione non è riconosciuta, restituisco lo stato invariato
  }
}
```

---

# 4. File `store.ts`

```ts
import { createStore } from 'redux';
import counterReducer from './counterReducer';

// Creo lo store passando il reducer
const store = createStore(counterReducer);

export default store;
```

---

# 5. File `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importo il Provider per fornire lo store a tutta l'app
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Rendo disponibile lo store all'intera applicazione */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

# 6. File `App.tsx`

```tsx
import { useDispatch, useSelector } from 'react-redux';

export default function App() {
  // Estraggo il valore dello stato globale (contatore)
  const count = useSelector((state: number) => state);

  // Ottengo la funzione dispatch per inviare azioni
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Contatore con Redux</h1>

      {/* Visualizzo il valore dello stato */}
      <h2>{count}</h2>

      {/* Invio azioni allo store cliccando i bottoni */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Incrementa</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrementa</button>
    </div>
  );
}
```

---

# Spiegazione del ciclo Redux

1. Il componente React (`App`) legge lo stato globale con `useSelector`
2. Cliccando un bottone, invia un'`action` (`{ type: 'INCREMENT' }`) usando `dispatch`
3. Lo store passa questa action al `counterReducer`
4. Il `reducer` restituisce il nuovo stato
5. Lo store aggiorna e notifica React
6. React re-renderizza con il nuovo valore

---



















































Redux Toolkit (RTK) è la libreria ufficiale di Redux per **semplificare** la gestione dello store e dei reducer.  
RTK riduce il boilerplate, automatizza la creazione di azioni e offre strumenti migliori per lo sviluppo.

---

# 1. Installazione di Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

> Nota: se hai già installato `redux` e `react-redux`, puoi aggiungere solo `@reduxjs/toolkit`.

---

# 2. Nuova struttura del progetto

```
/src
├── /redux
│   ├── store.ts
│   └── counterSlice.ts
├── App.tsx
└── main.tsx
```

---

# 3. File `counterSlice.ts` (nuovo concetto: Slice)

```ts
import { createSlice } from '@reduxjs/toolkit';

// Stato iniziale
const initialState = 0;

// Un "slice" contiene: nome, stato iniziale, reducer, e action create automaticamente
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1
  }
});

// Esporto le action pronte all’uso
export const { increment, decrement } = counterSlice.actions;

// Esporto il reducer per usarlo nello store
export default counterSlice.reducer;
```

 **Differenze principali rispetto a Redux puro:**

| Redux puro               | Redux Toolkit                          |
|--------------------------|-----------------------------------------|
| Azioni scritte a mano    | Azioni create automaticamente (`createSlice`) |
| `switch/case` nei reducer | Funzioni dedicate in un oggetto `reducers` |
| `dispatch({ type: 'X' })` | `dispatch(increment())`                |
| Stato immutabile manuale | Immer gestisce l’immutabilità dietro le quinte |

---

# 4. File `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

// Creo lo store con Redux Toolkit
const store = configureStore({
  reducer: counterReducer // posso anche passare oggetti più complessi con più slice
});

export default store;

// Tipo inferito per lo stato globale
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

# 5. File `main.tsx`

Identico a prima, perché `react-redux` è lo stesso:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

# 6. File `App.tsx`

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from './redux/counterSlice';
import type { RootState, AppDispatch } from './redux/store';

export default function App() {
  // Estraggo lo stato dal Redux store
  const count = useSelector((state: RootState) => state);

  // Ottengo la funzione dispatch
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Contatore con Redux Toolkit</h1>

      <h2>{count}</h2>

      {/* Uso le action create automaticamente da createSlice */}
      <button onClick={() => dispatch(increment())}>Incrementa</button>
      <button onClick={() => dispatch(decrement())}>Decrementa</button>
    </div>
  );
}
```

---

#  Confronto visivo finale

| Cosa                  | Redux puro                            | Redux Toolkit                            |
|-----------------------|----------------------------------------|-------------------------------------------|
| `createStore`         | Sì                                     | ❌ sostituito da `configureStore`          |
| `createSlice`         | ❌ non esiste                          | ✅ genera action + reducer                 |
| Azioni manuali        | `dispatch({ type: 'INCREMENT' })`      | `dispatch(increment())`                   |
| Reducer               | switch / return nuovo stato            | funzioni pure con mutazione implicita     |
| Boilerplate           | elevato                                | minimo                                    |

---

# Conclusione

Redux Toolkit semplifica e struttura il lavoro:

- Riduce il codice scritto a mano
- Migliora l’ergonomia di sviluppo
- Rende più sicura la gestione dello stato (immutabilità garantita)











































---

# Best practice con Redux Toolkit

1. **Organizza lo stato in slice** (uno per dominio funzionale)
2. **Usa `configureStore`** per creare lo store
3. **Evita `createStore`**, `combineReducers` manuale e azioni scritte a mano
4. **Usa `createSlice`** per definire stato, reducer e action in un unico punto
5. **Tipizza lo stato con `RootState` e `AppDispatch`**
6. **Isola la logica Redux dalla UI**

---

# Esempio reale: App con due slice

Creeremo un'applicazione con:
- Uno slice `counterSlice` per un contatore
- Uno slice `userSlice` per un nome utente

---

## 1. Struttura del progetto

```
src/
├── App.tsx
├── main.tsx
└── redux/
    ├── store.ts
    ├── counterSlice.ts
    └── userSlice.ts
```

---

## redux/counterSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit';

// Stato iniziale del contatore
const initialState = 0;

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    reset: () => 0
  }
});

// Esporto le action generate automaticamente
export const { increment, decrement, reset } = counterSlice.actions;

// Esporto il reducer per lo store
export default counterSlice.reducer;
```

---

## redux/userSlice.ts

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Stato iniziale: una stringa vuota per il nome
const initialState = '';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => action.payload,
    clearName: () => ''
  }
});

export const { setName, clearName } = userSlice.actions;
export default userSlice.reducer;
```

---

## redux/store.ts

```ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import userReducer from './userSlice';

// Creo lo store combinando i reducer tramite RTK
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  }
});

// Tipi per TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## main.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## App.tsx

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { increment, decrement, reset } from './redux/counterSlice';
import { setName, clearName } from './redux/userSlice';
import { useState } from 'react';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector((state: RootState) => state.counter);
  const user = useSelector((state: RootState) => state.user);

  const [inputName, setInputName] = useState('');

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Redux Toolkit – Esempio con più Slice</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Contatore</h2>
        <p>Valore: {count}</p>
        <button onClick={() => dispatch(increment())}>Incrementa</button>
        <button onClick={() => dispatch(decrement())}>Decrementa</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </section>

      <section>
        <h2>Utente</h2>
        <p>Nome utente: {user || '(nessun nome)'}</p>

        <input
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Inserisci il nome"
        />
        <button onClick={() => dispatch(setName(inputName))}>Imposta nome</button>
        <button onClick={() => dispatch(clearName())}>Cancella nome</button>
      </section>
    </div>
  );
}
```

---

## Riepilogo delle differenze rispetto a Redux “manuale”

| Aspetto                         | Redux "classico"                       | Redux Toolkit                             |
|----------------------------------|----------------------------------------|--------------------------------------------|
| Azioni scritte a mano           | Sì                                     | No: generate da `createSlice`              |
| `switch` nei reducer            | Sì                                     | No: funzioni nominali                      |
| `createStore`                   | Sì                                     | No: usa `configureStore`                   |
| Gestione di più slice           | `combineReducers` manuale              | automatica nel `configureStore`            |
| Mutabilità del `state`          | vietata manualmente                    | gestita in automatico con Immer            |

---

##  Best practice da seguire

1. Un file `slice` per ogni dominio (user, auth, post, cart, ecc.)
2. Mantenere i tipi locali al `slice` quando possibile
3. Esportare solo ciò che serve: `reducer` e `actions`
4. Includere la logica Redux solo nel modulo Redux (evita di duplicarla nei componenti)













































Perfetto. Di seguito trovi una spiegazione dettagliata su cosa sia il `PayloadAction` in Redux Toolkit e una raccolta di **diversi esempi di slice** (con codice commentato) che mostrano **strutture e utilizzi differenti**, mantenendo il focus su funzioni sincrone e pratiche comuni in contesti reali.

---

# Cos'è `PayloadAction` in Redux Toolkit

Quando utilizzi `createSlice` in Redux Toolkit, puoi definire i reducer che accettano un parametro `action`. Questo oggetto rappresenta l’azione inviata tramite `dispatch`.

Il tipo `PayloadAction<T>` è fornito da Redux Toolkit e ti permette di:

- Definire il **tipo del contenuto** che l’azione trasporta (`payload`)
- Scrivere reducer **tipizzati e sicuri**

### Esempio base:

```ts
import { PayloadAction } from '@reduxjs/toolkit';

type Stato = string;

const initialState: Stato = '';

const slice = createSlice({
  name: 'utente',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      return action.payload;
    }
  }
});
```

> Qui `PayloadAction<string>` specifica che il `payload` della `setName` sarà una stringa.

---

# Esempi di Slice con strutture e funzioni diverse

---

## 1. Slice che gestisce un oggetto complesso (`userSlice`)

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  email: string;
  isAdmin: boolean;
};

const initialState: UserState = {
  name: '',
  email: '',
  isAdmin: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    toggleAdmin: (state) => {
      state.isAdmin = !state.isAdmin;
    },
    resetUser: () => initialState
  }
});

export const { setUser, toggleAdmin, resetUser } = userSlice.actions;
export default userSlice.reducer;
```

### Caratteristiche:
- Il `payload` è un oggetto complesso
- Uso di **mutazione apparente** grazie a Immer
- Stato resettable

---

## 2. Slice che gestisce una lista (`todoSlice`)

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Todo = {
  id: number;
  testo: string;
  completato: boolean;
};

const initialState: Todo[] = [];

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    aggiungiTodo: (state, action: PayloadAction<string>) => {
      state.push({
        id: Date.now(),
        testo: action.payload,
        completato: false
      });
    },
    rimuoviTodo: (state, action: PayloadAction<number>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    toggleCompletato: (state, action: PayloadAction<number>) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completato = !todo.completato;
      }
    }
  }
});

export const { aggiungiTodo, rimuoviTodo, toggleCompletato } = todoSlice.actions;
export default todoSlice.reducer;
```

### Caratteristiche:
- Stato è un array di oggetti
- Inserimento, rimozione e modifica tramite ID
- Uso di `find` e `filter`

---

## 3. Slice con stato booleano (`modalSlice`)

```ts
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: {
    apri: () => true,
    chiudi: () => false,
    toggle: (state) => !state
  }
});

export const { apri, chiudi, toggle } = modalSlice.actions;
export default modalSlice.reducer;
```

### Caratteristiche:
- Stato semplice: `true | false`
- Nessun `payload`
- Logica centrata sulla visibilità di una modale

---

## 5. Slice numerico (`counterSlice`)

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    incrementa: (state) => state + 1,
    decrementa: (state) => state - 1,
    impostaA: (state, action: PayloadAction<number>) => action.payload
  }
});

export const { incrementa, decrementa, impostaA } = counterSlice.actions;
export default counterSlice.reducer;
```

### Caratteristiche:
- Stato numerico semplice
- Aggiornamento con `payload` intero
- Molto adatto per contatori, punteggi, ecc.

---

# Conclusione

Redux Toolkit permette di costruire reducer chiari e modulari, grazie a:

- `createSlice`: racchiude stato, action e reducer
- `PayloadAction<T>`: tipizza i dati che transiteranno nella `action.payload`
- Immer: ti consente di scrivere reducer mutabili senza rompere l’immutabilità

### Quando scegliere una struttura piuttosto che un'altra:

| Tipo di slice       | Quando usarla                                                 |
|---------------------|---------------------------------------------------------------|
| Numerico            | Contatori, punteggi, timer                                     |
| Stringa o booleano  | Modal, messaggi di stato, flag di caricamento                  |
| Oggetto complesso   | Profilo utente, impostazioni, oggetti singoli                  |
| Array               | Liste di task, commenti, prodotti, notifiche                   |







































---

## Obiettivo

- Aggiunta, rimozione e completamento di task
- Stato gestito globalmente tramite Redux Toolkit
- Componenti separati per `App`, `Form`, `List`, `Item`

---

## Struttura dei file

```
src/
├── components/
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── redux/
│   ├── store.ts
│   └── todoSlice.ts
├── App.tsx
├── main.tsx
└── index.css  // contiene Tailwind
```

---

## Configura Redux

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 1. Configura Tailwind (se non già fatto)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: { extend: {} },
plugins: [],
```

### index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. `todoSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const initialState: Todo[] = [];

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

---

## 3. `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## 5. `App.tsx`

```tsx
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}
```

---

## 6. `TodoForm.tsx`

```tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todoSlice';
import { AppDispatch } from '../redux/store';

export default function TodoForm() {
  const [text, setText] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() !== '') {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="border border-gray-300 rounded px-3 py-2 w-full"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Aggiungi una nuova attività"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
        Aggiungi
      </button>
    </form>
  );
}
```

---

## 7. `TodoList.tsx`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TodoItem from './TodoItem';

export default function TodoList() {
  const todos = useSelector((state: RootState) => state.todos);

  if (todos.length === 0) {
    return <p className="text-gray-500">Nessuna attività presente.</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## 8. `TodoItem.tsx`

```tsx
import { Todo, toggleTodo, deleteTodo } from '../redux/todoSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <li className="flex justify-between items-center p-2 border rounded">
      <span
        onClick={() => dispatch(toggleTodo(todo.id))}
        className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => dispatch(deleteTodo(todo.id))}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Elimina
      </button>
    </li>
  );
}
```

---
































































---

### Esercizio — Gestione di una lista di appunti

Crea una semplice applicazione React con TypeScript e Redux Toolkit, strutturata su più componenti, che consenta all’utente di:

- Aggiungere un **appunto testuale**
- Eliminare un appunto
- Segnare un appunto come **“importante”**
- Visualizzare un messaggio se non sono presenti appunti

---

## Obiettivi

- Usare Redux Toolkit per la gestione dello stato globale
- Organizzare il progetto in più **componenti riutilizzabili**
- Utilizzare **Tailwind CSS** per lo stile
- Lavorare solo con funzioni **sincrone**

---

## Requisiti del progetto

### 1. Componenti da creare

- `App.tsx` – layout principale
- `NoteForm.tsx` – campo input + pulsante per inserire un nuovo appunto
- `NoteList.tsx` – elenco degli appunti salvati
- `NoteItem.tsx` – singolo appunto con due azioni: segna come importante / elimina

### 2. Stato globale con Redux Toolkit

- Slice `noteSlice.ts` con stato iniziale `[]`
- Ogni **nota** è un oggetto con:
  - `id`: numero
  - `testo`: stringa
  - `importante`: boolean

---

## Funzionalità richieste

- Inserire un appunto testuale non vuoto
- Visualizzare la lista completa degli appunti
- Cliccare su un bottone per contrassegnare un appunto come "importante"
- Mostrare un bottone per eliminare l’appunto
- Se non ci sono appunti, mostrare il messaggio: “Nessun appunto presente”

---

## Stile (Tailwind)

- Ogni appunto deve essere racchiuso in un box con bordo
- Gli appunti contrassegnati come importanti devono avere un colore evidenziato (es. giallo chiaro)
- Il form deve avere input + bottone con stile coerente

---

## Suggerimenti tecnici

- Tipizza correttamente l’oggetto `Nota`
- Utilizza `PayloadAction` per passare `string` o `number` alle azioni
- Usa `useDispatch` e `useSelector` nei componenti per interagire con lo store
- Suddividi la logica tra slice e componenti

---

## Consegna

Il progetto deve contenere:

- Almeno 3 file di componenti (`NoteForm`, `NoteList`, `NoteItem`)
- Una cartella `redux/` con `store.ts` e `noteSlice.ts`
- Tipizzazione completa e funzionante
- Layout chiaro con Tailwind

































































---

## 1. Tipologia di dati

```ts
// redux/types.ts
export type Nota = {
  id: number;
  testo: string;
  importante: boolean;
};
```

---

## 2. Slice `noteSlice.ts`

```ts
// redux/noteSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Nota } from './types';

const initialState: Nota[] = [];

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    aggiungiNota: (state, action: PayloadAction<string>) => {
      state.push({
        id: Date.now(),
        testo: action.payload,
        importante: false
      });
    },
    eliminaNota: (state, action: PayloadAction<number>) => {
      return state.filter(nota => nota.id !== action.payload);
    },
    toggleImportante: (state, action: PayloadAction<number>) => {
      const nota = state.find(n => n.id === action.payload);
      if (nota) {
        nota.importante = !nota.importante;
      }
    }
  }
});

export const { aggiungiNota, eliminaNota, toggleImportante } = noteSlice.actions;
export default noteSlice.reducer;
```

---

## 3. `store.ts`

```ts
// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './noteSlice';

export const store = configureStore({
  reducer: {
    note: noteReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## 5. `App.tsx`

```tsx
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

export default function App() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Appunti</h1>
      <NoteForm />
      <NoteList />
    </div>
  );
}
```

---

## 6. `NoteForm.tsx`

```tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { aggiungiNota } from '../redux/noteSlice';
import { AppDispatch } from '../redux/store';

export default function NoteForm() {
  const [text, setText] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      dispatch(aggiungiNota(trimmed));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="border border-gray-300 rounded px-4 py-2 w-full"
        type="text"
        placeholder="Scrivi un appunto"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Aggiungi
      </button>
    </form>
  );
}
```

---

## 7. `NoteList.tsx`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import NoteItem from './NoteItem';

export default function NoteList() {
  const note = useSelector((state: RootState) => state.note);

  if (note.length === 0) {
    return <p className="text-gray-500">Nessun appunto presente.</p>;
  }

  return (
    <ul className="space-y-3">
      {note.map(n => (
        <NoteItem key={n.id} nota={n} />
      ))}
    </ul>
  );
}
```

---

## 8. `NoteItem.tsx`

```tsx
import { Nota, eliminaNota, toggleImportante } from '../redux/noteSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

type Props = {
  nota: Nota;
};

export default function NoteItem({ nota }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <li
      className={`flex justify-between items-center border px-4 py-2 rounded ${
        nota.importante ? 'bg-yellow-100' : ''
      }`}
    >
      <span>{nota.testo}</span>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(toggleImportante(nota.id))}
          className="text-sm text-blue-600 hover:underline"
        >
          Importante
        </button>
        <button
          onClick={() => dispatch(eliminaNota(nota.id))}
          className="text-sm text-red-600 hover:underline"
        >
          Elimina
        </button>
      </div>
    </li>
  );
}
```

---

## 9. `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---


















































---

# Context API di React

---

## 1. Cos’è la Context API?

La **Context API** è un sistema nativo di React che consente di **condividere dati globali** tra componenti **senza doverli passare manualmente tramite props**, evitando il cosiddetto **prop drilling**.

> È utile quando hai **uno stato o un valore che più componenti** devono leggere o modificare, indipendentemente dalla loro profondità nell’albero dei componenti.

---

## 2. Quando usarla

- Tema dell’interfaccia (chiaro/scuro)
- Autenticazione dell’utente
- Lingua selezionata
- Dati condivisi globali (ma non troppo complessi)
- Alternativa leggera a Redux per casi semplici

---

## 3. Come funziona la Context API

Il funzionamento si basa su 3 elementi principali:

1. **Creazione del contesto** (`createContext`)
2. **Provider**: rende disponibile il valore
3. **Consumer** (o `useContext`): consente di accedere al valore

---

# Esempio base: Tema (light/dark)

---

## 1. Creazione del contesto

```tsx
// ThemeContext.tsx
import { createContext } from 'react';

// Tipizziamo il contesto
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

// Creiamo il contesto con un valore iniziale nullo (verrà definito nel Provider)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

---

## 2. Provider

```tsx
// ThemeProvider.tsx
import { useState } from 'react';
import { ThemeContext } from './ThemeContext';

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Spiegazione**:
- Il `ThemeProvider` contiene lo **stato globale** (in questo caso il tema)
- Espone il valore e la funzione `toggleTheme` tramite `value`
- Tutti i componenti "figli" potranno leggere questo contesto

---

## 3. Uso del contesto nei componenti

```tsx
// ThemeToggler.tsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeToggler() {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('ThemeToggler must be used within ThemeProvider');

  const { theme, toggleTheme } = context;

  return (
    <div>
      <p>Tema attuale: {theme}</p>
      <button onClick={toggleTheme}>Cambia tema</button>
    </div>
  );
}
```

---

## 4. Integrazione nel progetto

```tsx
// App.tsx
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggler } from './ThemeToggler';

export default function App() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <h1>Context API - Tema</h1>
        <ThemeToggler />
      </div>
    </ThemeProvider>
  );
}
```

---

# Teoria e logica dietro la Context API

- React consente a ogni componente di **consumare dati dal contesto** senza doverli ricevere da un parent diretto
- Il `Provider` è **l’unico responsabile dello stato**
- I `Consumer` (in questo caso tramite `useContext`) leggono il valore direttamente
- Il contesto è **reattivo**: se cambia il valore nel provider, tutti i componenti che lo consumano si aggiornano

---

# Differenze con Redux

| Aspetto                  | Context API                    | Redux Toolkit                        |
|--------------------------|--------------------------------|--------------------------------------|
| Scopo                    | Condividere valori             | Gestire stato complesso              |
| Dove vive lo stato       | All’interno del provider       | In uno store centrale                |
| Livello di struttura     | Semplice                       | Complesso ma scalabile               |
| DevTools e middleware    | Non previsti                   | Inclusi (DevTools, middleware, thunk)|
| Quando preferirla        | Progetti piccoli/medi          | Progetti strutturati e grandi        |

---

## Best practice con Context API

- Non usare un solo contesto per **tutto lo stato dell’app** (rischio di over-render)
- Se lo stato è **molto dinamico e condiviso da molti componenti**, valuta Redux
- Tipizza il contesto in TypeScript (evita `any` o valori iniziali non coerenti)
- Verifica sempre che il `useContext` venga usato all’interno del `Provider`

---

## Conclusione

La Context API è un sistema potente e nativo di React per **condividere dati tra componenti senza prop drilling**. È ideale per **dati globali semplici** come temi, autenticazione, lingua, configurazioni globali.  
Non è una sostituzione completa di Redux, ma è perfetta per molte applicazioni.































---

## La Context API viene **inserita esternamente** all'app **proprio per rendere disponibili i dati ovunque**.  
Nel tuo esempio:

- **Tema (light/dark)**  
- **Utente loggato (auth)**  
- **Lingua o preferenze**  

Questi sono tutti casi ideali per essere **disponibili globalmente**, anche nei componenti più profondi, **senza doverli passare via props**.  
Per questo il Provider viene messo **a monte della gerarchia**:

```tsx
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

---

## Ma se sto già usando Redux Toolkit?

La domanda è lecita: **uso entrambi?**  
Vediamo i due casi.

---

###  Quando ha senso usare **entrambi** (Context + Redux Toolkit)

Puoi usare **Redux per gestire lo stato dell’applicazione (dinamico e modificabile)** e **Context per dati più stabili o globali**, come:

| Dato globale              | Context API    | Redux Toolkit    |
|---------------------------|----------------|------------------|
| Tema (light/dark)         | Sì             | Sì, ma overkill  |
| Lingua (i18n)             | Sì             | Sì, ma meno leggibile |
| Autenticazione (token, user) | Sì parziale   | Sì, se serve aggiornamento |
| Stato dell'interfaccia (modali, filtri, form) | No              | Sì |
| Liste di dati dinamici    | No             | Sì |
| Carrello prodotti         | No             | Sì |
| Task / note / appunti     | No             | Sì |

---

### Criteri per decidere:

1. **La variabile cambia spesso?**  
   → Usa Redux  
2. **Serve accedere/modificare da molte parti dell’app?**  
   → Usa Redux  
3. **È un’informazione statica/globale (tema, lingua)?**  
   → Usa Context  
4. **Serve DevTools o tracciamento?**  
   → Usa Redux  
5. **È un’informazione personale, locale e semplice?**  
   → Usa Context  

---

### Esempio combinato

```tsx
<AuthProvider>
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
</AuthProvider>
```

- `AuthProvider`: contiene `user`, `isLoggedIn`, `login()` → Context
- `ThemeProvider`: gestisce `theme` → Context
- `Provider` Redux: gestisce `task`, `carrello`, `filtri`, `uiState` → Redux Toolkit

---

## Conclusione

- **Usa la Context API per dati globali stabili e non troppo dinamici**
- **Usa Redux Toolkit per dati che cambiano spesso, sono strutturati o devono essere tracciati**
- **Non duplicare lo stesso stato in entrambi**: scegli uno strumento per ciascun dominio

Questa combinazione è comune nei progetti professionali: **Redux per lo stato dell’app**, **Context per tema, autenticazione e configurazioni globali**.





















































# To-do list multilingua


- **Redux Toolkit** per la gestione dei task
- **Context API** per la gestione della lingua (`en` / `it`)
- **Form con due campi** per titolo inglese e italiano
- **Visualizzazione dinamica** dei task in base alla lingua selezionata

---

## Funzionalità previste

- Aggiunta di task con nome in inglese e italiano
- Selezione della lingua corrente tramite Context
- Visualizzazione dei task nella lingua attiva
- Stato dei task gestito globalmente con Redux Toolkit

---

## Struttura del progetto

```
src/
├── App.tsx
├── main.tsx
├── context/
│   └── LanguageContext.tsx
├── redux/
│   ├── store.ts
│   └── todoSlice.ts
├── components/
│   ├── TaskForm.tsx
│   └── TaskList.tsx
└── index.css
```

---

## 1. `LanguageContext.tsx`

```tsx
import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'it';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'it' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
```

---

## 2. `todoSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Task = {
  id: number;
  text: {
    en: string;
    it: string;
  };
};

const initialState: Task[] = [];

const todoSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ en: string; it: string }>) => {
      state.push({
        id: Date.now(),
        text: {
          en: action.payload.en,
          it: action.payload.it
        }
      });
    }
  }
});

export const { addTask } = todoSlice.actions;
export default todoSlice.reducer;

export type { Task };
```

---

## 3. `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. `TaskForm.tsx`

```tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/todoSlice';
import { AppDispatch } from '../redux/store';

export default function TaskForm() {
  const [en, setEn] = useState('');
  const [it, setIt] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (en.trim() && it.trim()) {
      dispatch(addTask({ en: en.trim(), it: it.trim() }));
      setEn('');
      setIt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="border px-4 py-2 w-full"
        type="text"
        placeholder="Task in English"
        value={en}
        onChange={(e) => setEn(e.target.value)}
      />
      <input
        className="border px-4 py-2 w-full"
        type="text"
        placeholder="Task in Italiano"
        value={it}
        onChange={(e) => setIt(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
    </form>
  );
}
```

---

## 5. `TaskList.tsx`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useLanguage } from '../context/LanguageContext';

export default function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const { language } = useLanguage();

  if (tasks.length === 0) {
    return <p className="text-gray-500 mt-4">No tasks available</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map(task => (
        <li key={task.id} className="border p-2 rounded">
          {task.text[language]}
        </li>
      ))}
    </ul>
  );
}
```

---

## 6. `App.tsx`

```tsx
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">To-Do List ({language.toUpperCase()})</h1>
        <button onClick={toggleLanguage} className="text-sm text-blue-600 underline">
          Cambia Lingua
        </button>
      </div>
      <TaskForm />
      <TaskList />
    </div>
  );
}
```

---

## 7. `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);
```

---










































---

# `createSelector` — Teoria e Guida Completa

---

## Cos’è `createSelector`

`createSelector` è una funzione fornita da **Redux Toolkit** (tramite la libreria `reselect`) che ti permette di **estrarre valori derivati dallo stato** in modo **ottimizzato**, leggibile e riutilizzabile.

---

## A cosa serve

In Redux, spesso hai bisogno di:

- Ottenere **una versione trasformata dello stato** (es. task completati, utenti attivi, totale di qualcosa)
- Effettuare **calcoli o filtraggi** senza sporcare i componenti
- Evitare di ripetere `filter`, `map` o `reduce` direttamente nei componenti

`createSelector` risolve questi problemi in modo pulito ed efficiente.

---

## Quando usarlo

- Quando devi **filtrare**, **ordinare**, **aggregare** dati dello store
- Quando la trasformazione dello stato è **ripetuta in più componenti**
- Quando vuoi evitare **ricalcoli inutili** a ogni render

---

## Vantaggi

- **Memoizzazione automatica**: ricompone i dati solo se lo stato da cui dipende è cambiato
- **Separa la logica** dal componente
- **Riutilizzabile e testabile**

---

## Sintassi base

```ts
import { createSelector } from '@reduxjs/toolkit';

const mioSelector = createSelector(
  (state: RootState) => state.dominio,         // selettore base
  (dominio) => trasformazione(dominio)         // selettore derivato
);
```

Può anche accettare **più selettori** come input:

```ts
const selettoreComposto = createSelector(
  [(state) => state.utenti, (state) => state.filtro],
  (utenti, filtro) => utenti.filter(u => u.nome.includes(filtro))
);
```

---

# Esempio guidato completo: `createSelector` su una to-do list

---

## Step 1. Stato iniziale

```ts
type Task = {
  id: number;
  titolo: string;
  completato: boolean;
};

const initialState: Task[] = [
  { id: 1, titolo: 'Studiare Redux', completato: true },
  { id: 2, titolo: 'Fare la spesa', completato: false },
  { id: 3, titolo: 'Allenarsi', completato: true }
];
```

---

## Step 2. Slice Redux (semplificato)

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    aggiungiTask: (state, action: PayloadAction<string>) => {
      state.push({ id: Date.now(), titolo: action.payload, completato: false });
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) task.completato = !task.completato;
    }
  }
});

export const { aggiungiTask, toggleTask } = taskSlice.actions;
export default taskSlice.reducer;
```

---

## Step 3. Creazione dei selector

```ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Selettore base: restituisce l'intera lista dei task
const selectTasks = (state: RootState) => state.tasks;

// Selettore derivato: task completati
export const selectTaskCompletati = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.completato)
);

// Selettore derivato: task non completati
export const selectTaskDaFare = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => !task.completato)
);

// Selettore derivato: conteggio dei completati
export const selectNumeroCompletati = createSelector(
  [selectTaskCompletati],
  (completati) => completati.length
);
```

---

## Step 4. Uso nei componenti

```tsx
import { useSelector } from 'react-redux';
import { selectTaskCompletati, selectNumeroCompletati } from '../redux/selectors';

export default function ListaCompletati() {
  const completati = useSelector(selectTaskCompletati);
  const totale = useSelector(selectNumeroCompletati);

  return (
    <div>
      <h2>Task completati: {totale}</h2>
      <ul>
        {completati.map(t => (
          <li key={t.id}>{t.titolo}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Commenti e vantaggi

- Ogni `createSelector` ha **una responsabilità singola**
- È **riutilizzabile** in più componenti
- La trasformazione dello stato è **fuori dal componente**, quindi testabile
- Le prestazioni sono migliori perché il calcolo è **memoizzato** (non ricalcolato se non necessario)

---

## Conclusione

### `createSelector` ti permette di:

- Scrivere codice Redux **più pulito**
- Evitare `filter`, `map`, `reduce` nel JSX
- Ottenere **prestazioni migliori**
- Rispettare il principio di separazione della logica
























Vediamo come usare `createSelector` **con dati provenienti da slice diversi**.

Questo è un caso molto comune in progetti reali, in cui lo **stato necessario per un componente** è distribuito tra più slice (es. `tasks`, `filtri`, `user`, `auth`, `cart`, ecc.).

---

# Obiettivo

Supponiamo di avere due slice:

1. **`tasksSlice`** → contiene una lista di attività
2. **`filterSlice`** → contiene il filtro selezionato (es. `"all"`, `"completed"`, `"pending"`)

Vogliamo creare un **selector derivato** che restituisca **solo i task filtrati** in base allo stato del filtro.

---

## 1. Stato Redux globale (semplificato)

```ts
// state.tasks → array di task
// state.filter → valore stringa ("all" | "completed" | "pending")
```

---

## 2. Slice `tasksSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Task = {
  id: number;
  titolo: string;
  completato: boolean;
};

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    aggiungiTask: (state, action: PayloadAction<string>) => {
      state.push({ id: Date.now(), titolo: action.payload, completato: false });
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) task.completato = !task.completato;
    }
  }
});

export const { aggiungiTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;
```

---

## 3. Slice `filterSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Filtro = 'all' | 'completed' | 'pending';

const initialState: Filtro = 'all';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filtro>) => action.payload
  }
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
```

---

## 4. Store `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filter: filterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 5. Selector composito con `createSelector`

```ts
// selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Selettore base per i task
const selectTasks = (state: RootState) => state.tasks;

// Selettore base per il filtro attivo
const selectFiltro = (state: RootState) => state.filter;

// Selettore combinato derivato da entrambi
export const selectTaskFiltrati = createSelector(
  [selectTasks, selectFiltro],
  (tasks, filtro) => {
    switch (filtro) {
      case 'completed':
        return tasks.filter(t => t.completato);
      case 'pending':
        return tasks.filter(t => !t.completato);
      case 'all':
      default:
        return tasks;
    }
  }
);
```

---

## 6. Uso nel componente

```tsx
// components/TaskList.tsx
import { useSelector } from 'react-redux';
import { selectTaskFiltrati } from '../redux/selectors';

export default function TaskList() {
  const tasks = useSelector(selectTaskFiltrati);

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          {task.titolo} {task.completato ? '(completato)' : ''}
        </li>
      ))}
    </ul>
  );
}
```

---

## Vantaggi di `createSelector` su slice diversi

- Unifica dati **provenienti da slice differenti**
- Mantiene la logica centralizzata, leggibile e testabile
- Non fa ricalcoli inutili se né i task né il filtro cambiano (`memoization`)
- Evita duplicazione della logica in ogni componente

---

## Conclusione

`createSelector` è lo strumento più potente per creare **dati derivati** combinando **stato da slice diversi**.  
È altamente scalabile e si integra perfettamente nei progetti reali con Redux Toolkit.





















































## Esercizio Finale – Libreria con filtro, selettore derivato e lingua dinamica

---

### Obiettivo

Realizzare un'applicazione React + TypeScript in cui sia possibile:

- Aggiungere un libro alla libreria, specificando **titolo**, **autore**, **prezzo** e **categoria**
- Filtrare la visualizzazione per categoria (es. tutti, romanzi, saggistica, poesia)
- Visualizzare il **numero di libri** e il **prezzo totale** dei libri visibili (via `createSelector`)
- Cambiare **lingua dell’interfaccia** (solo il titolo principale) tramite Context API

---

## Struttura dati dei libri

Ogni libro dovrà avere questa forma:

```ts
{
  id: number;
  title: string;
  author: string;
  price: number;
  category: 'romanzo' | 'saggio' | 'poesia';
}
```

---

## Stato Redux

Crea due slice:

1. `booksSlice.ts`
   - Stato: lista di libri
   - Azioni:
     - `addBook`: aggiunge un libro
2. `filterSlice.ts`
   - Stato: stringa `all` | `romanzo` | `saggio` | `poesia`
   - Azione: `setFilter`

---

## Obiettivi funzionali

- L’utente può compilare un **form** con i dati di un libro
- Può selezionare un filtro tramite un `<select>` per categoria
- Nella lista vengono visualizzati solo i libri della categoria selezionata
- Un componente mostra:
  - **Numero di libri visibili**
  - **Prezzo totale dei libri visibili**
  (entrambi calcolati con `createSelector`)
- Il titolo principale della pagina cambia da “La mia Libreria” a “My Library” tramite Context API (`it` / `en`)

---

## Componenti richiesti

| Componente        | Funzione                                                                 |
|-------------------|--------------------------------------------------------------------------|
| `App.tsx`         | Layout principale                                                        |
| `LanguageContext` | Context per la lingua (valori: `it` o `en`)                              |
| `BookForm`        | Form per aggiungere un nuovo libro                                       |
| `BookFilter`      | Select per cambiare il filtro delle categorie                            |
| `BookList`        | Mostra solo i libri filtrati                                             |
| `BookItem`        | Mostra il singolo libro                                                  |
| `BookSummary`     | Mostra il numero di libri visibili e il prezzo totale (via selector)     |

---

## Concetti richiesti

- Redux Toolkit (`createSlice`, `PayloadAction`)
- `configureStore`, `useSelector`, `useDispatch`
- `createSelector` per calcoli derivati su slice combinati
- Context API (`createContext`, `useContext`) per la lingua dell’interfaccia
- TypeScript e tipizzazione degli stati, azioni e context

---

## Suggerimenti tecnici

- Inizia con `BookForm` e `booksSlice`
- Aggiungi il filtro e collegalo con `filterSlice`
- Crea i selector:
  - `selectBooksFiltered`
  - `selectBooksCount`
  - `selectBooksTotalPrice`
- Usa `useContext(LanguageContext)` nel componente `App` per cambiare dinamicamente il titolo

---

## Esempio funzionamento

- Aggiungo “Il nome della rosa”, autore: Eco, prezzo: 15, categoria: “romanzo”
- Aggiungo “Sapiens”, autore: Harari, prezzo: 20, categoria: “saggio”
- Se filtro “saggio”, viene mostrato solo “Sapiens”
- Il componente `BookSummary` mostra:  
  `Libri visibili: 1 | Totale: €20`
- Se clicco “Cambia lingua”, il titolo principale diventa "My Library"

---

## Vincoli

- Nessun salvataggio su `localStorage`
- Nessuna fetch API
- Nessuna logica async
- Lingua cambia **solo l’interfaccia**, non i dati
- Obiettivo: usare bene Redux Toolkit, `createSelector`, Context API

---




























































 **"Libreria con Redux Toolkit, `createSelector` e Context API"**

---

# STEP 1 – Setup dello Store Redux

---

## 1.1 – Crea `booksSlice.ts`

```ts
// src/redux/booksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  category: 'romanzo' | 'saggio' | 'poesia';
};

const initialState: Book[] = [];

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (
      state,
      action: PayloadAction<{ title: string; author: string; price: number; category: Book['category'] }>
    ) => {
      state.push({
        id: Date.now(),
        ...action.payload
      });
    }
  }
});

export const { addBook } = booksSlice.actions;
export default booksSlice.reducer;
```

---

## 1.2 – Crea `filterSlice.ts`

```ts
// src/redux/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Filter = 'all' | 'romanzo' | 'saggio' | 'poesia';

const initialState: Filter = 'all';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => action.payload
  }
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
```

---

## 1.3 – Crea `store.ts`

```ts
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    filter: filterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 1.4 – Crea `selectors.ts`

```ts
// src/redux/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

const selectBooks = (state: RootState) => state.books;
const selectFilter = (state: RootState) => state.filter;

export const selectFilteredBooks = createSelector(
  [selectBooks, selectFilter],
  (books, filter) => {
    if (filter === 'all') return books;
    return books.filter(book => book.category === filter);
  }
);

export const selectBooksCount = createSelector(
  [selectFilteredBooks],
  (books) => books.length
);

export const selectBooksTotalPrice = createSelector(
  [selectFilteredBooks],
  (books) => books.reduce((sum, book) => sum + book.price, 0)
);
```

---

## 1.5 – Integra lo store in `main.tsx`

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);
```











































---

# STEP 2 – Creazione del contesto per la lingua

---

## Obiettivo

Gestire globalmente la lingua dell’interfaccia dell’applicazione (titolo principale), scegliendo tra **italiano (`it`)** e **inglese (`en`)**, senza toccare i dati dei libri.

---

## 2.1 – Crea `LanguageContext.tsx`

```tsx
// src/context/LanguageContext.tsx
import { createContext, useContext, useState } from 'react';

type Language = 'it' | 'en';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};

// Creazione del contesto con valore iniziale undefined
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider che incapsula l'app
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('it');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'it' ? 'en' : 'it'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook custom per accedere facilmente al contesto
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage deve essere usato dentro LanguageProvider');
  return context;
}
```

---

## 2.2 – Integrazione nel progetto (già fatto nello `main.tsx`)

Ti ricordo che nel file `main.tsx` lo abbiamo già incluso così:

```tsx
<Provider store={store}>
  <LanguageProvider>
    <App />
  </LanguageProvider>
</Provider>
```

Questa configurazione permette a **qualsiasi componente** figlio di `App` di accedere a:

- `language` (`'it'` o `'en'`)
- `toggleLanguage()` per cambiarla

---

## 2.3 – Utilizzo del contesto

Nei componenti dove vuoi accedere alla lingua o cambiarla:

```tsx
import { useLanguage } from '../context/LanguageContext';

const { language, toggleLanguage } = useLanguage();
```

































# STEP 3 – Componenti principali

---

## 3.1 – `App.tsx`

```tsx
// src/App.tsx
import BookForm from './components/BookForm';
import BookFilter from './components/BookFilter';
import BookList from './components/BookList';
import BookSummary from './components/BookSummary';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, toggleLanguage } = useLanguage();

  const title = language === 'it' ? 'La mia Libreria' : 'My Library';

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={toggleLanguage}
          className="text-sm text-blue-600 underline"
        >
          {language === 'it' ? 'Cambia lingua' : 'Switch language'}
        </button>
      </div>

      <BookForm />
      <BookFilter />
      <BookList />
      <BookSummary />
    </div>
  );
}
```

---

## 3.2 – `BookForm.tsx`

```tsx
// src/components/BookForm.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../redux/booksSlice';
import { AppDispatch } from '../redux/store';

export default function BookForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'romanzo' | 'saggio' | 'poesia'>('romanzo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!title.trim() || !author.trim() || isNaN(parsedPrice)) return;

    dispatch(addBook({ title: title.trim(), author: author.trim(), price: parsedPrice, category }));
    setTitle('');
    setAuthor('');
    setPrice('');
    setCategory('romanzo');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full border px-4 py-2"
      />
      <input
        type="text"
        placeholder="Autore"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        className="w-full border px-4 py-2"
      />
      <input
        type="number"
        placeholder="Prezzo (€)"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="w-full border px-4 py-2"
        step="0.01"
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value as any)}
        className="w-full border px-4 py-2"
      >
        <option value="romanzo">Romanzo</option>
        <option value="saggio">Saggio</option>
        <option value="poesia">Poesia</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Aggiungi libro
      </button>
    </form>
  );
}
```

---

## 3.3 – `BookFilter.tsx`

```tsx
// src/components/BookFilter.tsx
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../redux/filterSlice';
import { RootState } from '../redux/store';

export default function BookFilter() {
  const currentFilter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  return (
    <select
      value={currentFilter}
      onChange={e => dispatch(setFilter(e.target.value as any))}
      className="w-full border px-4 py-2"
    >
      <option value="all">Tutti</option>
      <option value="romanzo">Romanzi</option>
      <option value="saggio">Saggi</option>
      <option value="poesia">Poesie</option>
    </select>
  );
}
```

---

## 3.4 – `BookList.tsx`

```tsx
// src/components/BookList.tsx
import { useSelector } from 'react-redux';
import { selectFilteredBooks } from '../redux/selectors';

export default function BookList() {
  const books = useSelector(selectFilteredBooks);

  if (books.length === 0) {
    return <p className="text-gray-500">Nessun libro trovato.</p>;
  }

  return (
    <ul className="space-y-3">
      {books.map(book => (
        <li key={book.id} className="border p-3 rounded shadow-sm">
          <p className="font-semibold">{book.title}</p>
          <p className="text-sm text-gray-600">di {book.author}</p>
          <p className="text-sm">Categoria: {book.category}</p>
          <p className="text-sm font-medium text-green-700">€ {book.price.toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}
```

---

## 3.5 – `BookSummary.tsx`

```tsx
// src/components/BookSummary.tsx
import { useSelector } from 'react-redux';
import { selectBooksCount, selectBooksTotalPrice } from '../redux/selectors';

export default function BookSummary() {
  const totalBooks = useSelector(selectBooksCount);
  const totalPrice = useSelector(selectBooksTotalPrice);

  return (
    <div className="border-t pt-4 mt-4 text-sm text-gray-800 font-medium">
      <p>Libri visibili: {totalBooks}</p>
      <p>Totale: € {totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

---


















































---

## Obiettivo dell’esercizio
Estendere l’applicazione della libreria per

-Gestire uno **stato locale** per la ricerca dei libri (`useState`
-**Accedere direttamente** a un campo input per impostare il focus (`useRef`
-**Eseguire effetti collaterali** al caricamento della pagina, come impostare il focus sull’input (`useEffect`

---

## Requisiti

### 1. Campo di ricerca

 Aggiungere un campo di input per la ricerca dei libri per titol.
 Utilizzare `useState` per gestire il valore dell’inpu.
 Filtrare la lista dei libri in base al testo inserit.

### 2. Focus automatico

 Utilizzare `useRef` per creare un riferimento al campo di inpu.
 Utilizzare `useEffect` per impostare il focus sul campo di input al caricamento della pagin.

---

## Componenti da implementare

### `SearchBar.tsx`
- Campo di input per la ricera.- Gestione dello stato del valore dell’input con `useStat`.- Utilizzo di `useRef` per creare un riferimento al camo.- Utilizzo di `useEffect` per impostare il focus al caricameno.- Passaggio del valore di ricerca al componente `BookLis`.

### Modifica di `BookList.tsx`
- Ricevere il valore di ricerca come prp.- Filtrare la lista dei libri in base al titolo che include il valore di ricera.

---

## Flusso dell’applicazione
1. Al caricamento della pagina, il campo di ricerca è automaticamente focalizzto.2. L’utente digita un testo nel campo di riceca.3. La lista dei libri si aggiorna in tempo reale mostrando solo quelli il cui titolo include il testo inserto.

---
