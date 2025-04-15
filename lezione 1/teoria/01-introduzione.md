
---

## 1.1 Introduzione a React e all’Ecosistema 

### Definizione

React è una **libreria JavaScript** per la creazione di interfacce utente. È sviluppata e mantenuta da Meta. L’approccio è basato sui **componenti** e sull’utilizzo del **Virtual DOM** per ottimizzare le modifiche al DOM reale e migliorare le performance.

### Caratteristiche principali

- Architettura basata su componenti riutilizzabili
- Aggiornamenti efficienti del DOM tramite Virtual DOM
- Gestione dichiarativa dello stato dell’interfaccia
- Compatibilità con librerie e strumenti moderni (es. Redux, React Router)

### Strumenti principali dell’ecosistema

| Strumento           | Descrizione                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Create React App     | Tool ufficiale di scaffolding per progetti React, adatto a principianti     |
| Vite                 | Build tool moderno e performante, con supporto nativo per React             |
| React Router         | Libreria per la gestione del routing nelle Single Page Applications         |
| Redux / Zustand      | Librerie per la gestione avanzata dello stato globale                      |
| Tailwind CSS         | Framework CSS utility-first per styling veloce e personalizzabile          |

---

## Vite: Build Tool Moderno per React

### Cos'è Vite

**Vite** (dal francese "veloce") è un build tool moderno per lo sviluppo frontend. È progettato per offrire un'esperienza di sviluppo estremamente reattiva grazie a un approccio innovativo alla gestione dei moduli e alla compilazione.

A differenza di Webpack (usato da Create React App), Vite sfrutta **ESBuild** in fase di sviluppo e **Rollup** per il build di produzione, garantendo performance superiori e tempi di avvio quasi istantanei.

### Perché usare Vite

- **Velocità di avvio**: tempi di boot estremamente rapidi grazie a ESBuild
- **Hot Module Replacement (HMR)** immediato e stabile
- **Configurazione minima**: supporto immediato per React, Vue, TypeScript, ecc.
- **Build ottimizzato**: usa Rollup per ottenere bundle altamente performanti
- **Modularità**: supporta facilmente plugin e personalizzazioni

### Vantaggi rispetto a Create React App

| Caratteristica                  | Vite                              | Create React App                  |
|----------------------------------|-----------------------------------|------------------------------------|
| Tempo di avvio                  | Quasi istantaneo                  | Più lento                          |
| Tecnologie di base              | ESBuild + Rollup                  | Webpack                            |
| Supporto a TypeScript           | Nativo                            | Richiede configurazione            |
| Configurabilità avanzata        | Alta (vite.config.js)             | Limitata (senza eject)             |
| Bundle finale                   | Più leggero e veloce              | Più pesante                        |
| Esperienza in tempo reale       | HMR molto rapido e stabile        | HMR più lento                      |

---

## Installazione di Vite con React

### Prerequisiti

- Node.js installato (versione ≥ 16 consigliata)
- npm o yarn configurato nel sistema
- https://nodejs.org/en

### Comandi di setup

Grazie per la segnalazione. Ecco la sezione corretta, aggiornata per riflettere il processo reale di creazione con Vite (inclusa la selezione interattiva del framework e del linguaggio) e con una rappresentazione più accurata della struttura generata.

---

### 1. Creazione del progetto

Lancia il comando seguente per avviare il setup guidato:

```bash
npm create vite@latest
```

Ti verranno richieste le seguenti informazioni:

- **Nome del progetto** (es. `nome-progetto`)
- **Framework da utilizzare** → selezionare: `React`
- **Varianti** → selezionare: `JavaScript` (o `TypeScript` se preferito)

---

### 2. Navigazione nella cartella del progetto

```bash
cd nome-progetto
```

---

### 3. Installazione delle dipendenze

```bash
npm install
```

---

### 4. Avvio del server di sviluppo

```bash
npm run dev
```

Il server sarà attivo all’indirizzo:  
**http://localhost:5173**

---

## Struttura iniziale del progetto

