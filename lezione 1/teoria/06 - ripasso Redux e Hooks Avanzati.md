# Ripasso Redux Toolkit 

---

## 1. **Cos'è Redux e perché usarlo**

### Teoria

Redux è una libreria per la gestione dello stato globale. Utilizza un flusso unidirezionale e prevede tre concetti principali: `store`, `action`, `reducer`.

### Esempio

```ts
store.dispatch({ type: 'ADD_BOOK', payload: { title: '1984' } });
```

### Best practice

* Usare Redux per dati condivisi tra componenti
* Evitare Redux per stato locale non condiviso

---

## 2. **Configurazione dello store con `configureStore`**

### Teoria

`configureStore` di Redux Toolkit semplifica la creazione dello store, integra DevTools e middleware.

### Esempio

```ts
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer
  }
});
```

### Best practice

* Organizzare i reducer in slice separati
* Usare `configureStore` anche per middleware custom

---

## 3. **Creazione di uno slice con `createSlice`**

### Teoria

`createSlice` unisce: stato iniziale, reducer e action creator in un'unica struttura coerente.

### Esempio

```ts
const booksSlice = createSlice({
  name: 'books',
  initialState: [],
  reducers: {
    addBook: (state, action) => {
      state.push(action.payload);
    }
  }
});
```

### Best practice

* Usare nomi coerenti con il dominio (`userSlice`, `cartSlice`)
* Tipizzare lo stato e le azioni (soprattutto in TypeScript)

---

## 4. **Dispatch di un'azione e modifica dello stato**

### Teoria

Il `dispatch` invia un’azione allo store per attivare il reducer e aggiornare lo stato.

### Esempio

```tsx
const dispatch = useDispatch();
dispatch(addBook({ title: 'Brave New World' }));
```

### Best practice

* Non mutare lo stato fuori dal reducer
* Evitare action con payload ambigui o incompleti

---

## 5. **Accesso allo stato globale con `useSelector`**

### Teoria

`useSelector` permette di leggere valori dallo store Redux all'interno di un componente React.

### Esempio

```tsx
const books = useSelector((state: RootState) => state.books);
```

### Best practice

* Usare selettori dedicati per evitare logica complessa nel componente
* Tipizzare correttamente `RootState`

---

## 6. **Dati derivati con `createSelector`**

### Teoria

`createSelector` permette di memorizzare e ottimizzare calcoli derivati dallo stato.

### Esempio

```ts
export const selectBooksByCategory = createSelector(
  [(state: RootState) => state.books, (state: RootState) => state.filter],
  (books, filter) => filter === 'all' ? books : books.filter(b => b.category === filter)
);
```

### Best practice

* Usare `createSelector` per filtraggio, aggregazione, ordinamento
* Centralizzare la logica di derivazione fuori dal componente

---

## 7. **Organizzazione del codice per dominio**

### Teoria

Separare lo stato per dominio (`features/cart/cartSlice.ts`) e non per tipo (`actions.js`, `reducers.js`).

### Struttura consigliata

```
src/
├── redux/
│   ├── store.ts
│   ├── booksSlice.ts
│   ├── filterSlice.ts
│   └── selectors.ts
```

### Best practice

* Ogni slice ha uno scopo chiaro
* Evitare file generici come `actions.ts` o `reducers.ts`

---

## 8. **Modularità dello stato: combinazione di slice**

### Teoria

Redux Toolkit supporta la combinazione automatica dei reducer tramite `configureStore`.

### Esempio

```ts
reducer: {
  books: booksReducer,
  user: userReducer
}
```

### Best practice

* Ogni slice è responsabile solo del proprio stato
* Evitare slice troppo grandi o generici

---

## 9. **Tipizzazione avanzata con TypeScript**

### Teoria

Redux Toolkit è completamente compatibile con TypeScript e consente tipizzazione sicura di stato, azioni e selettori.

### Esempio

```ts
type Book = { title: string; author: string; price: number };
type RootState = ReturnType<typeof store.getState>;
```

### Best practice

* Tipizzare ogni slice e ogni payload
* Esportare `AppDispatch` e `RootState` dallo store

---

## 10. **Redux Toolkit vs Context API**

### Teoria

Redux è preferibile per stato complesso, condiviso e dinamico. Context è adatto per valori globali statici (tema, lingua).

### Esempio di Context

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');
```

### Best practice

* Non duplicare stato tra Redux e Context
* Usare Context per configurazioni statiche, Redux per logica interattiva

---























Ecco un **esempio completo e professionale** che riassume tutte le best practice di utilizzo di **Redux Toolkit con TypeScript**, incluso:

* Configurazione dello store
* Slice con stato tipizzato
* Dispatch e selettori
* Dati derivati con `createSelector`
* Organizzazione modulare
* Tipizzazione sicura

---

## Obiettivo dell’esempio

Una semplice app che gestisce un **carrello della spesa** (`cartSlice`) e una lista di **prodotti disponibili** (`productsSlice`).
L'utente può:

* Aggiungere prodotti al carrello
* Visualizzare il totale e la quantità di prodotti nel carrello (via `createSelector`)

---

## Struttura dei file

```
src/
├── redux/
│   ├── store.ts
│   ├── cartSlice.ts
│   ├── productsSlice.ts
│   └── selectors.ts
├── components/
│   ├── ProductList.tsx
│   └── CartSummary.tsx
├── App.tsx
├── main.tsx
```

---

## 1. `cartSlice.ts`

```ts
// redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
  productId: number;
  quantity: number;
};

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      const item = state.find(i => i.productId === action.payload);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ productId: action.payload, quantity: 1 });
      }
    }
  }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
```

---

## 2. `productsSlice.ts`

```ts
// redux/productsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type Product = {
  id: number;
  name: string;
  price: number;
};

const initialState: Product[] = [
  { id: 1, name: 'Pane', price: 1.5 },
  { id: 2, name: 'Latte', price: 1.2 },
  { id: 3, name: 'Caffè', price: 4.8 }
];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {}
});

export default productsSlice.reducer;
```

---

## 3. `store.ts`

```ts
// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. `selectors.ts`

```ts
// redux/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectCart = (state: RootState) => state.cart;
export const selectProducts = (state: RootState) => state.products;

export const selectCartItemsDetailed = createSelector(
  [selectCart, selectProducts],
  (cart, products) =>
    cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        ...item,
        name: product.name,
        price: product.price,
        total: product.price * item.quantity
      };
    })
);

export const selectCartTotal = createSelector(
  [selectCartItemsDetailed],
  (items) => items.reduce((sum, item) => sum + item.total, 0)
);
```

---

## 5. `ProductList.tsx`

```tsx
// components/ProductList.tsx
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { selectProducts } from '../redux/selectors';
import { AppDispatch } from '../redux/store';

export default function ProductList() {
  const products = useSelector(selectProducts);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h2>Prodotti</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - €{p.price.toFixed(2)}
            <button onClick={() => dispatch(addToCart(p.id))} className="ml-2 bg-blue-600 text-white px-2 py-1 rounded">
              Aggiungi al carrello
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. `CartSummary.tsx`

```tsx
// components/CartSummary.tsx
import { useSelector } from 'react-redux';
import { selectCartItemsDetailed, selectCartTotal } from '../redux/selectors';

export default function CartSummary() {
  const items = useSelector(selectCartItemsDetailed);
  const total = useSelector(selectCartTotal);

  return (
    <div className="mt-6 border-t pt-4">
      <h2>Carrello</h2>
      {items.length === 0 ? (
        <p>Nessun prodotto nel carrello</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.productId}>
              {item.name} × {item.quantity} = €{item.total.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <p className="font-bold mt-2">Totale: €{total.toFixed(2)}</p>
    </div>
  );
}
```

---

## 7. `App.tsx`

```tsx
// App.tsx
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Negozio</h1>
      <ProductList />
      <CartSummary />
    </div>
  );
}
```

---

## 8. `main.tsx`

```tsx
// main.tsx
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




















Ecco la prima parte del modulo **Hooks Avanzati – `useReducer`**, strutturata in modo professionale e approfondito con **teoria, codice e confronto con Redux**, come richiesto.

---

# 1. `useReducer`: logica, struttura, confronto con Redux

---

## Obiettivi didattici

* Comprendere come funziona `useReducer` per gestire stati **complessi o strutturati**
* Saper distinguere l’uso di `useReducer` e Redux in base a **scopo e scala**
* Imparare a strutturare l’**aggiornamento dello stato** tramite un flusso dichiarativo

---

## 1.1 – Cos'è `useReducer`

`useReducer` è un hook di React usato per gestire lo stato **tramite un reducer puro**, seguendo un modello simile a Redux, ma **locale** al componente.

Si usa quando:

* Lo stato è **composto** (oggetti o array)
* Gli aggiornamenti sono **condizionati o sequenziali**
* La logica di aggiornamento dello stato è **meglio centralizzata** in una funzione

---

## Struttura base

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

* `state`: lo stato corrente
* `dispatch`: funzione che invia un'azione
* `reducer`: funzione che aggiorna lo stato
* `initialState`: valore iniziale dello stato

---

## Esempio base

