## Quick Start: Creazione di un Nuovo Progetto React

Questa sezione fornisce un'introduzione rapida ai concetti fondamentali di React. L'obiettivo è acquisire familiarità con circa l'80% delle funzionalità che si utilizzano quotidianamente nello sviluppo di interfacce React.

### Obiettivi formativi

Al termine di questa sezione sarai in grado di:

- Creare e annidare componenti React
- Aggiungere markup e stili
- Visualizzare dati all'interno dell'interfaccia
- Gestire condizioni e liste
- Rispondere a eventi dell'utente e aggiornare lo schermo
- Condividere dati tra componenti

---

## Creazione e Annidamento di Componenti

Le applicazioni React sono costituite da **componenti**. Un componente è una porzione dell’interfaccia utente (UI) che possiede una propria logica e un proprio aspetto. Può essere semplice come un pulsante o complesso come un’intera pagina.

In React, un componente è una **funzione JavaScript** che restituisce del markup JSX.

### Esempio: dichiarazione di un componente

```jsx
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Nel frammento sopra, `MyButton` è un componente che restituisce un pulsante.

Una volta dichiarato, è possibile **annidare il componente all’interno di un altro componente**:

```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

### Convenzioni di denominazione

I nomi dei componenti React **devono iniziare con una lettera maiuscola**. Questo permette a React di distinguere tra componenti personalizzati (`<MyButton />`) e tag HTML standard (`<div>`, `<h1>`, ecc.), che devono invece essere scritti in minuscolo.

---

## Codice completo di esempio

```jsx
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Questo esempio rappresenta la base di qualsiasi applicazione React. `MyApp` è il componente principale, che racchiude altri componenti più piccoli come `MyButton`.

---

## Scrivere Markup con JSX

In React, la sintassi utilizzata per descrivere l’interfaccia utente è chiamata **JSX** (JavaScript XML). Anche se opzionale, JSX è ampiamente utilizzato per la sua leggibilità e praticità. Tutti gli strumenti moderni di sviluppo frontend supportano JSX nativamente.

### Caratteristiche di JSX

JSX è una sintassi più rigorosa rispetto all’HTML tradizionale. Comporta alcune differenze fondamentali:

- Tutti i tag devono essere **chiusi correttamente**. Esempio: `<br />`
- I componenti **non possono restituire più elementi di primo livello**. È necessario racchiuderli all’interno di un unico contenitore, come un `<div>...</div>` oppure un frammento vuoto `<>...</>`.

### Esempio

```jsx
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

In questo esempio, il componente restituisce più tag JSX avvolti in un frammento (`<>...</>`), che non genera markup aggiuntivo nel DOM.

> Nota: se devi convertire grandi blocchi HTML in JSX, esistono strumenti online che possono automatizzare la conversione.

---

## Aggiunta di Stili in React

In React, per assegnare una classe CSS a un elemento si utilizza l’attributo `className`, al posto dell’attributo `class` usato in HTML.

### Esempio

```jsx
<img className="avatar" />
```

### CSS corrispondente

```css
/* In un file CSS separato */
.avatar {
  border-radius: 50%;
}
```

React non impone un metodo specifico per includere i file CSS. Il metodo più semplice è aggiungere un tag `<link>` nel file HTML, oppure importare direttamente i file CSS nel file JavaScript principale se si utilizza un sistema di build (come Vite o Webpack).

---

## Visualizzare Dati in JSX

JSX consente di **inserire espressioni JavaScript** all’interno del markup tramite l’uso delle **parentesi graffe `{}`**. Questo permette di visualizzare dinamicamente variabili o risultati di funzioni.

### Esempio di inserimento di una variabile

```jsx
return (
  <h1>{user.name}</h1>
);
```

### JSX negli attributi

È possibile utilizzare espressioni JavaScript anche negli attributi JSX. In questo caso, si utilizza `{}` invece delle virgolette.

```jsx
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

### Espressioni complesse

È anche possibile scrivere espressioni JavaScript più articolate direttamente all’interno di JSX, come concatenazioni di stringhe, espressioni booleane, operazioni matematiche, ecc.

---

## Esempio completo

```jsx
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

In questo esempio:

- `user.name` e `user.imageUrl` sono stampati dinamicamente all’interno dell’interfaccia
- L’attributo `style` utilizza una sintassi oggetto (`{}`) per specificare larghezza e altezza
- La variabile `user.imageSize` controlla dinamicamente le dimensioni dell’immagine

> Nota: `style={{...}}` non è una sintassi speciale di React, ma una normale espressione JavaScript: l’oggetto CSS è inserito all’interno delle parentesi `{}` del JSX.

---



## Rendering Condizionale

In React, **non esiste una sintassi speciale per le condizioni**: si utilizzano le normali espressioni JavaScript. È possibile controllare cosa visualizzare nell'interfaccia in base a condizioni logiche, utilizzando `if`, l’operatore ternario `? :`, oppure l’operatore logico `&&`.

### Esempio con istruzione `if`

```jsx
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}

return (
  <div>
    {content}
  </div>
);
```

In questo esempio, il componente visualizzerà `AdminPanel` solo se `isLoggedIn` è vero, altrimenti visualizzerà `LoginForm`.

---

### Operatore ternario `? :` all’interno di JSX