Dopo il setup, Vite genera una struttura simile alla seguente:

```
nome-progetto/
├── index.html
├── package.json
├── vite.config.js
├── node_modules/
├── public/
│   └── vite.svg
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── assets/
        └── react.svg
```

### Descrizione dei file principali

- `index.html` – file HTML principale, punto di ingresso dell’app
- `vite.config.js` – configurazione del progetto Vite
- `src/main.jsx` – entry point JavaScript, monta il componente React principale
- `src/App.jsx` – componente radice dell’interfaccia
- `src/assets/` – contiene risorse statiche (es. immagini SVG)
- `src/App.css` e `src/index.css` – file di stile iniziali

---

## Conclusione

Vite è oggi uno degli strumenti più moderni ed efficienti per sviluppare applicazioni React. Offre un’esperienza di sviluppo estremamente fluida, ideale per progetti didattici e professionali. Grazie alla semplicità della configurazione e alla rapidità di compilazione, rappresenta una scelta consigliata per iniziare a lavorare con React in modo professionale.

---

## 1.2 Struttura delle Cartelle e Best Practice 

### Obiettivo

Organizzare il codice in una struttura modulare, leggibile e scalabile per facilitare la manutenzione e la collaborazione.

### Struttura consigliata

```
src/
├── assets/         // File statici (immagini, icone)
├── components/     // Componenti riutilizzabili
├── pages/          // Pagine principali dell’app
├── hooks/          // Custom hook React
├── utils/          // Funzioni di utilità condivise
├── App.jsx         // Componente radice dell’app
├── main.jsx        // Entry point del progetto
```

### Convenzioni e buone pratiche

- Un componente per file, con nome maiuscolo
- Utilizzo di nomi descrittivi e coerenti
- Separazione tra logica e presentazione
- Preferire funzioni pure e componenti funzionali
- Estensione dei file: `.jsx` o `.tsx` (con TypeScript)

### Esempio semplice

**Header.jsx**

```jsx
export default function Header() {
  return <h1>Benvenuto nella mia applicazione React</h1>;
}
```

**App.jsx**

```jsx
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
```

---

## 1.3 JSX e differenze concettuali con HTML 

### Cos’è JSX

JSX (JavaScript XML) è una sintassi che permette di scrivere componenti React in una forma simile all’HTML. In realtà, JSX viene compilato in JavaScript puro attraverso Babel.

### Caratteristiche

- Sintassi simile all’HTML ma all’interno del codice JavaScript
- Permette l’inserimento dinamico di variabili e funzioni tramite `{}`

### Differenze principali tra HTML e JSX

| HTML              | JSX                        |
|-------------------|-----------------------------|
| `class`           | `className`                |
| `for`             | `htmlFor`                  |
| Attributi lowercase | Attributi in camelCase     |
| Nessun JavaScript | Supporta espressioni JS via `{}` |

### Esempio

```jsx
const nome = "Luca";

export default function Welcome() {
  return <h2>Benvenuto, {nome}!</h2>;
}
```

---

## 1.4 Reattività e Virtual DOM 

### Concetto di Reattività

Un’applicazione reattiva aggiorna automaticamente la propria interfaccia in base ai cambiamenti dello stato interno, senza necessità di interventi manuali sul DOM.

### Cos’è il Virtual DOM

Il Virtual DOM è una rappresentazione in memoria del DOM reale. Ogni volta che lo stato dell’app cambia, React confronta il nuovo Virtual DOM con la versione precedente (diffing), calcola le modifiche minime necessarie (patching) e le applica al DOM reale.

### Vantaggi

- Migliori performance rispetto al DOM tradizionale
- Minori operazioni di scrittura sul DOM reale
- Esperienza utente più fluida e reattiva

### Esempio di reattività con `useState`

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hai cliccato {count} volte</p>
      <button onClick={() => setCount(count + 1)}>Clicca</button>
    </div>
  );
}
```

In questo esempio, React aggiorna solo il contenuto del tag `<p>`, lasciando inalterato il resto dell’interfaccia.

---