```tsx
import { useReducer } from 'react';

type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Conteggio: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

---

## 1.2 – Stato annidato o composto

`useReducer` è particolarmente utile per gestire **oggetti con più proprietà** o **array modificabili**.

### Esempio: stato complesso

```ts
type FormState = {
  nome: string;
  email: string;
  newsletter: boolean;
};

type FormAction =
  | { type: 'set_nome'; payload: string }
  | { type: 'set_email'; payload: string }
  | { type: 'toggle_newsletter' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'set_nome':
      return { ...state, nome: action.payload };
    case 'set_email':
      return { ...state, email: action.payload };
    case 'toggle_newsletter':
      return { ...state, newsletter: !state.newsletter };
    default:
      return state;
  }
}
```

---

## Confronto `useReducer` vs `Redux Toolkit`

| Aspetto      | `useReducer`                             | Redux Toolkit                             |
| ------------ | ---------------------------------------- | ----------------------------------------- |
| Ambito       | Locale al componente                     | Globale (store centralizzato)             |
| Boilerplate  | Minimo                                   | Medio (toolkit semplifica)                |
| Scopo        | Stato complesso in un singolo componente | Stato condiviso fra componenti            |
| Side effects | Non previsto                             | Richiede middleware (es. thunk)           |
| Debugging    | Base (DevTools non disponibili)          | Avanzato (Redux DevTools, logger, replay) |
| Testabilità  | Buona                                    | Ottima (test dei reducer e delle action)  |

---

## 🔎 Quando usare `useReducer` invece di `useState`

### Usa `useReducer` se:

* Lo stato è un **oggetto con molte proprietà**
* Più aggiornamenti devono essere eseguiti **in modo centralizzato**
* Hai bisogno di un **flusso di aggiornamento chiaro e mantenibile**

### Usa `useState` se:

* Lo stato è **semplice o isolato**
* Gli aggiornamenti sono diretti e localizzati

---



































# `useReducer` vs Redux – Quando usare cosa

---

## Quando usare `useReducer`

### Scenari ideali

* Stato **complesso ma locale** a un singolo componente
* Stato **composto o annidato** (oggetti, array) con modifiche parziali
* La logica di aggiornamento richiede **switch multipli**, **azioni esplicite**
* Serve **chiarezza** nella gestione dello stato, ma non una soluzione globale

### Esempi tipici

* Un form multi-campo con logica condizionale
* Un wizard a step con stato interno
* Un componente "isola" che non interagisce con altri

### Best practice

* Definisci azioni come oggetti `{ type, payload }`, anche se non obbligatorio
* Tipizza stato e azioni (soprattutto in TypeScript)
* Incapsula la logica del reducer fuori dal componente per test e riuso
* Evita l’uso di `useReducer` per stato **banale o lineare**

---

## Quando usare Redux (Redux Toolkit)

### Scenari ideali

* Stato **condiviso tra molti componenti**, anche distanti
* Dati **globali**, persistenti o sincronizzati (es. carrello, utente autenticato)
* Stato modificato da più punti dell’app (eventi, side effects)
* Hai bisogno di **debug avanzato** (Redux DevTools, middleware)

### Esempi tipici

* Autenticazione utente (auth)
* Carrello e checkout
* UI globale (modal, tema, notifiche)
* Stato asincrono condiviso (fetch, polling, sincronizzazione)

### Best practice

* Usa **Redux Toolkit** (evita Redux "vanilla") per ridurre boilerplate
* Organizza i reducer per dominio (`features/cart/cartSlice.ts`)
* Usa `createSelector` per derivare dati in modo efficiente
* Mantieni lo stato globale **essenziale e serializzabile**

---

## Quando usare `useReducer` e Redux insieme

### Scenari validi

È perfettamente accettabile **usare entrambi** all’interno dello stesso progetto.

### Strategia

* **Redux** per lo stato globale condiviso
* **`useReducer`** per stati **locali e complessi** che non devono uscire dal componente

### Esempio realistico

Un'app e-commerce:

* Redux: carrello, autenticazione, lista prodotti
* useReducer: stato interno di un form per la spedizione (validazione, step, errori)

### Vantaggi dell’uso combinato

* Mantieni **snello** lo stato globale
* Centralizzi la logica dove serve, **senza overengineering**
* Riduci la dipendenza da Redux in componenti che non ne hanno bisogno

---

## Errori comuni da evitare

* **Gestire tutto con Redux**: se uno stato non è condiviso, non deve stare nello store globale
* **Duplicare stato** tra `useReducer` e Redux per la stessa logica
* Usare `useReducer` **per sostituire Redux** in applicazioni complesse multi-view
* Usare `useState` e `useReducer` **misti** per lo stesso oggetto (confusione e incoerenza)

---

## Riepilogo decisionale

| Stato                                            | Soluzione consigliata                            |
| ------------------------------------------------ | ------------------------------------------------ |
| Locale e semplice                                | `useState`                                       |
| Locale e complesso                               | `useReducer`                                     |
| Condiviso e semplice                             | Redux Toolkit                                    |
| Condiviso e asincrono                            | Redux Toolkit + middleware                       |
| Locale in componente complesso con Redux globale | `useReducer` (interno) + Redux Toolkit (globale) |

---

## Conclusione

Utilizzare `useReducer` o Redux dipende da **ambito, complessità e riutilizzo dello stato**.

























---

## Obiettivo del form

Campi richiesti:

* Nome completo (almeno 2 parole)
* Email (formato valido)
* Numero di telefono (solo cifre, max 15)
* Password (minimo 8 caratteri)
* Conferma password (uguale alla precedente)

---

## File: `RegistrationForm.tsx`

```tsx
import { useReducer } from 'react';

type FormState = {
  nome: string;
  email: string;
  telefono: string;
  password: string;
  conferma: string;
  errori: Partial<Record<keyof Omit<FormState, 'errori'>, string>>;
};

```


















La definizione:

```ts
Partial<Record<keyof Omit<FormState, 'errori'>, string>>;
```

è una **tipizzazione avanzata di TypeScript** usata per descrivere un oggetto che contiene, **in modo opzionale**, i messaggi di errore associati a ciascun campo del form (escludendo `errori` stesso).

Vediamola **in modo chiaro e formale**, passo per passo.

---

##  Obiettivo

> Creare un oggetto i cui **campi coincidano con i nomi dei campi del form** (nome, email, telefono, ecc.), e in cui **il valore per ciascun campo è una stringa opzionale di errore**.

Esempio concreto del tipo che vogliamo costruire:

```ts
{
  nome?: string;
  email?: string;
  telefono?: string;
  password?: string;
  conferma?: string;
}
```

Non tutti i campi sono sempre presenti, ma **se c'è un errore in un campo**, quel campo ha una stringa associata.

---

## 🔍 Scomposizione del tipo

```ts
Partial<Record<keyof Omit<FormState, 'errori'>, string>>
```

Vediamolo per livelli:

---

### 1. `FormState`

Supponiamo che tu abbia questo tipo:

```ts
type FormState = {
  nome: string;
  email: string;
  telefono: string;
  password: string;
  conferma: string;
  errori: ...;
}
```

---

### 2. `Omit<FormState, 'errori'>`

Questo rimuove il campo `errori` da `FormState`, lasciandoti:

```ts
{
  nome: string;
  email: string;
  telefono: string;
  password: string;
  conferma: string;
}
```

> Vogliamo mappare i **campi effettivi** del form, non includere anche `errori`.

---

### 3. `keyof Omit<...>`

Estrae le **chiavi** dell’oggetto ottenuto:

```ts
'nome' | 'email' | 'telefono' | 'password' | 'conferma'
```

---

### 4. `Record<chiavi, string>`

Crea un oggetto dove **ogni chiave** è associata a un valore `string`:

```ts
{
  nome: string;
  email: string;
  telefono: string;
  password: string;
  conferma: string;
}
```

> Questo rappresenta **la mappa completa degli errori**.

---

### 5. `Partial<...>`

Rende ogni chiave **opzionale**:

```ts
{
  nome?: string;
  email?: string;
  telefono?: string;
  password?: string;
  conferma?: string;
}
```

> Così possiamo **salvare solo gli errori presenti**, senza essere obbligati a inserire ogni campo.

---

##  Perché si fa così?

* Evitiamo errori a runtime (es. accedere a `errori.cognome` quando non esiste)
* È **completamente derivato da `FormState`**: se aggiungi un nuovo campo al form, la definizione si aggiorna automaticamente
* Rende il codice **più manutenibile** e sicuro
* È coerente con la logica del reducer: solo i campi con errori devono essere visibili

---

##  Alternative equivalenti (meno dinamiche)

Avresti potuto scrivere:

```ts
type FormErrors = {
  nome?: string;
  email?: string;
  telefono?: string;
  password?: string;
  conferma?: string;
};
```

Ma sarebbe **manuale**, soggetta a dimenticanze o disallineamenti.

---

##  Conclusione

La definizione:

```ts
Partial<Record<keyof Omit<FormState, 'errori'>, string>>
```

è una forma **tipizzata, automatica e sicura** per rappresentare la mappa degli errori di validazione in un form complesso.
Rende il codice **più scalabile, coerente e conforme** alla struttura del tuo `FormState`.












---







```tsx

type FormAction =
  | { type: 'change'; field: keyof Omit<FormState, 'errori'>; value: string }
  | { type: 'validate' }
  | { type: 'reset' };