Per scrivere condizioni in modo più compatto, si può usare l’operatore ternario direttamente nel JSX:

```jsx
return (
  <div>
    {isLoggedIn ? (
      <AdminPanel />
    ) : (
      <LoginForm />
    )}
  </div>
);
```

---

### Operatore logico `&&`

Quando si desidera visualizzare un elemento solo in presenza di una condizione, senza ramo "else", è possibile usare l’operatore `&&`.

```jsx
return (
  <div>
    {isLoggedIn && <AdminPanel />}
  </div>
);
```

> Tutti questi approcci sono validi anche per assegnare **attributi condizionali**. Se non si conosce ancora bene la sintassi JavaScript, si consiglia di partire sempre con `if...else` e passare agli altri metodi in seguito.

---

## Rendering di Liste

Per visualizzare elenchi di elementi in React, si utilizzano i costrutti standard del JavaScript, come i cicli `for` o la funzione `map()` degli array.

### Esempio: lista di prodotti

```jsx
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Per trasformare questa lista in una serie di elementi `<li>`, si usa `map()`:

```jsx
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

### Importanza dell’attributo `key`

Ogni elemento di una lista in JSX **deve avere un attributo `key`** univoco, generalmente basato su un identificatore presente nei dati (es. `id` da un database). Questo permette a React di ottimizzare le operazioni di aggiornamento, inserimento e rimozione degli elementi nel DOM virtuale.

---

## Esempio completo: lista con stile condizionale

```jsx
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

In questo esempio:

- La funzione `map()` genera un elenco di `<li>` a partire dall’array `products`
- Il colore del testo è determinato in modo dinamico: `magenta` se `isFruit` è `true`, altrimenti `darkgreen`
- Ogni elemento ha un attributo `key` univoco

---











# **Esercizio: Lista Utenti e Accesso Amministratore**

## Obiettivo

Creare una semplice applicazione React che:

1. Mostra un'intestazione personalizzata
2. Visualizza un messaggio di benvenuto condizionato in base al login
3. Elenca una lista di utenti con caratteristiche dinamiche
4. Applica stili condizionati agli elementi in lista
5. Utilizza componenti riutilizzabili e strutturati correttamente

---

## Specifiche

### 1. Componente principale: `App.jsx`

- Deve contenere un componente `Header` con un titolo dell’applicazione.
- Deve dichiarare una variabile booleana `isAdmin` che rappresenta lo stato di accesso.
- In base a `isAdmin`, mostra uno dei due componenti:
  - `AdminPanel` se `isAdmin === true`
  - `LoginPrompt` se `isAdmin === false`
- Deve sempre mostrare la lista utenti sotto al contenuto condizionale, indipendentemente dallo stato `isAdmin`.

---

### 2. Componente `Header.jsx`

- Mostra un semplice titolo, ad esempio: “Gestione Utenti”
- Utilizza un tag `h1` con una classe CSS personalizzata (`header-title`)

---

### 3. Componente `AdminPanel.jsx`

- Restituisce un paragrafo con il testo: “Accesso amministratore attivo.”

---

### 4. Componente `LoginPrompt.jsx`

- Restituisce un paragrafo con il testo: “Effettua il login per accedere all’area riservata.”

---

### 5. Componente `UserList.jsx`

- Contiene un array chiamato `users`, ad esempio:

```jsx
const users = [
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Clara', isActive: true },
];
```

- Utilizza `map()` per creare un elenco di `<li>` con lo stile dinamico:
  - Se `isActive` è `true`, il nome deve essere verde (`green`)
  - Altrimenti, deve essere grigio (`gray`)
- Ogni elemento deve avere `key={user.id}`

---

### 6. Styling

Crea un file CSS (`App.css`) e definisci:

```css
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}
```

All’interno di `App.jsx`, importa il file CSS con:

```jsx
import './App.css';
```

---

## Requisiti tecnici

- Utilizzare solo componenti funzionali
- Utilizzare JSX valido con un contenitore unico nei `return`
- Usare `className` per applicare stili
- Utilizzare `{}` per visualizzare dati dinamici e per espressioni logiche
- Ogni componente deve essere salvato in un file separato

---







Ecco la **soluzione completa e guidata** dell’esercizio “Lista Utenti e Accesso Amministratore”, suddivisa in file modulari come in un progetto reale. Tutti i componenti sono scritti con **JSX valido**, seguendo le **best practice** trattate.

---

## **1. File: `App.jsx`**

```jsx
import './App.css';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import LoginPrompt from './components/LoginPrompt';
import UserList from './components/UserList';

const isAdmin = true; // Modifica per testare il rendering condizionale

export default function App() {
  return (
    <>
      <Header />
      {isAdmin ? <AdminPanel /> : <LoginPrompt />}
      <UserList />
    </>
  );
}
```

---

## **2. File: `components/Header.jsx`**

```jsx
export default function Header() {
  return (
    <h1 className="header-title">Gestione Utenti</h1>
  );
}
```

---

## **3. File: `components/AdminPanel.jsx`**

```jsx
export default function AdminPanel() {
  return (
    <p>Accesso amministratore attivo.</p>
  );
}
```

---

## **4. File: `components/LoginPrompt.jsx`**

```jsx
export default function LoginPrompt() {
  return (
    <p>Effettua il login per accedere all’area riservata.</p>
  );
}
```

---

## **5. File: `components/UserList.jsx`**

```jsx
export default function UserList() {
  const users = [
    { id: 1, name: 'Alice', isActive: true },
    { id: 2, name: 'Bob', isActive: false },
    { id: 3, name: 'Clara', isActive: true },
  ];

  const listItems = users.map(user => (
    <li
      key={user.id}
      style={{
        color: user.isActive ? 'green' : 'gray',
      }}
    >
      {user.name}
    </li>
  ));

  return <ul>{listItems}</ul>;
}
```

---

## **6. File: `App.css`**

```css
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}
```

---

## Struttura consigliata del progetto

```
src/
├── components/
│   ├── AdminPanel.jsx
│   ├── Header.jsx
│   ├── LoginPrompt.jsx
│   └── UserList.jsx
├── App.jsx
├── App.css
├── main.jsx
```

> Ricorda di aggiornare eventualmente anche `main.jsx` per montare correttamente `App`.










---

## Rispondere agli Eventi

In React, è possibile gestire gli eventi utente (come click, input, submit, ecc.) dichiarando delle **funzioni gestore (event handler)** all’interno del componente.

### Esempio: gestione di un click

```jsx
function MyButton() {
  function handleClick() {
    alert('Hai cliccato il pulsante!');
  }

  return (
    <button onClick={handleClick}>
      Cliccami
    </button>
  );
}
```

> **Nota importante:** l’attributo `onClick={handleClick}` **non deve contenere le parentesi tonde**. Si passa la funzione come riferimento, non la si invoca direttamente. Sarà React a chiamarla al momento dell’evento.

---

## Aggiornare lo Schermo: lo Stato dei Componenti

Spesso un componente deve **ricordare delle informazioni** nel tempo, come ad esempio quante volte è stato cliccato un pulsante. Per fare questo si utilizza lo **stato locale**.

### 1. Importare `useState`

```jsx
import { useState } from 'react';
```

### 2. Dichiarare una variabile di stato

```jsx
const [count, setCount] = useState(0);
```

`useState` restituisce:

- una variabile (`count`) che rappresenta lo stato corrente
- una funzione (`setCount`) per aggiornare il valore

La convenzione è usare `[qualcosa, setQualcosa]` per nominarli in modo coerente.

---

### 3. Esempio completo: contatore

```jsx
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Cliccato {count} volte
    </button>
  );
}
```

Ogni volta che l’utente clicca il pulsante:

1. Viene chiamata la funzione `handleClick`
2. Viene invocato `setCount(count + 1)`
3. React **ricalcola il componente** e aggiorna il valore di `count` nell’interfaccia

---

### 4. Stato indipendente tra più componenti

Ogni istanza di un componente possiede il **proprio stato separato**. Se si renderizza lo stesso componente più volte, ciascuno “ricorderà” il proprio valore di stato.

### Esempio

```jsx
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Contatori indipendenti</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Cliccato {count} volte
    </button>
  );
}
```

In questo esempio:

- I due pulsanti sono istanze indipendenti di `MyButton`
- Ciascuno ha il proprio stato `count`
- Il click su un pulsante **non influenza** l’altro

---

## Conclusione

La combinazione tra **eventi** e **stato** è ciò che permette a React di creare interfacce interattive e reattive. Ogni componente può rispondere agli input dell’utente e aggiornarsi dinamicamente, mantenendo il proprio stato in modo isolato e predicibile.

---













## Utilizzare gli Hook in React

In React, le funzioni che iniziano con `use` sono chiamate **Hook**. Un Hook consente ai componenti funzionali di gestire lo **stato locale** e altri aspetti del ciclo di vita dei componenti, che in passato erano riservati ai componenti a classe.

### `useState`

È l'Hook più semplice e più utilizzato. Serve per dichiarare uno stato locale all'interno di un componente.

```jsx
import { useState } from 'react';
```

Dichiarazione:

```jsx
const [variabile, setVariabile] = useState(valoreIniziale);
```

Esempio:

```jsx
const [count, setCount] = useState(0);
```

- `count`: rappresenta il valore attuale dello stato
- `setCount`: è la funzione per aggiornare il valore
- Il valore iniziale è `0` nel caso sopra

### Regole per l’uso degli Hook

- Gli Hook **possono essere chiamati solo** all’inizio di un componente o di un altro Hook personalizzato.
- **Non è possibile** chiamare un Hook all’interno di cicli, condizioni, o blocchi nidificati.
- Se serve una logica condizionale, è necessario estrarre la parte interessata in un nuovo componente.

---

## Condivisione dei Dati tra Componenti

In React, ogni componente gestisce il proprio stato in modo **isolato**. Per esempio, se si hanno due pulsanti che utilizzano `useState` internamente, ognuno manterrà il proprio valore:

```jsx
<MyButton />
<MyButton />
```

Ogni `MyButton` ha uno `useState` separato.

### Quando è necessario condividere lo stato?

In molti casi, è desiderabile che **più componenti utilizzino e aggiornino uno stato comune**. Per ottenere questo comportamento, si sposta lo stato “verso l’alto” nel componente **genitore comune**, e lo si passa ai figli tramite **props**.

---

## Esempio: *Lifting State Up*

### 1. Stato gestito individualmente da ciascun pulsante

```jsx
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Cliccato {count} volte
    </button>
  );
}
```

Ogni pulsante mantiene il proprio stato in modo indipendente.

---

### 2. Spostare lo stato nel componente padre

Per sincronizzare il valore tra più componenti:

```jsx
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Contatori sincronizzati</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