const initialState: FormState = {
  nome: '',
  email: '',
  telefono: '',
  password: '',
  conferma: '',
  errori: {}
};

function validateField(state: FormState, field: keyof Omit<FormState, 'errori'>): string {
  const value = state[field];

  switch (field) {
    case 'nome':
      return value.trim().split(' ').length < 2 ? 'Inserisci nome e cognome' : '';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email non valida';
    case 'telefono':
      if (!/^\d+$/.test(value)) return 'Inserisci solo numeri';
      if (value.length > 15) return 'Il numero è troppo lungo';
      if (value.length < 8) return 'Numero troppo corto';
      return '';
    case 'password':
      return value.length < 8 ? 'La password deve avere almeno 8 caratteri' : '';
    case 'conferma':
      return value !== state.password ? 'Le password non coincidono' : '';
    default:
      return '';
  }
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'change': {
      const newState = { ...state, [action.field]: action.value };
      const errorMessage = validateField(newState, action.field);
      return {
        ...newState,
        errori: { ...state.errori, [action.field]: errorMessage }
      };
    }
    case 'validate': {
      const errori: FormState['errori'] = {};
      for (const field of ['nome', 'email', 'telefono', 'password', 'conferma'] as const) {
        const err = validateField(state, field);
        if (err) errori[field] = err;
      }
      return { ...state, errori };
    }
    case 'reset':
      return initialState;
    default:
      return state;
  }
}
```


















La funzione `formReducer` è un **reducer puro** utilizzato da `useReducer` per gestire lo stato di un form complesso.
La sua responsabilità è **calcolare e restituire un nuovo stato** in base al tipo di azione ricevuta.

---

##  Firma della funzione

```ts
function formReducer(state: FormState, action: FormAction): FormState
```

* **`state`**: rappresenta lo stato attuale del form
* **`action`**: rappresenta l’evento che vogliamo gestire
* **Valore di ritorno**: il nuovo stato (`FormState`) calcolato in base all’azione

---

##  `switch (action.type)`

Il reducer valuta il tipo dell’azione per decidere come aggiornare lo stato.

---

###  `case 'change'`

Questa azione viene inviata quando **l’utente modifica un campo**.

```ts
const newState = { ...state, [action.field]: action.value };
```

* Crea una **copia aggiornata dello stato** sostituendo il valore del campo modificato

```ts
const errorMessage = validateField(newState, action.field);
```

* Esegue una validazione **immediata e specifica** del campo aggiornato

```ts
return {
  ...newState,
  errori: { ...state.errori, [action.field]: errorMessage }
};
```

* Restituisce il nuovo stato con:

  * Il nuovo valore del campo
  * L’eventuale messaggio di errore **specifico per quel campo**

> Questa gestione consente la **validazione in tempo reale**.

---

###  `case 'validate'`

Viene chiamata quando si vuole validare **l’intero form**, ad esempio alla pressione del tasto “Invia”.

```ts
const errori: FormState['errori'] = {};
for (const field of ['nome', 'email', 'telefono', 'password', 'conferma'] as const) {
  const err = validateField(state, field);
  if (err) errori[field] = err;
}
```

* Si crea un nuovo oggetto `errori` inizialmente vuoto
* Per ogni campo:

  * Si chiama `validateField`
  * Se viene restituito un messaggio di errore, viene salvato in `errori`

```ts
return { ...state, errori };
```

* Lo stato viene aggiornato **solo con i nuovi errori**, lasciando invariati i dati inseriti

> Questo è utile per una validazione completa prima dell’invio del form.

---

###  `case 'reset'`

```ts
return initialState;
```

* Riporta il form allo stato iniziale (valori vuoti e nessun errore)

---

###  `default`

```ts
return state;
```

* Se il tipo dell’azione non è gestito, il reducer **non modifica lo stato**

---

##  Comportamento riassuntivo

| Azione       | Effetto                                      |
| ------------ | -------------------------------------------- |
| `'change'`   | Aggiorna un campo e valida subito quel campo |
| `'validate'` | Valida tutti i campi del form                |
| `'reset'`    | Reimposta tutto il form allo stato iniziale  |

---

##  Best practice adottate

* Stato immutabile (`...state`)
* Validazione separata tramite `validateField`
* Gestione separata del campo `errori`
* Tipizzazione sicura (`FormState`, `FormAction`)

---






















---

## Componente `RegistrationForm`

```tsx
export default function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'change', field: e.target.name as any, value: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'validate' });

    const hasErrors = Object.values(state.errori).some(msg => msg !== '');
    if (!hasErrors) {
      alert('Registrazione valida. Pronta per l’invio!');
      // In futuro: invio dati al backend
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Registrazione</h2>

      <div>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={state.nome}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        {state.errori.nome && <p className="text-red-600 text-sm">{state.errori.nome}</p>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={state.email}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        {state.errori.email && <p className="text-red-600 text-sm">{state.errori.email}</p>}
      </div>

      <div>
        <input
          type="text"
          name="telefono"
          placeholder="Telefono"
          value={state.telefono}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        {state.errori.telefono && <p className="text-red-600 text-sm">{state.errori.telefono}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        {state.errori.password && <p className="text-red-600 text-sm">{state.errori.password}</p>}
      </div>

      <div>
        <input
          type="password"
          name="conferma"
          placeholder="Conferma password"
          value={state.conferma}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        {state.errori.conferma && <p className="text-red-600 text-sm">{state.errori.conferma}</p>}
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrati
        </button>
        <button type="button" onClick={() => dispatch({ type: 'reset' })} className="bg-gray-300 px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </form>
  );
}
```

---

## Vantaggi dell’approccio con `useReducer`

* Stato centralizzato e gestito con purezza
* Validazione real-time per ogni campo
* Separazione tra **logica di aggiornamento** e **presentazione**
* Pronto per l’integrazione futura con API di backend

---

































---

# **Esercizio – Form iscrizione evento con validazione personalizzata**

---

## Obiettivo

Realizzare un **form di iscrizione a un evento** che raccolga i seguenti dati:

### Campi richiesti

* `nomeCompleto`: minimo 3 caratteri
* `email`: formato email valido
* `eta`: numero tra 18 e 99
* `categoria`: selezione obbligatoria tra *Studente*, *Professionista*, *Altro*
* `noteFacoltative`: campo testuale opzionale (max 200 caratteri)

---

## Requisiti

* Utilizzare `useReducer` per gestire stato e validazione
* Validare i campi **in tempo reale durante la digitazione**
* Mostrare i messaggi di errore **solo per i campi non validi**
* Disabilitare il pulsante “Invia” se ci sono errori
* Pulsante “Reset” per riportare il form allo stato iniziale

---

## Struttura consigliata

Un singolo componente `EventoForm.tsx` con tutto lo stato gestito internamente.

---

#  Soluzione `EventoForm.tsx` (con commenti)

```tsx
import { useReducer } from 'react';

// 1. Stato e azioni
type FormState = {
  nomeCompleto: string;
  email: string;
  eta: string;
  categoria: string;
  noteFacoltative: string;
  errori: Partial<Record<keyof Omit<FormState, 'errori'>, string>>;
};

type FormAction =
  | { type: 'change'; field: keyof Omit<FormState, 'errori'>; value: string }
  | { type: 'validate' }
  | { type: 'reset' };

// 2. Stato iniziale
const initialState: FormState = {
  nomeCompleto: '',
  email: '',
  eta: '',
  categoria: '',
  noteFacoltative: '',
  errori: {}
};

// 3. Validazione campo singolo
function validateField(state: FormState, field: keyof Omit<FormState, 'errori'>): string {
  const value = state[field];

  switch (field) {
    case 'nomeCompleto':
      return value.trim().length < 3 ? 'Minimo 3 caratteri richiesti' : '';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email non valida';
    case 'eta':
      const etaNum = Number(value);
      if (isNaN(etaNum)) return 'Inserisci un numero';
      if (etaNum < 18 || etaNum > 99) return 'Età non valida';
      return '';
    case 'categoria':
      return value === '' ? 'Seleziona una categoria' : '';
    case 'noteFacoltative':
      return value.length > 200 ? 'Massimo 200 caratteri' : '';
    default:
      return '';
  }
}

// 4. Reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'change': {
      const newState = { ...state, [action.field]: action.value };
      const errorMessage = validateField(newState, action.field);
      return {
        ...newState,
        errori: { ...state.errori, [action.field]: errorMessage }
      };
    }
    case 'validate': {
      const errori: FormState['errori'] = {};
      for (const field of ['nomeCompleto', 'email', 'eta', 'categoria', 'noteFacoltative'] as const) {
        const err = validateField(state, field);
        if (err) errori[field] = err;
      }
      return { ...state, errori };
    }
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