---

### 3. Componente figlio che riceve `props`

```jsx
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Cliccato {count} volte
    </button>
  );
}
```

---

### Cosa succede al click

- Il pulsante chiama `onClick`, che corrisponde a `handleClick` nel componente padre.
- `handleClick` aggiorna lo stato condiviso con `setCount(count + 1)`.
- Poiché lo stato è nel componente padre, **entrambi i figli** ricevono il nuovo valore aggiornato e vengono ri-renderizzati con `count` incrementato.

---

## Conclusione

Questo approccio è noto come **lifting state up**:

- Si centralizza lo stato in un componente più in alto nella gerarchia
- Si passa il valore e la funzione di aggiornamento ai componenti figli tramite `props`
- Permette una **gestione sincronizzata dello stato condiviso**, mantenendo la logica chiara e riutilizzabile

---











---

#  **Esercizio: Todo List Semaforica**

##  **Obiettivo**

Creare una piccola Todo List React che:

- Visualizza un elenco di task
- Permette di marcare un task come "completato"
- Cambia il colore del testo in base allo stato (rosso = da fare, verde = fatto)
- Mostra un messaggio se non ci sono task
- Conta quanti task sono stati completati
- È divisa in componenti

---

##  **Concetti React applicati**

- Componenti funzionali
- Stato con `useState`
- Rendering condizionale (`?` e `&&`)
- Rendering dinamico di liste (`map`)
- Gestione eventi (`onClick`)
- Passaggio di props
- Styling dinamico con `style={{}}`
- Lifting state up

---

##  **Specifiche**

### 1. `App.jsx`  
Componente principale che:

- Contiene la lista delle task
- Mostra il numero di task completate
- Passa le props a `TaskList`
- Mostra un messaggio se la lista è vuota

### 2. `TaskList.jsx`  
Componente secondario che:

- Riceve l’array di task e una funzione `toggleDone(id)`
- Mappa ogni task in un componente `TaskItem`

### 3. `TaskItem.jsx`  
Componente per ogni task:

- Riceve `name`, `isDone`, `onToggle`
- Mostra il testo colorato in base allo stato
- Mostra un pulsante “Completa” / “Annulla”

---

##  Stato iniziale

```js
[
  { id: 1, name: 'Studiare React', isDone: false },
  { id: 2, name: 'Fare la spesa', isDone: true },
  { id: 3, name: 'Allenarsi', isDone: false }
]
```

---

##  Esempio visivo dell’interfaccia

```
-------------------------------------------
 Titolo: Le mie cose da fare

 Completati: 1 / 3

 Lista attività:
 - Studiare React     [Completa]    (rosso)
 - Fare la spesa      [Annulla]     (verde)
 - Allenarsi          [Completa]    (rosso)
-------------------------------------------
```

### Lista vuota

```
-------------------------------------------
 Titolo: Le mie cose da fare

 Nessuna attività da mostrare.
-------------------------------------------
```

---

##  Requisiti tecnici

- `useState` per gestire la lista task
- Funzione `toggleDone(id)` per aggiornare lo stato
- Condizione `isDone ? "Annulla" : "Completa"`
- Colore dinamico: rosso se da fare, verde se completato
- Componenti separati: `App.jsx`, `TaskList.jsx`, `TaskItem.jsx`

---

##  Estensioni (facoltative)

- Aggiungi una `input box` per creare una nuova attività
- Ordina i task: completati in fondo
- Mostra il totale delle task solo se la lista non è vuota

---












---

## Struttura del progetto e responsabilità

```
src/
├── App.jsx
│   ├── useState:
│   │   ├── tasks        // Array di oggetti con { id, name, isDone }
│   │   └── newTask      // Stringa contenente il testo dell'input
│   ├── handleAddTask()  // Aggiunge una nuova attività alla lista
│   ├── toggleDone(id)   // Inverte lo stato isDone dell’attività specificata
│   ├── completedCount   // Calcola il numero di task completate
│   ├── sortedTasks      // Ordina la lista: non completate prima
│   └── render:
│       ├── Titolo e input
│       ├── Messaggio condizionale se lista vuota
│       ├── Conteggio task completate
│       └── <TaskList tasks={...} onToggleDone={...} />
│
├── App.css
│   ├── Stili base per layout, pulsanti, input, messaggi, lista
│   ├── .container       // Contenitore centrale con padding e ombre
│   ├── .add-form        // Stile del form input + button
│   ├── .empty-message   // Messaggio in caso di lista vuota
│   ├── .task-item       // Stile singolo task
│   └── Comportamenti responsive minimi
│
└── components/
    ├── TaskList.jsx
    │   ├── props:
    │   │   ├── tasks          // Array di task ordinati
    │   │   └── onToggleDone   // Funzione per aggiornare stato del task
    │   └── render:
    │       └── <ul> contenente una lista di <TaskItem />
    │
    └── TaskItem.jsx
        ├── props:
        │   ├── name           // Nome della task
        │   ├── isDone         // Stato booleano della task
        │   └── onToggle       // Funzione da chiamare al click del bottone
        └── render:
            ├── <span> con testo colorato (verde/rosso)
            └── <button> con testo dinamico ("Completa"/"Annulla")
```

---

## Flusso dei dati e responsabilità

```
+------------------------+            (gestisce lo stato globale)
|        App.jsx         |
|------------------------|
| - Stato: tasks         |
| - Stato: newTask       |
| - Funz: handleAddTask  |
| - Funz: toggleDone     |
| - Propaga i dati       |
|                        |
|     ↓ props            |
+------------------------+
           |
           v
+------------------------+
|     TaskList.jsx       |         (componente di presentazione lista)
|------------------------|
| - Riceve: tasks        |
| - Riceve: onToggleDone |
| - Mappa: <TaskItem />  |
+------------------------+
           |
           v
+------------------------+
|     TaskItem.jsx       |         (componente singola attività)
|------------------------|
| - Riceve: name, isDone |
| - Riceve: onToggle     |
| - Mostra nome colorato |
| - Pulsante dinamico    |
+------------------------+
```

---

## Comportamento dinamico

| Evento                       | Effetto                                                           |
|-----------------------------|-------------------------------------------------------------------|
| Scrittura nell’input        | Aggiorna `newTask` tramite `onChange`                            |
| Click su "Aggiungi"         | Se `newTask` non è vuoto, aggiunge nuovo task con `isDone: false`|
| Click su "Completa/Annulla" | Chiama `onToggle` → modifica `isDone` del task corrispondente    |
| Lista vuota                 | Mostra messaggio: "Nessuna attività da mostrare."                |
| Stato `isDone` → true       | Testo verde, bottone mostra "Annulla"                            |
| Stato `isDone` → false      | Testo rosso, bottone mostra "Completa"                           |
| Ordinamento attivo          | Le task non completate appaiono in cima alla lista               |

---





















---

## File: `App.jsx`

```jsx
import { useState } from 'react';
import './App.css';
import TaskList from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Studiare React', isDone: false },
    { id: 2, name: 'Fare la spesa', isDone: true },
    { id: 3, name: 'Allenarsi', isDone: false },
  ]);

  const [newTask, setNewTask] = useState('');

  function handleAddTask() {
    const trimmed = newTask.trim();
    if (trimmed === '') return;

    const newEntry = {
      id: Date.now(),
      name: trimmed,
      isDone: false,
    };

    setTasks([...tasks, newEntry]);
    setNewTask('');
  }

  function toggleDone(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
  }

  const completedCount = tasks.filter((task) => task.isDone).length;

  const sortedTasks = [
    ...tasks.filter((t) => !t.isDone),
    ...tasks.filter((t) => t.isDone),
  ];

  return (
    <div className="container">
      <h1>Le mie cose da fare</h1>

      <div className="add-form">
        <input
          type="text"
          placeholder="Nuova attività"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Aggiungi</button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-message">Nessuna attività da mostrare.</p>
      ) : (
        <>
          <p>Completate: {completedCount} / {tasks.length}</p>
          <TaskList tasks={sortedTasks} onToggleDone={toggleDone} />
        </>
      )}
    </div>
  );
}
```

---

## File: `components/TaskList.jsx`

```jsx
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggleDone }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          name={task.name}
          isDone={task.isDone}
          onToggle={() => onToggleDone(task.id)}
        />
      ))}
    </ul>
  );
}
```

---

## File: `components/TaskItem.jsx`

```jsx
export default function TaskItem({ name, isDone, onToggle }) {
  return (
    <li className="task-item">
      <span
        style={{
          color: isDone ? 'green' : 'red',
          fontWeight: 'bold',
          marginRight: '10px',
        }}
      >
        {name}
      </span>
      <button onClick={onToggle}>
        {isDone ? 'Annulla' : 'Completa'}
      </button>
    </li>
  );
}
```




---

## **Le `key` in React: concetti fondamentali**

In React, la proprietà `key` è un identificatore **univoco e stabile** assegnato agli elementi di una lista per aiutare React a gestire in modo efficiente il processo di **reconciliation**, ovvero l’aggiornamento del Virtual DOM rispetto al DOM reale.

React non rende visibile `key` come una prop normale: essa viene usata internamente per confrontare le versioni precedenti e successive della lista durante il rendering, al fine di determinare quali elementi sono stati aggiunti, rimossi o modificati.

---

## **Perché `key` è necessaria**

Durante il rendering di una lista dinamica con `Array.map()`, ogni elemento viene trasformato in un componente o nodo JSX. In questo processo, React ha bisogno di una `key` per:

1. **Individuare elementi stabili**: permette a React di capire quali elementi sono identici da un render all’altro.
2. **Evitare ri-render inutili**: se una `key` non cambia, React può riutilizzare il nodo DOM precedente anziché distruggerlo e ricrearlo.
3. **Evitare bug legati allo stato locale**: quando le `key` non sono univoche, React può "confondere" gli elementi, applicando stato o effetti a componenti sbagliati.

---

## **Come React usa le `key`**

Durante l’aggiornamento del Virtual DOM, React:

1. Scorre la vecchia lista di elementi (render precedente).
2. Scorre la nuova lista di elementi (render attuale).
3. Confronta le `key` di ciascun elemento.
4. Determina:
   - quali elementi **rimangono** (stessa key),
   - quali sono **nuovi** (nuova key),
   - quali vanno **rimossi** (key non più presenti).