// 5. Componente principale
export default function EventoForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dispatch({ type: 'change', field: e.target.name as any, value: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'validate' });

    const hasErrors = Object.values(state.errori).some(msg => msg !== '');
    if (!hasErrors) {
      alert('Modulo inviato correttamente!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold">Iscrizione evento</h2>

      <input
        name="nomeCompleto"
        placeholder="Nome completo"
        value={state.nomeCompleto}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      />
      {state.errori.nomeCompleto && <p className="text-red-600 text-sm">{state.errori.nomeCompleto}</p>}

      <input
        name="email"
        placeholder="Email"
        value={state.email}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      />
      {state.errori.email && <p className="text-red-600 text-sm">{state.errori.email}</p>}

      <input
        name="eta"
        placeholder="Età"
        value={state.eta}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      />
      {state.errori.eta && <p className="text-red-600 text-sm">{state.errori.eta}</p>}

      <select
        name="categoria"
        value={state.categoria}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      >
        <option value="">Seleziona una categoria</option>
        <option value="Studente">Studente</option>
        <option value="Professionista">Professionista</option>
        <option value="Altro">Altro</option>
      </select>
      {state.errori.categoria && <p className="text-red-600 text-sm">{state.errori.categoria}</p>}

      <textarea
        name="noteFacoltative"
        placeholder="Note (facoltativo)"
        value={state.noteFacoltative}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      />
      {state.errori.noteFacoltative && <p className="text-red-600 text-sm">{state.errori.noteFacoltative}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={Object.values(state.errori).some(e => e)}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Invia
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'reset' })}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
```

---


































---

# Modulo 2 – Ottimizzazione delle prestazioni con `useCallback` e `useMemo`

## Obiettivi del modulo

* Comprendere i motivi per cui un componente React può ri-renderizzare inutilmente
* Apprendere come ottimizzare la stabilità delle funzioni e dei valori computati
* Applicare `useCallback` e `useMemo` per prevenire re-render o ricalcoli costosi
* Integrare questi hook con tecniche come `React.memo` e `memoization` strutturata

---

## 1. Introduzione al problema: perché ottimizzare

React ri-renderizza un componente ogni volta che il suo stato o le sue props cambiano. Tuttavia, anche **funzioni e oggetti ricreati ad ogni render** vengono visti come "nuovi", causando re-render nei componenti figli anche se i dati reali non sono cambiati.

Due categorie di ottimizzazione:

1. **Stabilizzare funzioni** → `useCallback`
2. **Stabilizzare valori derivati/calcolati** → `useMemo`

---

## 2. `useCallback`

### Definizione

`useCallback` è un hook che **ritorna una versione memorizzata** di una funzione, che **non cambia finché non cambiano le sue dipendenze**.

```ts
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Use case

Supponiamo di avere un componente padre che passa una funzione come prop a un componente figlio memorizzato con `React.memo`. Senza `useCallback`, la funzione viene ricreata ad ogni render, invalidando la memoizzazione.

#### Esempio senza ottimizzazione

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('clicked');
  };

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  return <button onClick={onClick}>Click</button>;
});
```

> In questo esempio, `Child` si ri-renderizza ad ogni render di `Parent` perché `handleClick` è una nuova funzione ogni volta.

#### Versione ottimizzata

```tsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

Con `useCallback`, la funzione `handleClick` viene ricreata solo se cambiano le dipendenze (in questo caso, mai), evitando il re-render del figlio.

### Best practice

* Usa `useCallback` **solo** quando la funzione viene passata a componenti memorizzati (`React.memo`, `useEffect`, o altri hook che si basano sull’identità).
* Non abusare: `useCallback` ha un overhead minimo, ma inutile se la funzione non viene propagata o usata in dipendenze.

---

## 3. `useMemo`

### Definizione

`useMemo` memorizza il **valore di ritorno di una funzione computazionale** e lo ricompone solo se cambiano le dipendenze.

```ts
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);
```

### Quando usarlo

* Quando il calcolo è **costoso** (es. sorting, filtering, aggregazioni)
* Quando si vuole **evitare che un oggetto o array venga ricreato** inutilmente
* Quando si vogliono evitare re-render causati da oggetti “nuovi” nelle props

### Differenza con memoization manuale

`useMemo` è integrato nel ciclo di rendering di React.
Memoization manuale (ad esempio, con `lodash.memoize`) persiste tra render ma **fuori dallo scope di React**.

---

## 4. Integrazione con `React.memo`

`React.memo` è un HOC (Higher-Order Component) che evita il re-render di un componente **se le props non cambiano per riferimento (shallow compare)**.

### Esempio:

```tsx
const MyComponent = React.memo(({ data }: { data: string }) => {
  return <div>{data}</div>;
});
```

Affinché funzioni bene:

* Le props devono essere **primitive o memorizzate** (`useMemo`, `useCallback`)
* Le funzioni passate come prop devono essere stabilizzate


---

## 6. Errori comuni

| Errore                                                  | Soluzione                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Usare `useCallback` per ogni funzione                   | Usarlo solo se la funzione è passata a componenti memorizzati         |
| Dipendenze errate o mancanti nei deps array             | Usare ESLint plugin `react-hooks/exhaustive-deps`                     |
| Usare `useMemo` per evitare re-render di tipo "normale" | `useMemo` **non previene il re-render**, solo il ricalcolo del valore |
| Aspettarsi che `useMemo` memoizzi per sempre            | I valori sono **ricreati se cambia qualsiasi dipendenza**             |




























---

## Obiettivo dell’esempio

* Abbiamo una lista di prodotti
* Possiamo filtrarla per nome
* Un componente figlio visualizza i prodotti
* Evitiamo di **ricalcolare i prodotti filtrati** inutilmente con `useMemo`
* Evitiamo che il componente figlio **si ri-renderizzi inutilmente** con `React.memo`

---

## `ProductList.tsx` (componente memorizzato)

```tsx
// Questo componente riceve un array già filtrato
// e non ha bisogno di ri-renderizzarsi se i prodotti non cambiano
import React from 'react';

type Product = { id: number; name: string };

type Props = {
  products: Product[];
};

const ProductList = React.memo(({ products }: Props) => {
  console.log('Render: ProductList'); // visibile solo se ri-render avviene

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
});

export default ProductList;
```

---

## `App.tsx`

```tsx
import { useState, useMemo } from 'react';
import ProductList from './ProductList';

type Product = { id: number; name: string };

export default function App() {
  // Stato della lista originale dei prodotti
  const [products] = useState<Product[]>([
    { id: 1, name: 'Pane' },
    { id: 2, name: 'Latte' },
    { id: 3, name: 'Caffè' },
    { id: 4, name: 'Pasta' },
    { id: 5, name: 'Biscotti' },
  ]);

  // Stato del filtro da input
  const [search, setSearch] = useState('');

  // Ricalcolo dei prodotti filtrati: solo se `products` o `search` cambiano
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Catalogo prodotti</h1>

      {/* Campo di ricerca */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca prodotto..."
        className="w-full border px-4 py-2"
      />

      {/* Lista dei prodotti filtrati */}
      <ProductList products={filteredProducts} />
    </div>
  );
}
```

---

## Spiegazione passo-passo

### 1. `useMemo`

```tsx
const filteredProducts = useMemo(() => {
  return products.filter(...);
}, [products, search]);
```

* **Evita di rifare il `filter`** ogni volta che il componente `App` si ri-renderizza
* Il valore viene **ricalcolato solo se cambia la lista originale o il filtro**

### 2. `React.memo`

```tsx
const ProductList = React.memo(({ products }) => { ... });
```

* Impedisce il re-render del componente `ProductList` **se la prop `products` non cambia per riferimento**
* Grazie a `useMemo`, `products` cambia solo quando necessario

### 3. Ottimizzazione congiunta

* Senza `useMemo`, ogni modifica del filtro produce una nuova `products`, anche se identica → causa re-render di `ProductList`
* Senza `React.memo`, anche con `useMemo`, il figlio si ri-renderizza comunque

---

## Verifica del comportamento

* Inserisci `console.log` dentro `ProductList` e nel `useMemo`
* Digita qualcosa nell’input e osserva:

  * `Filtering products...` viene eseguito solo quando il filtro cambia
  * `Render: ProductList` si attiva solo se cambia davvero la lista

---

## Considerazioni finali

| Tecnica      | Scopo                                                   |
| ------------ | ------------------------------------------------------- |
| `useMemo`    | Ottimizza i calcoli, evita rielaborazioni               |
| `React.memo` | Ottimizza il rendering, evita ri-render non necessari   |
| Combinazione | Massima efficienza nella propagazione e visualizzazione |

---

































* Gestire uno **stato globale** con Redux (una lista di elementi)
* Ottimizzare **funzioni e dati derivati** con `useMemo` e `useCallback`
* Impedire **ri-render inutili** grazie a `React.memo`

---

#  Scenario

Un’app che gestisce una lista di **prodotti nel carrello**.
Ogni prodotto ha:

* `id`, `nome`, `prezzo`, `quantità`

Gli utenti possono:

* Aggiungere prodotti
* Modificare quantità
* Vedere il **totale complessivo**, ottimizzato con `useMemo`

---

##  1. `cartSlice.ts` (Redux Toolkit)

```ts
// redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const initialState: Product[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const existing = state.find(p => p.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.push(action.payload);
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.find(p => p.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    }
  }
});

export const { addProduct, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
```

---

##  2. `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

##  3. `ProductRow.tsx` (React.memo + useCallback)