Questo confronto è molto efficiente se le `key` sono **univoche e stabili nel tempo**.

---

## **Best practice per l'uso delle `key`**

### 1. **Usare identificatori univoci**

Utilizzare un identificatore univoco proveniente dai dati (ad esempio un ID del database) è la scelta più corretta.

```jsx
{items.map(item => (
  <ListItem key={item.id} data={item} />
))}
```

### 2. **Evitare di usare l'indice dell’array come `key`**

Usare l’indice (`index`) dell’array come `key` è **sconsigliato**, specialmente se:

- L’ordine degli elementi può cambiare.
- Gli elementi possono essere aggiunti o rimossi.

Questo perché l’indice può cambiare tra un render e l’altro, portando React ad associare un contenuto a un elemento sbagliato.

```jsx
//  Sconsigliato
{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}
```

### 3. **La `key` non è disponibile nel componente figlio**

La `key` è una **prop riservata a React**, non viene passata al componente figlio e non può essere acceduta tramite `props`.

Se hai bisogno del valore della chiave (ad esempio un ID) nel componente figlio, devi passarlo **esplicitamente** come una prop aggiuntiva:

```jsx
<TaskItem key={task.id} id={task.id} ... />
```

### 4. **La `key` deve essere unica nel contesto della lista**

È sufficiente che la `key` sia univoca **all’interno della lista in cui viene usata**. Non serve che sia univoca in tutto il DOM.

---

## **Casi particolari e implicazioni**

### 1. **Liste con animazioni o transizioni**

Le `key` diventano ancora più critiche quando si lavora con liste animate (es. `react-transition-group`). In questi casi, l’associazione corretta dei nodi influisce direttamente sull’esperienza utente e sul comportamento visivo.

### 2. **Componenti complessi con stato locale**

Se ogni elemento della lista ha uno stato interno (`useState`, `useEffect`, ecc.), l’uso corretto delle `key` impedisce che React "scambi" uno stato con un altro tra gli elementi della lista.

---

## **Conclusione**

L’uso corretto delle `key` è essenziale per ottenere prestazioni ottimali e comportamenti prevedibili in React, soprattutto quando si lavora con liste dinamiche. Assegnare `key` univoche e stabili permette a React di eseguire confronti intelligenti tra versioni del Virtual DOM, evitando ri-render inutili e bug logici.






---

## File: `App.css`

```css
body {
  font-family: sans-serif;
  background-color: #f0f2f5;
  padding: 40px;
  margin: 0;
}

.container {
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.empty-message {
  font-style: italic;
  color: #888;
}

ul {
  list-style: none;
  padding-left: 0;
}

.task-item {
  margin-bottom: 12px;
}
```

---

## Funzionalità implementate

| Funzionalità                                 | Stato   |
|----------------------------------------------|---------|
| Visualizzazione attività                     | ✅       |
| Gestione stato completato/non completato     | ✅       |
| Ordinamento: non completate prima            | ✅       |
| Campo input per inserimento                  | ✅       |
| Pulsante per aggiungere                      | ✅       |
| Stili dinamici (verde/rosso)                 | ✅       |
| Componente separato per ogni task            | ✅       |
| Componente `TaskList` come wrapper dinamico  | ✅       |
| Messaggio se lista vuota                     | ✅       |
| Interfaccia responsive di base               | ✅       |

---












## 🔍 Obiettivo: Comunicazione tra componenti

In un'applicazione React ben strutturata, i componenti genitori **gestiscono lo stato** e i componenti figli **ricevono i dati e le funzioni** attraverso le props. Questo approccio segue il principio del **data flow unidirezionale**: i dati fluiscono dall'alto verso il basso (*top-down*), mentre le interazioni risalgono tramite funzioni passate come props.

---

##  Teoria e best practice applicate nel codice

### 1. **Il componente principale (`App`) gestisce lo stato**

```jsx
const [tasks, setTasks] = useState([...]);
```

**Motivazione teorica**:  
React promuove una logica in cui **il componente che possiede i dati è responsabile anche della loro modifica**. In questo caso, `App` è il "single source of truth" per l’elenco delle attività. Nessun componente figlio ha il controllo diretto su `tasks`.

---

### 2. **Le funzioni di modifica sono dichiarate nel componente genitore**

```jsx
function toggleDone(id) {
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, isDone: !task.isDone } : task
  );
  setTasks(updatedTasks);
}
```

**Motivazione teorica**:  
Gestendo la logica di modifica nello stesso componente che controlla lo stato, si garantisce **consistenza, riusabilità** e separazione tra **logica** e **presentazione**. I componenti figli (come `TaskItem`) sono **dumb components**: non contengono logica, ma si limitano a mostrare i dati e notificare eventi.

---

### 3. **Le funzioni vengono passate come props ai componenti figli**

```jsx
<TaskItem
  key={task.id}
  name={task.name}
  isDone={task.isDone}
  onToggle={() => onToggleDone(task.id)}
/>
```

**Best practice**:  
- Non passare `task` interi se non necessario (meglio passare solo ciò che serve).
- Usare una funzione **wrapper** (`() => onToggleDone(task.id)`) per **"forzare" un parametro** senza eseguire subito la funzione.

**Alternativa da evitare**:

```jsx
<TaskItem onToggle={onToggleDone(task.id)} /> //  Esecuzione immediata
```

---

### 4. **Il componente `TaskItem` riceve solo le props necessarie**

```jsx
function TaskItem({ name, isDone, onToggle })
```

**Best practice**:
- Le props devono essere **esplicite e minimali**, così il componente è più leggibile, riutilizzabile e facilmente testabile.
- Non serve passare oggetti complessi (es. l’intero `task`) se bastano `name`, `isDone` e `onToggle`.

---

### 5. **Le funzioni ricevute come props sono usate come handler**

```jsx
<button onClick={onToggle}>
```

**Motivazione teorica**:
- Le funzioni passate come props sono **callback controllate dal genitore**.
- Quando l'utente interagisce (clicca), il figlio invoca la funzione, ma **non conosce né gestisce lo stato**, delegando completamente al padre.

---

##  Cosa **non** fare (errori comuni)

| Errore | Descrizione | Soluzione |
|--------|-------------|-----------|
| **Modificare lo stato nel figlio** | Violazione dell’isolamento e perdita di controllo | Gestire tutto nel genitore |
| **Passare oggetti interi inutilmente** | Aumenta accoppiamento e uso di memoria | Passare solo le props strettamente necessarie |
| **Invocare subito le funzioni (`onToggle={func()}`)** | Causa chiamate non desiderate al primo render | Usare arrow function per ritardare l’esecuzione |
| **Prop drilling eccessivo** | Far passare funzioni o dati attraverso troppi livelli | Valutare Context API per dati globali |
| **Rinomina incoerente delle props** | Diminuisce la leggibilità | Usare nomi chiari e coerenti (`onToggleDone`, `handleChange`, `onSubmit`, ecc.) |

---

##  Perché questa architettura è corretta

- **Separa le responsabilità**: `App` gestisce i dati, `TaskList` struttura la lista, `TaskItem` mostra l’attività.
- **Rende il codice riutilizzabile**: `TaskItem` può essere usato ovunque senza dipendere da uno specifico `App`.
- **Rispetta il flusso dati unidirezionale**: da `App` → `TaskList` → `TaskItem`, e da `TaskItem` → callback → `App`.
- **Facilita il testing**: ogni funzione è isolata e prevedibile.

---

## Conclusione

La struttura adottata nell' esempio segue pienamente le **best practice React** moderne:

- Stato centralizzato
- Componenti a responsabilità singola
- Comunicazione tramite props e funzioni
- Codice leggibile, testabile, scalabile










---

# **Esercizio: Gestione Partecipanti a un Evento**

## **Obiettivo**

Realizzare un’applicazione React che simula la gestione dei partecipanti a un evento. L’interfaccia deve:

- Mostrare il titolo dell’evento
- Visualizzare il numero totale di partecipanti
- Consentire di aggiungere partecipanti tramite pulsante
- Mostrare una lista di partecipanti con il loro stato (presente/assente)
- Cambiare dinamicamente lo stato di ciascun partecipante
- Colorare il nome del partecipante in base allo stato
- Utilizzare componenti separati e passaggio di `props`
- Condividere lo stato tramite *lifting state up*

---

## **Specifiche funzionali**

### Componente principale: `App.jsx`

- Contiene il titolo dell’evento
- Tiene traccia della lista di partecipanti (`useState`)
- Mostra il numero di presenti totali
- Mostra il pulsante per aggiungere un nuovo partecipante
- Mostra la lista dei partecipanti tramite il componente `ParticipantList`

---

### Componente `ParticipantList.jsx`

- Riceve l’array dei partecipanti come `prop`
- Riceve la funzione per aggiornare la lista come `prop`
- Per ogni partecipante:
  - Mostra il nome
  - Mostra un pulsante “Presente/Assente” che alterna lo stato
  - Cambia il colore in verde se è presente, rosso se è assente

---

### Stato gestito in `App.jsx`

```js
[
  { id: 1, name: 'Luca', isPresent: false },
  { id: 2, name: 'Sara', isPresent: true },
  ...
]
```

---

## **Requisiti tecnici**

- Utilizzo corretto di `useState`
- Uso di eventi `onClick`
- Rendering condizionale (`?`, `&&`)
- Rendering di liste (`map`)
- Passaggio di props (`{}` in JSX)
- Stili dinamici (`style={{}}`)
- Componenti separati in file distinti
- Identificatori univoci (`key`)
- Lifting state up per condividere dati

---

## **Suggerimenti**

- Crea un ID incrementale per ogni nuovo partecipante (usa `Date.now()` come valore semplice)
- Puoi inizializzare la lista con 2 partecipanti di esempio
- Scrivi una funzione `togglePresence(id)` che modifica `isPresent` per uno specifico partecipante
- Usa `filter` o `reduce` per calcolare il numero di presenti

---

## **Esempio visivo dell’interfaccia**

```
----------------------------------
 Titolo: Evento React 2025

 Totale presenti: 2 / 4

 [Aggiungi Partecipante]

 Lista Partecipanti:
 - Luca     [Presente]  (verde)
 - Sara     [Assente]   (rosso)
 - Marco    [Presente]  (verde)
 - Giulia   [Assente]   (rosso)
----------------------------------
```

---

## **Bonus (facoltativo)**