```tsx
import React from 'react';

type Props = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  onUpdate: (id: number, quantity: number) => void;
};

const ProductRow = React.memo(({ id, name, price, quantity, onUpdate }: Props) => {
  console.log(`Rendering: ${name}`); 
// Il componente ProductRow è memorizzato con React.memo per evitare il suo ri-render
// quando le sue props (id, name, price, quantity, onUpdate) non cambiano per valore o riferimento.
// Questo è particolarmente utile in liste con molti elementi,
// dove anche piccoli cambiamenti nello stato globale o nel componente genitore
// possono altrimenti causare il re-render dell'intera lista.
// In questo caso, React.memo confronta shallowmente le props:
// - Se tutte le props sono identiche (===), il componente NON si ri-renderizza.
// - Se una funzione (es. onUpdate) viene ricreata a ogni render senza useCallback,
//   React.memo vedrà una nuova reference e il componente verrà comunque ri-renderizzato.
// Per questo motivo, onUpdate è stabilizzato nel genitore tramite useCallback.
// Inoltre, il console.log all'interno serve a tracciare quali item vengono effettivamente ri-renderizzati.


  return (
    <li className="flex justify-between items-center border-b py-1">
      <span>{name}</span>
      <span>€{price}</span>
      <input
        type="number"
        value={quantity}
        min={1}
        onChange={(e) => onUpdate(id, Number(e.target.value))}
        className="w-16 text-right border px-1"
      />
    </li>
  );
});

export default ProductRow;
```

> `React.memo` evita il re-render di ogni `ProductRow` se le props non cambiano (grazie a `useCallback` più avanti).

---

##  4. `Cart.tsx` (useMemo + useCallback)

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { updateQuantity } from './cartSlice';
import ProductRow from './ProductRow';
import { useCallback, useMemo } from 'react';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.cart);

  // useCallback → funzione stabile per React.memo
  const handleUpdateQuantity = useCallback((id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  }, [dispatch]);

// handleUpdateQuantity è memorizzata tramite useCallback per garantire che la funzione
// mantenga la stessa identità tra i render, a meno che non cambi la funzione dispatch.
// Questo è essenziale quando la funzione viene passata come prop a un componente memorizzato con React.memo,
// come ProductRow, che effettua un confronto shallow tra le props per decidere se ri-renderizzarsi.
// Senza useCallback, ad ogni render di Cart si creerebbe una nuova funzione,
// invalidando la memoizzazione del figlio e causando un re-render inutile.
// In questo caso, l’unica dipendenza è dispatch, che è stabile per definizione (Redux la fornisce).


  // useMemo → calcolo del totale solo se cambia il contenuto del carrello
  const total = useMemo(() => {
    console.log('Ricalcolo totale');
    return products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }, [products]);

// Il valore total è calcolato tramite useMemo per evitare il ricalcolo della somma complessiva
// ad ogni render del componente Cart, anche quando la lista dei prodotti non è cambiata.
// Poiché il calcolo del totale può diventare costoso in caso di molte righe (es. riduzione su array di grandi dimensioni),
// useMemo memoizza il valore restituendo il risultato precedente fino a quando la dipendenza (products) non cambia.
// products è selezionato dallo store Redux, quindi la sua identità cambia solo se effettivamente modificato,
// garantendo così che total venga ricalcolato solo nei casi necessari.
// Il console.log permette di monitorare quando il ricalcolo effettivamente avviene.


  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Carrello</h2>

      <ul>
        {products.map(p => (
          <ProductRow
            key={p.id}
            {...p}
            onUpdate={handleUpdateQuantity}
          />
        ))}
      </ul>

      <p className="text-right font-bold">Totale: €{total.toFixed(2)}</p>
    </div>
  );
}
```

---

##  Spiegazione delle ottimizzazioni

| Elemento      | Scopo                                                               |
| ------------- | ------------------------------------------------------------------- |
| `useCallback` | Stabilizza la funzione `handleUpdateQuantity` per evitare re-render |
| `React.memo`  | Evita il re-render dei `ProductRow` se le props non cambiano        |
| `useMemo`     | Evita ricalcoli del totale a ogni render del componente             |

---

##  Osservazioni pratiche

* Ogni `ProductRow` stampa su console se si ri-renderizza: puoi verificare se tutto è ottimizzato correttamente
* La funzione `onUpdate` è stabile e non cambia a ogni render
* Il totale viene ricalcolato solo se cambia il contenuto del carrello

---

























## 1. Differenze concettuali tra `React.memo` e `useCallback`

| Aspetto             | `React.memo`                                                      | `useCallback`                                              |
| ------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Cos'è               | Un **Higher-Order Component**                                     | Un **hook React**                                          |
| Cosa ottimizza      | Il **rendering di componenti**                                    | L’**identità delle funzioni**                              |
| Come funziona       | Evita il re-render se le props non cambiano                       | Restituisce sempre la **stessa funzione** tra render       |
| Quando si applica   | Alla definizione di un componente React                           | Alla definizione di una funzione **interna al componente** |
| Relazione tra i due | Lavora **sul figlio**                                             | Serve a evitare di invalidare il memo del figlio           |
| Quando usarlo       | Per componenti "foglia" che ricevono oggetti o funzioni come prop | Quando una funzione viene passata a un figlio memoizzato   |

---

## 2. Integrazione combinata: come usarli insieme

### Caso tipico:

Un componente padre gestisce uno stato o seleziona dati da Redux, e passa funzioni e dati a un componente figlio.

### Best practice:

* **Memoizza il componente figlio** con `React.memo`
* **Stabilizza le funzioni passate** con `useCallback`
* **Stabilizza i dati derivati** (es. array, numeri calcolati) con `useMemo`

---

### Esempio:

```tsx
const filteredList = useMemo(() => {
  return items.filter(item => item.available);
}, [items]);

const handleUpdate = useCallback((id, qty) => {
  dispatch(updateQty({ id, qty }));
}, [dispatch]);

return (
  <ItemList items={filteredList} onUpdate={handleUpdate} />
);
```

```tsx
// Componente figlio memorizzato
const ItemList = React.memo(({ items, onUpdate }) => {
  return items.map(i => <Item key={i.id} {...i} onUpdate={onUpdate} />);
});
```

> In questo schema: `useMemo` evita ricalcoli, `useCallback` evita di passare nuove funzioni a ogni render, `React.memo` evita render inutili del figlio.

---

## 3. Best practice generali

### `useCallback`

* Usalo **solo se necessario**, ovvero:

  * Quando una funzione viene **passata a componenti memorizzati**
  * Quando è tra le **dipendenze di un `useEffect`** o di un `useMemo`
* Evita di memorizzare funzioni che non causano problemi se ricreate
* Controlla sempre le **dipendenze** nel secondo argomento (non lasciarle vuote se usi variabili esterne)

---

### `React.memo`

* Applicalo a **componenti "foglia" o isolati** che:

  * Ricevono **props stabili**
  * Non devono re-renderizzare ogni volta
* Può essere meno utile per componenti ad alto livello che cambiano spesso

---

### `useMemo`

* Usalo per:

  * **Valori derivati** (es. `filter`, `reduce`, `sort`)
  * **Oggetti complessi** passati come prop o dipendenza
* Evita di usarlo per semplici valori o stringhe
* Non fornisce un caching "globale": viene invalidato ad ogni cambio delle dipendenze

---

## 4. Errori comuni

| Errore                                                         | Come evitarlo                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| Usare `useCallback` su ogni funzione                           | Applicalo solo se strettamente necessario                     |
| Dimenticare dipendenze nei `deps` array                        | Usa il plugin ESLint `react-hooks/exhaustive-deps`            |
| Usare `useMemo` su primitive o calcoli banali                  | Usalo solo su valori costosi o oggetti/array complessi        |
| Passare nuove funzioni a componenti memorizzati (`React.memo`) | Stabilizza con `useCallback`                                  |
| Pensare che `useMemo` impedisca il re-render                   | `useMemo` **evita ricalcoli**, ma **non** impedisce re-render |

---

## 5. Quando non usare questi strumenti

* Se l'app è semplice, o non ha problemi di performance evidenti
* Se i componenti figlio si devono aggiornare comunque spesso
* Se i dati sono già primitivi o stabili (es. numeri, stringhe dirette)
* Se stai creando premature optimizations: **misura prima di ottimizzare**

---

## 6. Conclusione

In progetti React complessi:

* **`React.memo`** va applicato a componenti foglia stabili
* **`useCallback`** è utile per stabilizzare funzioni usate come prop
* **`useMemo`** ottimizza i calcoli costosi e previene il passaggio di oggetti/array “nuovi” a ogni render

Il loro uso combinato è fondamentale per evitare sprechi computazionali e rendere l’app scalabile e fluida.
Ma vanno usati **con criterio**, **solo quando serve**, e **dove impattano davvero** sulle prestazioni.


































---

#  Checklist: `useMemo`, `useCallback`, `React.memo`

---

##  Prima di tutto: **serve davvero ottimizzare?**

* [ ] Ci sono evidenti rallentamenti causati da re-render o calcoli costosi?
* [ ] Hai misurato (con React DevTools, Profiler, logs) dove avvengono i re-render?
* [ ] I dati o le funzioni sono passati a componenti figli `React.memo`?

Se **no** a tutte → non ottimizzare prematuramente.

---

##  `React.memo` – Componente memorizzato

Usalo se:

* [ ] Il componente è "foglia" (non contiene altri componenti dinamici)
* [ ] Le props cambiano raramente
* [ ] Le props sono primitive o memorizzate con `useMemo`/`useCallback`

Evita se:

* [ ] Il componente è ad alto livello e cambia spesso
* [ ] Il componente è già molto leggero e non impatta le prestazioni

---

##  `useCallback` – Funzione stabile tra render

Usalo se:

* [ ] Passi la funzione a un componente `React.memo`
* [ ] Passi la funzione a un `useEffect`, `useMemo` o `useImperativeHandle`
* [ ] La funzione è definita dentro il componente e cambierebbe a ogni render

Controlla sempre:

* [ ] Il secondo argomento `[deps]` è completo e corretto

Evita se:

* [ ] La funzione non viene propagata come prop
* [ ] La funzione è banale o usata localmente

---

##  `useMemo` – Calcolo o oggetto memorizzato

Usalo se:

* [ ] Stai calcolando un valore derivato (es. filtro, reduce, sort)
* [ ] Stai passando un oggetto/array come prop
* [ ] Il calcolo è computazionalmente costoso o provoca re-render a cascata

Controlla:

* [ ] Le dipendenze `[deps]` sono tutte incluse
* [ ] Non stai memorizzando un valore primitivo (es. `useMemo(() => 5, [])` è inutile)

---

##  Insieme (uso combinato)

✔ Schema consigliato:

```tsx
const filtered = useMemo(() => filter(items), [items, criteria]);
const handleClick = useCallback(() => dispatch(...), [dispatch]);

return <ChildComponent data={filtered} onClick={handleClick} />;
```

* [ ] `filtered`: ricalcolato solo quando cambiano i dati
* [ ] `handleClick`: stabile nel tempo
* [ ] `ChildComponent`: definito con `React.memo`

---

##  Errori comuni da evitare

* [ ] `useCallback` su funzioni che non vengono propagate
* [ ] `useMemo` su valori banali o su oggetti che non causano re-render
* [ ] Props passate a `React.memo` non stabilizzate (array, oggetti, funzioni)
* [ ] Mancanza o eccesso di dipendenze nei `deps[]`
* [ ] Pensare che `useMemo` eviti i re-render (previene solo il ricalcolo)

---

##  In sintesi

| Obiettivo                                  | Strumento     |
| ------------------------------------------ | ------------- |
| Evitare re-render di un componente figlio  | `React.memo`  |
| Evitare che una funzione cambi ogni volta  | `useCallback` |
| Evitare ricalcoli complessi su ogni render | `useMemo`     |

---



































---

#  Traccia dell’esercizio – Lista delle attività con ottimizzazioni

##  Obiettivo

Realizzare un'applicazione React in cui:

* Viene gestita una lista di **attività (tasks)** usando Redux Toolkit
* È possibile **aggiungere un’attività**, **completarla** e visualizzarla nella lista
* Il totale delle attività completate viene **calcolato con `useMemo`**
* Ogni `TaskItem` è memorizzato con `React.memo`
* La funzione `toggleDone` è stabilizzata con `useCallback` per evitare ri-render non necessari

---

##  Requisiti tecnici

* Utilizzare Redux Toolkit (`createSlice`, `configureStore`)
* Utilizzare `useSelector`, `useDispatch` e i tipi `RootState`, `AppDispatch`
* Integrare `useMemo`, `useCallback` e `React.memo` correttamente
* Strutturare il progetto in 3 componenti:

  * `App.tsx` (gestione generale e logica)
  * `TaskList.tsx` (lista delle attività)
  * `TaskItem.tsx` (singolo task, memorizzato)

---

#  Soluzione passo-passo

---

## 1. Redux – `tasksSlice.ts`

```ts
// redux/tasksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.push({ id: Date.now(), title: action.payload, done: false });
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.find(t => t.id === action.payload);
      if (task) task.done = !task.done;
    }
  }
});

export const { addTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;
```

---

## 2. Redux – `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 3. Componente `App.tsx`

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { addTask, toggleTask } from './tasksSlice';
import TaskList from './TaskList';
import { useState, useCallback, useMemo } from 'react';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks);
  const [title, setTitle] = useState('');

  // Funzione stabilizzata per evitare nuovi riferimenti a ogni render
  const handleToggle = useCallback((id: number) => {
    dispatch(toggleTask(id));
  }, [dispatch]);

  // Calcolo memorizzato per evitare ricalcoli continui
  const completedCount = useMemo(() => {
    console.log('Calcolo attività completate');
    return tasks.filter(t => t.done).length;
  }, [tasks]);

  const handleAdd = () => {
    if (title.trim() !== '') {
      dispatch(addTask(title.trim()));
      setTitle('');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-semibold">Lista attività</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-4 py-2"
        placeholder="Nuova attività"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Aggiungi
      </button>

      <p className="text-sm text-gray-600">
        Completate: {completedCount} / {tasks.length}
      </p>

      <TaskList tasks={tasks} onToggle={handleToggle} />
    </div>
  );
}
```

---

## 4. Componente `TaskList.tsx`

```tsx
import TaskItem from './TaskItem';
import React from 'react';
import { Task } from './tasksSlice';

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
};