- Aggiungi un campo di input per digitare il nome del nuovo partecipante
- Aggiungi un messaggio condizionale: “Nessun partecipante ancora inserito”
- Disattiva il pulsante “Presente/Assente” se non ci sono partecipanti

---

## **File consigliati**

```
src/
├── components/
│   └── ParticipantList.jsx
├── App.jsx
├── App.css
```

---

















```
src/
├── App.jsx                    # Componente principale dell'app
│   ├── useState:
│   │   ├── participants       # Stato che contiene la lista dei partecipanti
│   │   └── newName            # Stato per il nome da inserire nel campo input
│   ├── handleAddParticipant() # Aggiunge un partecipante alla lista
│   ├── togglePresence(id)     # Cambia lo stato "presente/assente" di un partecipante
│   ├── presentCount           # Calcola quanti partecipanti sono presenti
│   └── render:
│       ├── Titolo evento               # <h1> con il nome dell’evento
│       ├── Conteggio presenti          # Mostra il totale dei presenti su totale
│       ├── Form aggiunta partecipante  # Input + pulsante "Aggiungi"
│       └── <ParticipantList ... />     # Mostra la lista dei partecipanti
│
├── App.css                   # Stili globali e layout visivo dell'app
│   └── Stili: container, form, input, pulsanti, lista, testi condizionali
│
└── components/
    └── ParticipantList.jsx           # Componente secondario per la lista
        ├── props:
        │   ├── participants           # Array dei partecipanti ricevuto da App
        │   └── onTogglePresence       # Funzione per cambiare presenza
        └── render:
            └── <ul>                   # Lista di <li> generati con map()
                └── {participants.map(participant =>
                    <li key={participant.id}>            # Elemento singolo
                        <span style={{ color: ... }}>    # Nome colorato in base a isPresent
                        <button onClick={...}>           # Pulsante "Presente/Assente"
```

---

### Esempio Visuale del Flusso

```
App.jsx
 ├── Stato locale (lista partecipanti, nuovo nome)
 ├── Funzioni (aggiungi partecipante, cambia presenza)
 └── JSX:
      Titolo evento
      Contatore
      Input e bottone
      ↓
      <ParticipantList /> 
         ↑ props:
            participants
            onTogglePresence
```

---



















---

##  Struttura dei file

```
src/
├── components/
│   └── ParticipantList.jsx
├── App.jsx
├── App.css
```

---

##  1. File `App.jsx`

```jsx
import { useState } from 'react';
import './App.css';
import ParticipantList from './components/ParticipantList';

export default function App() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Luca', isPresent: true },
    { id: 2, name: 'Sara', isPresent: false },
  ]);

  const [newName, setNewName] = useState('');

  function handleAddParticipant() {
    if (newName.trim() === '') return;

    const newParticipant = {
      id: Date.now(),
      name: newName,
      isPresent: false,
    };

    setParticipants([...participants, newParticipant]);
    setNewName('');
  }

  function togglePresence(id) {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, isPresent: !p.isPresent } : p
    );
    setParticipants(updated);
  }

  const presentCount = participants.filter((p) => p.isPresent).length;

  return (
    <div className="container">
      <h1>Evento React 2025</h1>

      <p>
        Totale presenti: {presentCount} / {participants.length}
      </p>

      <div className="add-form">
        <input
          type="text"
          placeholder="Nome partecipante"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAddParticipant}>Aggiungi Partecipante</button>
      </div>

      {participants.length === 0 ? (
        <p className="no-participants">Nessun partecipante ancora inserito.</p>
      ) : (
        <ParticipantList
          participants={participants}
          onTogglePresence={togglePresence}
        />
      )}
    </div>
  );
}
```

---

##  2. File `components/ParticipantList.jsx`

```jsx
export default function ParticipantList({ participants, onTogglePresence }) {
  return (
    <ul>
      {participants.map((participant) => (
        <li key={participant.id} className="participant-item">
          <span
            style={{
              color: participant.isPresent ? 'green' : 'red',
              fontWeight: 'bold',
              marginRight: '8px',
            }}
          >
            {participant.name}
          </span>
          <button onClick={() => onTogglePresence(participant.id)}>
            {participant.isPresent ? 'Segna Assente' : 'Segna Presente'}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

##  3. File `App.css`

```css
body {
  font-family: sans-serif;
  background-color: #f4f4f4;
  padding: 32px;
}

.container {
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 28px;
  margin-bottom: 16px;
}

.add-form {
  margin-bottom: 24px;
}

input {
  padding: 8px;
  font-size: 16px;
  margin-right: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding-left: 0;
}

.participant-item {
  margin-bottom: 12px;
}

.no-participants {
  font-style: italic;
  color: #888;
}
```

---

##  Funzionalità implementate

| Funzionalità                            | Stato   |
|----------------------------------------|---------|
| Componenti modulari                    | ✅       |
| Stato con `useState`                  | ✅       |
| Rendering condizionale (`?` e `&&`)   | ✅       |
| Rendering dinamico di liste           | ✅       |
| Passaggio di `props`                  | ✅       |
| Stili dinamici con `style={{}}`       | ✅       |
| `Lifting state up` (stato in `App`)   | ✅       |
| Aggiunta dinamica tramite input        | ✅       |
| Messaggio se lista vuota              | ✅       |

---