export default function TaskList({ tasks, onToggle }: Props) {
  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          id={task.id}
          title={task.title}
          done={task.done}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
```

---

## 5. Componente `TaskItem.tsx` (React.memo)

```tsx
import React from 'react';

type Props = {
  id: number;
  title: string;
  done: boolean;
  onToggle: (id: number) => void;
};

// React.memo evita il ri-render se le props non cambiano
const TaskItem = React.memo(({ id, title, done, onToggle }: Props) => {
  console.log(`Render task: ${title}`);

  return (
    <li className="flex justify-between items-center border-b pb-1">
      <span className={done ? 'line-through text-gray-500' : ''}>{title}</span>
      <button
        onClick={() => onToggle(id)}
        className="text-sm text-blue-600 hover:underline"
      >
        {done ? 'Annulla' : 'Completa'}
      </button>
    </li>
  );
});

export default TaskItem;
```

---

#  Cosa si impara da questo esercizio

| Concetto      | Applicazione                                                |
| ------------- | ----------------------------------------------------------- |
| `useMemo`     | Calcolo del numero di attività completate                   |
| `useCallback` | Funzione `onToggle` stabilizzata per evitare re-render      |
| `React.memo`  | `TaskItem` renderizzato solo se le props cambiano realmente |
| Redux Toolkit | Stato globale e mutazioni ottimizzate con `createSlice`     |

---





















































---

#  Modulo 3 — Custom Hooks: creare hook riutilizzabili

---

##  Obiettivi

* Incapsulare logiche complesse e ripetitive in funzioni riutilizzabili
* Separare la logica di comportamento dalla presentazione visiva
* Favorire **manutenibilità**, **leggibilità** e **riutilizzabilità** del codice
* Costruire un proprio "dominio di hook" personalizzati coerenti con le regole React

---

## 1. Cosa sono i Custom Hooks

Un **Custom Hook** è una semplice funzione JavaScript che:

* **segue la convenzione `useNome`**
* **chiama al suo interno altri hook di React** (come `useState`, `useEffect`, `useRef`, ecc.)
* **ritorna dati, funzioni o stati** utili per la logica del componente

Esempio generale:

```ts
function useEsempio() {
  const [valore, setValore] = useState(0);

  useEffect(() => {
    console.log('effetto attivato');
  }, []);

  return { valore, setValore };
}
```

> I Custom Hook **non sono JSX** e **non restituiscono componenti**. Sono funzioni puramente logiche.

---

## 2. Convenzione di nomenclatura

Per funzionare correttamente con le **regole degli hook di React** e con i plugin ESLint dedicati, un Custom Hook deve:

* **iniziare con `use`**
* **essere chiamato solo in componenti o in altri hook**

Esempi validi:

* `useForm`, `useTimer`, `useWindowSize`, `useAuth`

---

## 3. Incapsulazione degli hook interni

I Custom Hook sono spesso un wrapper di più hook nativi React:

| Hook base   | Esempio d’uso nel Custom Hook              |
| ----------- | ------------------------------------------ |
| `useState`  | Gestione stato locale (`useForm`)          |
| `useEffect` | Esecuzione logica su mount/update          |
| `useRef`    | Tracciare elementi DOM (`useClickOutside`) |

---

## 4. API esposte: parametri e valore di ritorno

Un buon Custom Hook:

* Accetta **parametri chiari**
* Restituisce **solo l’API necessaria** (evita ritorni troppo grandi o destrutturati)

Esempio:

```ts
function useTimer(initial: number) {
  const [count, setCount] = useState(initial);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setCount(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [active]);

  return { count, start: () => setActive(true), pause: () => setActive(false), reset: () => setCount(initial) };
}
```

---

## 5. Best Practice

| Buona pratica                              | Motivazione                                                           |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Nome sempre con `use`                      | Garantisce corretto funzionamento e riconoscimento dalle regole React |
| Responsabilità unica                       | Ogni hook gestisce **una cosa sola**, chiara e isolata                |
| Return coerente e minimalista              | Evitare di restituire troppi valori o strutture complesse             |
| Separare logica da presentazione           | I Custom Hook non contengono né gestiscono JSX                        |
| Incapsulare solo ciò che si ripete davvero | Evitare premature abstraction (non tutto va incapsulato)              |
| Documentare cosa fa e cosa restituisce     | Soprattutto se l’hook gestisce side effects o interazioni asincrone   |

---

I Custom Hook sono uno strumento fondamentale per scrivere codice React:

* **Pulito**
* **Riutilizzabile**
* **Testabile**
* **Scalabile**

Sono il modo idiomatico in cui React consiglia di gestire logica condivisa senza usare HOC o classi.
La loro efficacia aumenta quando associati a `useMemo`, `useCallback`, Redux o altri sistemi esterni.

---












































---

##  Obiettivo

Creare un Custom Hook `useForm<T>()` generico per:

* Gestire lo stato dei campi del form
* Fornire un handler `onChange`
* Offrire una funzione `reset()`
* Incapsulare tutto **senza duplicare logica nei componenti**

---

##  Struttura dei file

```
src/
├── hooks/
│   └── useForm.ts
├── components/
│   └── FormComponent.tsx
```

---

##  1. `useForm.ts` – Il Custom Hook

```ts
import { useState } from 'react';

/**
 * Custom Hook per la gestione dello stato di un form.
 * @param initialValues Oggetto con i valori iniziali del form
 * @returns Un oggetto con valori, handleChange e reset
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  // Handler universale per tutti gli input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset dei valori iniziali
  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    reset,
  };
}
```

###  Spiegazione

* Il tipo generico `<T>` rende il hook **riutilizzabile per qualsiasi struttura di form**
* `handleChange` gestisce dinamicamente tutti gli input con `name`
* `reset` ripristina lo stato iniziale del form

---

##  2. `FormComponent.tsx` – Uso pratico

```tsx
import { useForm } from '../hooks/useForm';

type FormData = {
  nome: string;
  email: string;
};

export default function FormComponent() {
  const { values, handleChange, reset } = useForm<FormData>({
    nome: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dati inviati:', values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Iscriviti alla newsletter</h2>

      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={values.nome}
        onChange={handleChange}
        className="w-full border px-3 py-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        className="w-full border px-3 py-2"
      />

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Invia
        </button>
        <button type="button" onClick={reset} className="bg-gray-300 px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </form>
  );
}
```

---

##  Best practice applicate

| Principio                 | Applicazione                                                     |
| ------------------------- | ---------------------------------------------------------------- |
| **Responsabilità unica**  | `useForm` gestisce solo lo stato dei campi                       |
| **API minima**            | Ritorna solo `values`, `handleChange`, `reset`                   |
| **Nessun JSX** nel hook   | Separazione netta tra logica (hook) e presentazione (componente) |
| **Tipizzazione generica** | Supporta form diversi senza riscrivere codice                    |
| **Input controllati**     | Lo stato del form è centralizzato e sincronizzato                |

---
---




















































---

##  A cosa servono i Custom Hooks

I Custom Hooks sono ideali per gestire **logiche ripetitive o complesse** che non riguardano la presentazione ma il **comportamento e lo stato interno** dell’applicazione.

### Esempi d’uso tipici:

| Caso d’uso                        | Custom Hook possibile                 |
| --------------------------------- | ------------------------------------- |
| Gestione di un form               | `useForm`                             |
| Countdown o timer                 | `useTimer`                            |
| Recupero dati da un’API           | `useFetch`, `useData`                 |
| Eventi di scrolling, resize, ecc. | `useWindowSize`, `useScroll`          |
| Click al di fuori di un ref       | `useClickOutside`                     |
| Persistenza in localStorage       | `useLocalStorage`                     |
| Interazione con WebSocket         | `useSocket`                           |
| Stato condiviso non globale       | `useCounter`, `useToggle`, `useModal` |

---

##  Vantaggi dei Custom Hook

* **Separazione della logica dal rendering**
  → migliorano leggibilità e testabilità
* **Riutilizzabilità**
  → non devi riscrivere la stessa logica in ogni componente
* **Composizione**
  → possono essere **combinati** tra loro o con hook nativi
* **Conformità allo standard React**
  → funzionano con lo stesso modello di `useState`, `useEffect`, ecc.

---

##  Best Practice per l’uso dei Custom Hook

### 1. **Segui la convenzione `useNome`**

* Obbligatorio per permettere a React e a ESLint di riconoscere correttamente il hook.

### 2. **Responsabilità singola**

* Un Custom Hook deve fare **una cosa sola** e farla bene.
* Evita hook che gestiscono comportamenti non correlati.

### 3. **Nessun JSX**

* I Custom Hook **non rendono nulla**: servono solo a gestire dati o eventi.
* Non usare hook per generare componenti.

### 4. **API chiara e minimale**

* Ritorna solo le funzioni e i dati essenziali.
* Preferisci oggetti con proprietà nominate (`{ value, onChange }`) a ritorni posizionali (`[val, setVal]`), soprattutto per hook complessi.

### 5. **Parametri in input espliciti**

* Se serve personalizzazione (es. timeout, endpoint, configurazioni), passala tramite argomenti al momento della chiamata del hook.

### 6. **Documentazione e nomi parlanti**

* Nomina il hook secondo la sua responsabilità reale (`useTimer`, non `useUtils`).
* Documenta cosa accetta, cosa restituisce e quando si aggiorna.

### 7. **Testabilità**

* I Custom Hook non hanno dipendenze visive e sono più facili da testare.
* Possono (e dovrebbero) essere testati con `@testing-library/react-hooks` o simili.

---

##  Errori da evitare

| Errore                                                    | Perché è un problema                       |
| --------------------------------------------------------- | ------------------------------------------ |
| Creare hook troppo generici (es. `useUtils`, `useCommon`) | Perdi leggibilità e coerenza               |
| Restituire molti valori destrutturati                     | Porta a errori in ordine o ambiguità d’uso |
| Scrivere side effects fuori da `useEffect`                | Violazione delle regole degli hook         |
| Chiamare un hook in condizioni (if, loop, callback)       | Rompe le regole degli hook React           |
| Usare un hook per puro convenience senza vero riutilizzo  | Introduce complessità inutile              |

---

##  In sintesi

> I Custom Hook servono per incapsulare comportamenti riutilizzabili che usano hook React.
> Seguono le regole degli hook, hanno responsabilità chiara, nessun JSX, e restituiscono un’API minimalista.

---































---

# 📘 Caso d’uso: gestione avanzata di un elenco di libri

L'app mostra un elenco di libri con:

* Titolo, autore, prezzo, genere
* Campo di ricerca per autore
* Filtro per genere
* Calcolo del prezzo totale filtrato (memoizzato)
* Ogni libro ha un bottone per essere "selezionato" per la lettura

---

##  1. Redux – `booksSlice.ts`

```ts
// redux/booksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  selected: boolean;
};

const initialState: Book[] = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Tech', price: 32, selected: false },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Fiction', price: 15, selected: false },
  { id: 3, title: 'Il nome della rosa', author: 'Umberto Eco', genre: 'Historical', price: 22, selected: false },
];

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    toggleSelected: (state, action: PayloadAction<number>) => {
      const book = state.find(b => b.id === action.payload);
      if (book) book.selected = !book.selected;
    }
  }
});

export const { toggleSelected } = booksSlice.actions;
export default booksSlice.reducer;
```

---

##  2. `store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

##  3. `useFilteredBooks.ts` – Custom Hook

```ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useMemo } from 'react';

export function useFilteredBooks(search: string, genre: string) {
  const books = useSelector((state: RootState) => state.books);

  return useMemo(() => {
    return books.filter(book => {
      const matchesAuthor = book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === '' || book.genre === genre;
      return matchesAuthor && matchesGenre;
    });
  }, [books, search, genre]);
}
```

---

##  4. `BookItem.tsx` – Componente memorizzato

```tsx
import React from 'react';

type Props = {
  id: number;
  title: string;
  author: string;
  price: number;
  genre: string;
  selected: boolean;
  onToggle: (id: number) => void;
};

const BookItem = React.memo(({ id, title, author, price, genre, selected, onToggle }: Props) => {
  console.log(`Render: ${title}`);

  return (
    <li className="flex justify-between items-center py-2 border-b">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{author} • {genre}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-800">€{price}</span>
        <button
          onClick={() => onToggle(id)}
          className={`text-sm px-2 py-1 rounded ${selected ? 'bg-green-200' : 'bg-gray-200'}`}
        >
          {selected ? 'Rimosso' : 'Seleziona'}
        </button>
      </div>
    </li>
  );
});

export default BookItem;
```

---

##  5. `BookList.tsx`

```tsx
import { Book } from '../redux/booksSlice';
import BookItem from './BookItem';

type Props = {
  books: Book[];
  onToggle: (id: number) => void;
};

export default function BookList({ books, onToggle }: Props) {
  return (
    <ul className="space-y-2">
      {books.map(book => (
        <BookItem key={book.id} {...book} onToggle={onToggle} />
      ))}
    </ul>
  );
}
```

---

##  6. `App.tsx`

```tsx
import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { toggleSelected } from './redux/booksSlice';
import { useFilteredBooks } from './hooks/useFilteredBooks';
import BookList from './components/BookList';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const books = useFilteredBooks(search, genre);

  const total = useMemo(() => {
    console.log('Calcolo totale libri selezionati');
    return books
      .filter(book => book.selected)
      .reduce((sum, b) => sum + b.price, 0);
  }, [books]);

  const handleToggle = useCallback((id: number) => {
    dispatch(toggleSelected(id));
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Libreria</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Cerca autore"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 w-full"
        />

        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="border px-2 py-1">
          <option value="">Tutti i generi</option>
          <option value="Tech">Tech</option>
          <option value="Fiction">Fiction</option>
          <option value="Historical">Historical</option>
        </select>
      </div>

      <BookList books={books} onToggle={handleToggle} />

      <p className="text-right mt-4 font-semibold">
        Totale selezionati: €{total.toFixed(2)}
      </p>
    </div>
  );
}
```

---

## Cosa dimostra questo esempio

| Tecnica           | Applicazione                                                   |
| ----------------- | -------------------------------------------------------------- |
| **Redux Toolkit** | Gestione globale della lista dei libri                         |
| **Custom Hook**   | `useFilteredBooks` per filtraggio ottimizzato e riutilizzabile |
| **`useMemo`**     | Calcolo del totale solo quando necessario                      |
| **`useCallback`** | Funzione `onToggle` stabile per `React.memo`                   |
| **`React.memo`**  | `BookItem` renderizza solo se le sue props cambiano            |

---
























---

##  Quando usare un **Custom Hook**

> **✔ Migliore per la logica locale, personalizzata o combinata con altri hook**

### Usa un Custom Hook per i filtri quando:

* Il filtro dipende da **stato locale del componente** (`useState`, `useRef`)
* Vuoi combinare altri hook (es. `useMemo`, `useEffect`, `useCallback`) nella logica
* Il filtro **non deve essere condiviso tra più componenti**
* Stai costruendo una **logica specifica per una pagina o vista**
* Non vuoi aumentare la complessità dello store Redux

### Esempio tipico:

```tsx
const filtered = useFilteredBooks(search, genre);
```

### Vantaggi:

* Codice leggibile e vicino al componente
* Incapsulamento flessibile e riutilizzabile
* Nessuna dipendenza dallo stato globale dei filtri

---

##  Quando usare un **selector (Redux Toolkit + `createSelector`)**

> **✔ Migliore per dati derivati globali, memorizzabili o condivisi tra componenti**

### Usa un selector per i filtri quando:

* I criteri di filtro sono **salvati nello stato globale** (es. `filterState.search`)
* Più componenti o pagine devono accedere agli stessi dati filtrati
* Vuoi centralizzare la **derivazione dello stato** nello store Redux
* Devi sfruttare la **memoizzazione globale** (`createSelector`) tra più componenti
* Hai bisogno di mantenere la **logica del filtro testabile in Redux**

### Esempio:

```ts
const selectFilteredBooks = createSelector(
  [selectAllBooks, selectSearch, selectGenre],
  (books, search, genre) => books.filter(...)
);
```

### Vantaggi:

* Riusabilità centralizzata
* Memoizzazione più controllata e coerente
* Facile da testare in isolamento
* Conformità a un’architettura Flux o modulare

---

##  Confronto riassuntivo

| Criterio                       | Custom Hook (`useFilteredBooks`) | Redux Selector (`createSelector`) |
| ------------------------------ | -------------------------------- | --------------------------------- |
| Stato di filtro è locale       | ✅ Sì                             | ❌ No (serve salvarlo nello store) |
| Stato di filtro è globale      | ❌ No                             | ✅ Sì                              |
| Multi-componente               | ❌ Non ideale                     | ✅ Condiviso facilmente            |
| Combina hook (useEffect, etc.) | ✅ Naturale                       | ❌ Non applicabile                 |
| Facilità d’uso nel componente  | ✅ Molto diretto                  | ➖ Richiede setup più ampio        |
| Testabilità indipendente       | ➖ Media                          | ✅ Alta                            |

---

##  Best practice

* **Per logiche locali o composte da altri hook** → usa **Custom Hook**
* **Per derivare dati da Redux, condivisi o memorizzati** → usa **Redux + selector**

---

### Approccio ibrido (consigliato in progetti grandi)

* Filtro **salvato nello store Redux** (es. `filtersSlice`)
* Selector `createSelector` per i dati derivati
* Custom Hook `useFilteredBooks()` che **combina `useSelector` con il selector**
  → così ottieni il meglio di entrambi: **struttura Redux + semplicità d'uso nel componente**

---



































---

#  **Traccia esercizio – Dashboard di film preferiti**

##  Obiettivo

Realizzare un'applicazione React che gestisca una lista di film e consenta:

* La **selezione di film come "preferiti"**
* Il **filtro per genere** e la **ricerca per titolo**
* Il calcolo **memoizzato** del numero di film selezionati
* Un componente figlio **memorizzato** che renderizza ogni film
* L’uso di un **Custom Hook** per incapsulare la logica di filtro

---

##  Requisiti tecnici

* **Redux Toolkit** per la gestione dello stato dei film
* **Custom Hook** per il filtraggio dinamico dei film (`useFilteredMovies`)
* **`useCallback`** per la funzione di selezione preferiti
* **`useMemo`** per il conteggio dei film selezionati
* **`React.memo`** per il componente `MovieItem`

---

##  Struttura attesa

```
src/
├── redux/
│   └── moviesSlice.ts
│   └── store.ts
├── hooks/
│   └── useFilteredMovies.ts
├── components/
│   └── MovieList.tsx
│   └── MovieItem.tsx
└── App.tsx
```

---

##  Specifiche funzionali

* Ogni film ha: `id`, `title`, `genre`, `year`, `isFavorite`
* I film possono essere selezionati/deselezionati come preferiti
* La ricerca è case-insensitive sul titolo
* Il filtro è per genere (dropdown)
* Il calcolo dei preferiti è ottimizzato con `useMemo`
* Ogni riga (`MovieItem`) è memorizzata con `React.memo`

---

##  Soluzione (semplificata ma completa)

###  `redux/moviesSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Movie = {
  id: number;
  title: string;
  genre: string;
  year: number;
  isFavorite: boolean;
};

const initialState: Movie[] = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, isFavorite: false },
  { id: 2, title: 'The Godfather', genre: 'Drama', year: 1972, isFavorite: false },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', year: 2014, isFavorite: false },
];

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const movie = state.find(m => m.id === action.payload);
      if (movie) movie.isFavorite = !movie.isFavorite;
    }
  }
});

export const { toggleFavorite } = moviesSlice.actions;
export default moviesSlice.reducer;
```

---

###  `redux/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';

export const store = configureStore({
  reducer: { movies: moviesReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

###  `hooks/useFilteredMovies.ts`

```ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useMemo } from 'react';

export function useFilteredMovies(search: string, genre: string) {
  const movies = useSelector((state: RootState) => state.movies);

  return useMemo(() => {
    return movies.filter(m => {
      const matchesTitle = m.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === '' || m.genre === genre;
      return matchesTitle && matchesGenre;
    });
  }, [movies, search, genre]);
}
```

---

###  `components/MovieItem.tsx`

```tsx
import React from 'react';

type Props = {
  id: number;
  title: string;
  genre: string;
  year: number;
  isFavorite: boolean;
  onToggle: (id: number) => void;
};

const MovieItem = React.memo(({ id, title, genre, year, isFavorite, onToggle }: Props) => {
  return (
    <li className="flex justify-between items-center border-b py-1">
      <div>
        <strong>{title}</strong> ({year}) – {genre}
      </div>
      <button onClick={() => onToggle(id)} className="text-sm">
        {isFavorite ? '★ Preferito' : '☆ Aggiungi'}
      </button>
    </li>
  );
});

export default MovieItem;
```

---

###  `components/MovieList.tsx`

```tsx
import { Movie } from '../redux/moviesSlice';
import MovieItem from './MovieItem';

type Props = {
  movies: Movie[];
  onToggle: (id: number) => void;
};

export default function MovieList({ movies, onToggle }: Props) {
  return (
    <ul className="space-y-2">
      {movies.map(m => (
        <MovieItem key={m.id} {...m} onToggle={onToggle} />
      ))}
    </ul>
  );
}
```

---

###  `App.tsx`

```tsx
import { useDispatch } from 'react-redux';
import { useState, useCallback, useMemo } from 'react';
import { AppDispatch } from './redux/store';
import { toggleFavorite } from './redux/moviesSlice';
import { useFilteredMovies } from './hooks/useFilteredMovies';
import MovieList from './components/MovieList';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const movies = useFilteredMovies(search, genre);

  const favoriteCount = useMemo(() => {
    return movies.filter(m => m.isFavorite).length;
  }, [movies]);

  const handleToggle = useCallback((id: number) => {
    dispatch(toggleFavorite(id));
  }, [dispatch]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">I miei film</h1>

      <div className="flex gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per titolo"
          className="flex-1 border px-3 py-1"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="border px-2 py-1">
          <option value="">Tutti</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Drama">Drama</option>
        </select>
      </div>

      <MovieList movies={movies} onToggle={handleToggle} />

      <p className="mt-4 text-right font-semibold">
        Preferiti: {favoriteCount}
      </p>
    </div>
  );
}
```

