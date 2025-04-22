---

## Introduzione a TypeScript in un progetto React

**TypeScript** è un superset tipizzato di JavaScript che aggiunge il controllo dei tipi statici al linguaggio. È compatibile con JavaScript standard, quindi qualunque file `.js` valido è anche un file `.ts` valido. Il suo obiettivo principale è aumentare l'affidabilità, la leggibilità e la manutenibilità del codice, in particolare in progetti strutturati e di media-lunga durata.

---

## Differenze fondamentali rispetto a JavaScript

1. **Tipizzazione statica**: in JavaScript i tipi sono dinamici e vengono valutati a runtime, mentre in TypeScript vengono verificati in fase di compilazione.
2. **Autocompletamento e tool di sviluppo avanzati**: grazie alle definizioni di tipo, gli editor offrono completamento automatico, documentazione inline e suggerimenti di refactoring.
3. **Prevenzione degli errori**: TypeScript segnala errori potenziali prima dell'esecuzione.
4. **Supporto per la programmazione orientata agli oggetti**: TypeScript supporta interfacce, classi, modificatori di accesso e altri concetti OOP.

---

## Integrazione in un progetto React con Vite

### Creazione di un progetto React + TypeScript con Vite

```bash
npm create vite@latest nome-progetto --template react-ts
cd nome-progetto
npm install
npm run dev
```

Questo comando genera un progetto con file `.tsx`, tipizzazioni già configurate e supporto nativo a TypeScript.

---

## Struttura dei file tipici

- **`main.tsx`**: punto di ingresso del progetto.
- **`App.tsx`**: componente principale.
- Componenti personalizzati: `MyComponent.tsx`, `Header.tsx`, `TaskItem.tsx`, ecc.
- Tipi e interfacce: possono essere definiti localmente o in file dedicati come `types.ts`.

---

## Tipizzazione dei componenti React

### 1. Componente con props tipizzate

```tsx
type TaskProps = {
  name: string;
  isDone: boolean;
};

const TaskItem = ({ name, isDone }: TaskProps) => {
  return <li>{isDone ? '✓' : '✗'} {name}</li>;
};
```

### 2. Componente con stato

```tsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
};
```

`useState<number>` definisce il tipo del valore iniziale e dei valori futuri di `count`.

---

## Gestione delle props nei componenti figli

Quando si passa un componente figlio all’interno del JSX, è necessario definire correttamente i tipi delle props nel componente figlio per ottenere il massimo da TypeScript.



Il file `types.ts` viene comunemente utilizzato nei progetti TypeScript per **centralizzare la definizione dei tipi personalizzati**, rendendo il codice più leggibile, riutilizzabile e facilmente manutenibile. In questo file, si utilizza la parola chiave `type` per dichiarare una **struttura di oggetto** o un alias di tipo, come nel seguente esempio:

```ts
export type Task = {
  id: number;
  name: string;
  isDone: boolean;
};
```

In questo caso, `Task` è un **alias di tipo** per un oggetto che rappresenta una singola attività, composto da tre proprietà: `id`, `name` e `isDone`. Il prefisso `export` consente di usare questo tipo in altri file del progetto tramite `import`.

### Cos’è `type` in TypeScript

La parola chiave `type` viene usata per:

- Definire la forma di oggetti complessi (simile alle interfacce)
- Combinare tipi tramite union (`|`) o intersection (`&`)
- Ridenominare tipi primitivi o strutture ripetitive

```ts
type ID = number | string;

type User = {
  id: ID;
  name: string;
};
```

### Best practice per l’utilizzo di `type` e `types.ts`

- **Centralizzare le definizioni** in un file dedicato come `types.ts` per evitare ridondanze e favorire la coerenza tra i componenti.
- **Usare `type` per oggetti semplici e strutture** con forme fisse.
- **Usare `interface` quando si lavora con estendibilità** (es. `extends` tra componenti complessi).
- **Nominare i tipi in PascalCase** (es. `Task`, `User`, `ProductItemProps`) per distinguerli chiaramente dalle variabili.

Con una corretta gestione dei tipi, soprattutto centralizzata in un file `types.ts`, si ottiene un codice più robusto, scalabile e comprensibile per tutto il team di sviluppo.



Esempio completo:

```tsx
// types.ts (opzionale)
export type Task = {
  id: number;
  name: string;
  isDone: boolean;
};
```

```tsx
// TaskItem.tsx
import { Task } from './types';

type Props = {
  task: Task;
  onToggle: (id: number) => void;
};

export const TaskItem = ({ task, onToggle }: Props) => {
  return (
    <li>
      <span>{task.name}</span>
      <button onClick={() => onToggle(task.id)}>
        {task.isDone ? 'Annulla' : 'Completa'}
      </button>
    </li>
  );
};
```

```tsx
// TaskList.tsx
import { Task } from './types';
import { TaskItem } from './TaskItem';

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
};

export const TaskList = ({ tasks, onToggle }: Props) => {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} />
      ))}
    </ul>
  );
};
```

```tsx
// App.tsx
import { useState } from 'react';
import { Task } from './types';
import { TaskList } from './TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Studiare React', isDone: false },
    { id: 2, name: 'Fare la spesa', isDone: true },
  ]);

  const toggleDone = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      )
    );
  };

  return (
    <div>
      <h1>Lista attività</h1>
      <TaskList tasks={tasks} onToggle={toggleDone} />
    </div>
  );
}
```

---

## Best practice con TypeScript in React

1. **Tipizzare sempre le props** nei componenti. Se sono ripetute in più file, estrarle in un tipo comune.
2. **Non abusare di `any`**. Preferire `unknown` o definizioni più precise.
3. **Tipizzare gli stati con `useState<Type>`**, specialmente per array e oggetti.
4. **Tipizzare le funzioni** (in ingresso e in uscita) per migliorare la comprensione.
5. **Organizzare i tipi in un file separato (`types.ts`)** nei progetti più grandi.
6. **Utilizzare il supporto dell’IDE** per generare e suggerire i tipi dinamicamente.

---

## Conclusione

TypeScript, integrato in un progetto React con Vite, consente di lavorare in modo più strutturato, sicuro e professionale. Permette di intercettare errori prima che il codice venga eseguito, migliora l’esperienza di sviluppo con strumenti intelligenti e consente di creare componenti riutilizzabili, chiari e manutenibili.


---

## 1. Tipi di export in JavaScript e TypeScript

In JavaScript (e TypeScript) esistono due principali modalità per esportare elementi da un modulo:

### a. **Export default**

Serve per esportare **un’unica entità principale** da un modulo. Può essere un oggetto, una funzione, una classe o qualsiasi valore.

```ts
// File: MyComponent.tsx
export default function MyComponent() {
  return <div>Componente principale</div>;
}
```

**Importazione:**

```ts
import MyComponent from './MyComponent';
```

Caratteristiche:
- Si importa **senza graffe**
- Si può anche rinominare al momento dell'import (non consigliato per chiarezza)
- Utile quando un file contiene un solo elemento rilevante

---

### b. **Export nominato (named export)**

Serve per esportare **una o più entità con nome** dallo stesso file.

```ts
// File: utils.ts
export const formatDate = (date: Date) => { ... };
export const isValidEmail = (email: string) => { ... };
```

**Importazione:**

```ts
import { formatDate, isValidEmail } from './utils';
```

Caratteristiche:
- Si importano **con le graffe**
- I nomi importati devono corrispondere esattamente a quelli esportati
- Più leggibile e flessibile nei file che espongono più funzioni, costanti o tipi

---

### c. **Export dei tipi (TypeScript)**

In TypeScript si possono esportare anche i tipi (`type`, `interface`, `enum`).

```ts
// File: types.ts
export type Task = {
  id: number;
  name: string;
  isDone: boolean;
};
```

**Importazione (classica):**

```ts
import { Task } from './types';
```

**Importazione ottimizzata (moderna):**

```ts
import type { Task } from './types';
```

> `import type` è consigliato perché specifica che si tratta di un tipo, non di un valore a runtime.

---

## 2. Perché in alcuni file usi `{ }` e in altri no

La sintassi dell’import dipende dal **tipo di export usato nel file che stai importando**.

### Esempio: `App.tsx` con TypeScript

```ts
import { Task } from './types'; // named export (tipo)
import { TaskList } from './TaskList'; // named export (componente)
```

Questi import usano le graffe perché `Task` e `TaskList` sono **esportati nominalmente** nei rispettivi file.

```ts
// TaskList.tsx
export const TaskList = () => { ... };
```

---

### Esempio: `App.jsx` con JavaScript

```js
import ParticipantList from './components/ParticipantList';
```

Qui usi **`export default`**, perciò puoi importare il componente **senza graffe**.

```js
// ParticipantList.jsx
export default function ParticipantList() { ... }
```

---

## 3. Confronto diretto

| Tipo di export         | Sintassi export                        | Sintassi import                            |
|------------------------|-----------------------------------------|---------------------------------------------|
| Default export         | `export default MyComponent`            | `import MyComponent from './...'`           |
| Named export           | `export const MyComponent = ...`        | `import { MyComponent } from './...'`       |
| Tipo (TypeScript)      | `export type MyType = { ... }`          | `import type { MyType } from './...'`       |

---

## 4. Best practice

- **Preferisci `named export` nei file che contengono più funzioni o tipi**. Aiuta a mantenere l’import esplicito e controllabile.
- **Usa `default export` solo se il file contiene una sola entità principale**, ad esempio un componente React principale (`App.tsx`, `Layout.tsx`, ecc.).
- **Non mischiare export default e named export nello stesso file**, per evitare confusione.
- Nei progetti TypeScript, **usa `import type` per i soli tipi**, così da migliorare la chiarezza del codice e l’ottimizzazione del build.
- Mantieni la coerenza in tutto il progetto, decidendo se usare principalmente `default` o `named` in base alla tua architettura.

---

## 5. Applicazione ai tuoi esempi

### File JavaScript (`App.jsx`)

```js
import ParticipantList from './components/ParticipantList';
```

- `ParticipantList.jsx` usa `export default` → quindi si importa senza graffe.

### File TypeScript (`App.tsx`)

```ts
import { Task } from './types';         // named type
import { TaskList } from './TaskList';  // named export
```

- `types.ts` e `TaskList.tsx` usano `export` nominale → quindi si importano con graffe.

---

















### **Component Composition in React**  
**Approfondimento teorico, esempi pratici e best practice**

---

## **1. Cos’è la Component Composition**

**Component Composition** in React è il principio secondo cui i componenti complessi vengono costruiti **componendo** componenti più semplici. In altre parole, piuttosto che estendere un componente (come si farebbe con l’ereditarietà), si **incastrano** componenti uno dentro l’altro, proprio come blocchi, per realizzare un’interfaccia utente modulare, flessibile e riutilizzabile.

Questo concetto è ispirato dalla filosofia **funzionale e dichiarativa** di React, dove la UI è una funzione dello stato dell'applicazione.

---

## **2. Perché React favorisce la composizione rispetto all’ereditarietà**

React non supporta nativamente un sistema di ereditarietà tra componenti (come `extends` tra classi padre e figlie). Il team di React promuove la composizione perché:

- È **più semplice da gestire**: ogni componente ha una singola responsabilità.
- Favorisce la **modularità**: ogni parte della UI è un’unità riutilizzabile.
- Consente un controllo più granulare e flessibile dei contenuti e del comportamento.

---

## **3. Esempio base: `props.children`**

`props.children` è la forma più semplice di composizione in React. È una **prop automatica** che contiene tutto il contenuto inserito tra il tag di apertura e chiusura di un componente.

### Definizione di un componente contenitore:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

### Utilizzo:

```jsx
<Card>
  <h2>Titolo</h2>
  <p>Testo del contenuto</p>
</Card>
```

`Card` visualizzerà il titolo e il paragrafo all’interno del proprio contenitore. Questo meccanismo consente ai componenti genitore di **delegare la struttura interna** al chiamante, mantenendo separata la logica di stile/comportamento.

---

## **4. Composizione con "Slot" via props dedicate**

Quando si vogliono prevedere più **punti di inserimento strutturati**, si possono usare delle **props esplicite** come `header`, `footer`, `aside`, ecc.

### Esempio:

```jsx
function Modal({ header, children, footer }) {
  return (
    <div className="modal">
      <div className="modal-header">{header}</div>
      <div className="modal-body">{children}</div>
      <div className="modal-footer">{footer}</div>
    </div>
  );
}
```

### Utilizzo:

```jsx
<Modal
  header={<h2>Conferma</h2>}
  footer={<button>Chiudi</button>}
>
  <p>Sei sicuro di voler continuare?</p>
</Modal>
```

Questo pattern consente una **composizione strutturata**, utile per componenti layout complessi, come modali, card, form, ecc.

---

## **5. Composizione con componenti figlio dichiarativi (Compound Components)**

In alcuni casi è utile definire **componenti figli associati** semanticamente a un componente genitore. React permette questa struttura senza necessità di ereditarietà, usando `React.Children` e `React.cloneElement`.

### Esempio:

```jsx
function Tabs({ children }) {
  return (
    <div className="tabs">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isInTabs: true })
      )}
    </div>
  );
}

Tabs.Tab = function Tab({ label, children }) {
  return (
    <div className="tab">
      <h4>{label}</h4>
      {children}
    </div>
  );
};
```

### Utilizzo:

```jsx
<Tabs>
  <Tabs.Tab label="Profilo">Contenuto del profilo</Tabs.Tab>
  <Tabs.Tab label="Impostazioni">Contenuto impostazioni</Tabs.Tab>
</Tabs>
```

Questo pattern è ideale per **costruire API dichiarative** coerenti, mantenendo la composizione controllata.

---

## **6. Best Practice nella composizione dei componenti**

| Buona pratica                                   | Descrizione |
|------------------------------------------------|-------------|
| Usare `props.children` quando serve contenuto generico | Permette la massima flessibilità |
| Separare struttura e contenuto tramite slot    | Consente un layout prevedibile e riutilizzabile |
| Documentare i componenti compositi             | Specifichi cosa aspettarsi in `children`, `header`, ecc. |
| Usare composizione invece di ereditarietà      | Più flessibile, compatibile con funzioni e hook |
| Comporre piccoli componenti                    | I componenti dovrebbero fare una cosa sola |
| Evitare over-composition                       | Troppi livelli di nesting rendono il codice difficile da seguire |

---

## **7. Confronto composizione vs ereditarietà**

| Caratteristica        | Composizione (React)         | Ereditarietà (OOP)                |
|------------------------|------------------------------|-----------------------------------|
| Gerarchia              | Orizzontale, modulare        | Verticale, padre-figlio           |
| Riutilizzabilità       | Alta, tramite `children` e props | Limitata, rigida                  |
| Complessità            | Bassa                        | Può introdurre dipendenze forti   |
| Estendibilità          | Tramite pattern flessibili   | Tramite sottoclassi               |
| Testabilità            | Alta                         | Più difficile da isolare          |

---

## **Conclusione**

La component composition è un principio centrale di React. Usare `children`, `slot`, componenti dichiarativi o altri pattern compositivi consente di costruire interfacce utente altamente riutilizzabili, estensibili e manutenibili. Favorire la composizione rispetto all’ereditarietà permette di ottenere un codice più pulito, più semplice da testare e più coerente con il paradigma funzionale che React adotta.



















---

## **1. Cosa sono `props.children`: concetto fondamentale**

### Definizione

In React, ogni componente può ricevere una prop speciale chiamata **`children`**. Questa prop non viene definita esplicitamente da te: **è automaticamente fornita da React** quando usi una sintassi di apertura e chiusura per un componente.

### Esempio:

```jsx
<MyComponent>
  <h1>Ciao</h1>
  <p>Testo</p>
</MyComponent>
```

In questo esempio, il contenuto `<h1>...</h1>` e `<p>...</p>` viene automaticamente inserito nella proprietà `props.children` di `MyComponent`.

### Internamente

Il valore di `props.children` **non è sempre un array**, ma può essere:

| Caso | Tipo restituito |
|------|------------------|
| Nessun figlio | `undefined` |
| Un solo figlio | Oggetto (singolo elemento React) |
| Più figli | Array di elementi React |

Per gestire tutti i casi, React fornisce delle utility.

---

## **2. `React.Children.map(children, fn)`**

### Cosa fa realmente

La funzione `React.Children.map(children, fn)` è una funzione **di utilità** che serve per scorrere e trasformare **in modo sicuro e consistente** tutti i `children` passati a un componente, anche quando:

- Ce n’è **solo uno** (quindi non è un array)
- Alcuni figli sono **null**, **booleani**, **stringhe**, o **frammenti**

### Come funziona:

1. **Normalizza** `props.children` in un array coerente.
2. Applica la funzione `fn` a **ciascun figlio**.
3. Restituisce un **nuovo array di nodi React**, mappati secondo la funzione specificata.

### Esempio concreto:

```jsx
function MyWrapper({ children }) {
  return (
    <div>
      {React.Children.map(children, (child) => (
        <div className="boxed">{child}</div>
      ))}
    </div>
  );
}
```

Anche se passi un solo figlio, `React.Children.map` lo tratterà come un array con un singolo elemento, garantendo coerenza.

---

## **3. `React.cloneElement(element, newProps)`**

### Cos’è

`React.cloneElement` serve per **clonare un elemento React esistente** (es. `child`) e **aggiungere o sovrascrivere** le sue props.

### Perché usarlo

Quando un componente genitore vuole **iniettare comportamento o dati nei suoi figli**, può farlo clonando i figli e passando props aggiuntive, **senza modificare il codice dei figli a monte**.

### Esempio:

```jsx
React.cloneElement(child, { active: true })
```

Il componente figlio riceverà `props.active = true`, anche se chi lo ha scritto non l’ha previsto.

---

## **4. Come `React.Children.map + cloneElement` abilitano la composizione dichiarativa**

Torniamo a questo esempio:

```jsx
function Tabs({ children }) {
  return (
    <div className="tabs">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isInTabs: true })
      )}
    </div>
  );
}
```

### Cosa succede davvero, passo per passo:

1. `children` contiene i due elementi dichiarati:

   ```jsx
   <Tabs.Tab label="Profilo">Contenuto</Tabs.Tab>
   <Tabs.Tab label="Impostazioni">Contenuto</Tabs.Tab>
   ```

2. `React.Children.map` li normalizza in un array `[child1, child2]`.

3. Per ogni `child`, `React.cloneElement`:
   - Clona il JSX originale (`Tabs.Tab`)
   - Aggiunge la prop `isInTabs: true`
   - Restituisce una nuova versione dello stesso elemento, ma con prop estese

4. Il componente `Tabs.Tab` riceverà, oltre a `label` e `children`, anche `isInTabs = true`.

---

## **5. Perché non usare direttamente `children.map(...)`**

React **non garantisce** che `children` sia un array. Se c’è solo un figlio, `children` non è un array ma un singolo oggetto. Quindi:

```jsx
children.map(...) // può causare errore "children.map is not a function"
```

Invece:

```jsx
React.Children.map(children, fn) // funziona sempre
```

> Questo è uno dei motivi principali per cui `React.Children` esiste: garantire sicurezza, consistenza e flessibilità nell'iterazione dei figli.

---

## **6. Best practice nel pattern Compound Component**

| Aspetto | Raccomandazione |
|--------|------------------|
| Iterazione dei figli | Usa sempre `React.Children.map`, mai `children.map` direttamente |
| Aggiunta di props | Usa `React.cloneElement` con parsimonia, solo quando necessario |
| Verifica del tipo di componente | Se servono controlli, filtra i figli in base a `child.type.displayName` |
| API semantica | Definisci componenti figli come proprietà del componente padre: `Tabs.Tab`, `Accordion.Item`, ecc. |
| Riusabilità | Evita dipendenze rigide tra padre e figlio (es. dipendenze da ordini o indici specifici) |

---

## **Conclusione**

- `props.children` è una struttura centrale in React per permettere la composizione.
- `React.Children.map` è una funzione sicura per iterare ogni tipo di children.
- `React.cloneElement` permette di modificare o arricchire figli dichiarati in modo esplicito, senza modificarli direttamente.
- Insieme, questi strumenti permettono al componente padre di **governare** la logica e il comportamento, lasciando al chiamante la piena libertà di **dichiarare** la struttura.

Questo approccio incarna la filosofia di React: **composizione, modularità, dichiaratività**.


















Quando scrivi:

```jsx
<Tabs>
  <Tabs.Tab label="Profilo">Contenuto</Tabs.Tab>
</Tabs>
```

React **non associa automaticamente `Tabs.Tab` al componente `Tabs` dal punto di vista logico o del tipo**. Tuttavia, nella sintassi JSX, **qualsiasi elemento dichiarato all’interno di `<Tabs>...</Tabs>` viene incluso come `props.children` del componente `Tabs`**, indipendentemente da cosa rappresenti.

Il fatto che usi `Tabs.Tab` è solo una **convenzione** per:

1. **Raggruppare semanticamente componenti figli** all'interno di un componente genitore.
2. **Incoraggiare un'API dichiarativa e leggibile**.

### Non esiste nessun legame magico o automatico tra `Tabs` e `Tabs.Tab`.

> React vede `Tabs.Tab` esattamente come vedrebbe qualunque altro elemento figlio, finché non intervieni tu manualmente con `React.Children.map` o `Context`.

---

## Esempio 

Creiamo un componente `Accordion` con un sottocomponente `Accordion.Item`, seguendo la stessa logica.

### 1. **Componente padre: Accordion**

```tsx
import React from 'react';

export function Accordion({ children }) {
  return (
    <div className="accordion">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isAccordionItem: true })
      )}
    </div>
  );
}
```

### 2. **Componente figlio dichiarativo: Accordion.Item**

```tsx
Accordion.Item = function Item({ title, children, isAccordionItem }) {
  return (
    <div className="accordion-item">
      <h3>{title}</h3>
      {isAccordionItem && <div className="content">{children}</div>}
    </div>
  );
};
```

### 3. **Utilizzo dichiarativo**

```tsx
<Accordion>
  <Accordion.Item title="Sezione 1">
    Contenuto della sezione 1
  </Accordion.Item>
  <Accordion.Item title="Sezione 2">
    Contenuto della sezione 2
  </Accordion.Item>
</Accordion>
```

---

## Cosa succede sotto il cofano

1. `Accordion` riceve tutti i suoi figli come `props.children`.
2. Usa `React.Children.map()` per ciclare ogni figlio.
3. Per ogni figlio, applica `React.cloneElement()` per **iniettare** la prop `isAccordionItem: true`.
4. `Accordion.Item` riceve la prop e decide **cosa fare** (es. mostrare o meno il contenuto).
5. L’uso di `Accordion.Item` come proprietà di `Accordion` è **convenzione semantica**, non obbligo tecnico.

---

## Best practice in questo pattern

| Best practice | Motivazione |
|---------------|-------------|
| Usare `NomeComponente.SubComponente` | Chiarezza semantica e dichiarativa |
| Gestire i figli con `React.Children` | Garantisce sicurezza anche in caso di figli singoli o nulli |
| Aggiungere props tramite `cloneElement` | Per iniettare comportamenti specifici dal componente genitore |
| Documentare i sottocomponenti | I componenti figli vanno documentati all'interno del genitore |
| Verificare il tipo del figlio se necessario | Puoi usare `child.type === Accordion.Item` per filtrare |

---

## Conclusione

Sì, quando scrivi `<Tabs.Tab>` dentro `<Tabs>`, stai **manualmente componendo** il componente genitore con i suoi figli. Non c’è un legame automatico: sei tu a definire la logica di composizione e a stabilire come gestire i componenti figli. Questo pattern ti dà pieno controllo, flessibilità e una API chiara per chi utilizza il tuo componente.



















Riscriviamo l'intero esempio come componente funzionante in ts

---

##  **Obiettivo**

Costruire un componente `Accordion` con sottocomponente `Accordion.Item`, utilizzando il pattern **Compound Components**, permettendo al componente padre di iniettare una prop nei figli tramite `React.cloneElement` e gestendo correttamente i tipi in **TypeScript**.

---

##  **Accordion.tsx – Codice completo e tipizzato**

```tsx
import React, { ReactNode, ReactElement } from 'react';

// Tipi per il componente padre
type AccordionProps = {
  children: ReactNode;
};

// Tipi per il componente figlio
type AccordionItemProps = {
  title: string;
  children: ReactNode;
  isAccordionItem?: boolean; // questa prop viene iniettata dinamicamente
};

// Componente principale
export function Accordion({ children }: AccordionProps) {
  return (
    <div className="accordion">
      {React.Children.map(children, (child) => {
        // Verifica che sia un elemento React valido e tipizzalo
        if (!React.isValidElement<AccordionItemProps>(child)) return child;

        // Clona il figlio iniettando la prop `isAccordionItem`
        return React.cloneElement(child, { isAccordionItem: true });
      })}
    </div>
  );
}

// Componente secondario come proprietà del principale
Accordion.Item = function Item({ title, children, isAccordionItem }: AccordionItemProps) {
  return (
    <div className="accordion-item">
      <h3>{title}</h3>
      {isAccordionItem && <div className="content">{children}</div>}
    </div>
  );
};
```

---
 **App.tsx – Utilizzo del componente**

```tsx
import React from 'react';
import { Accordion } from './Accordion';

export default function App() {
  return (
    <Accordion>
      <Accordion.Item title="Introduzione">
        Contenuto dell'introduzione
      </Accordion.Item>
      <Accordion.Item title="Dettagli">
        Contenuto dei dettagli
      </Accordion.Item>
    </Accordion>
  );
}
```

---

##  **Spiegazione tecnica**

### `React.Children.map`

React accetta qualsiasi tipo come `children` (array, singolo elemento, `null`, `boolean`...), ma TypeScript non sa con certezza se un child è un `ReactElement` e quali props abbia.

> `React.Children.map` normalizza i children (anche se è uno solo) in una forma iterabile e applica la funzione di trasformazione a ciascuno.

### `React.isValidElement<T>`

Questa funzione verifica che un nodo React sia un **elemento React valido**, e accetta un **tipo generico `T`** che consente di informare TypeScript su quali props aspettarsi.

```tsx
React.isValidElement<AccordionItemProps>(child)
```

Con questo, possiamo usare `React.cloneElement` senza errore, perché TypeScript ora **conosce esattamente** le props che il child accetta.

### `React.cloneElement`

Questa funzione serve per **clonare un elemento JSX già esistente** (come `<Accordion.Item />`) e **iniettare nuove props**:

```tsx
React.cloneElement(child, { isAccordionItem: true })
```

---

##  **Best practice con TypeScript**

| Buona pratica | Spiegazione |
|---------------|-------------|
| Usare `React.isValidElement<T>` | Garantisce sicurezza di tipo nell’uso di `cloneElement` |
| Tipizzare sempre le props dei figli | Consente supporto completo da parte dell'IDE |
| Usare `as ReactElement<T>` solo come fallback | Il cast diretto forza i tipi e può nascondere errori |
| Centralizzare il tipo `AccordionItemProps` | Mantiene consistenza tra genitore e figlio |
| Annotare `children` come `ReactNode` | Per supportare qualsiasi tipo di contenuto JSX |

---

##  Conclusione

Questo approccio segue il pattern idiomatico di React per la **composizione di componenti riutilizzabili**, e grazie a `React.Children.map` e `cloneElement`, consente al componente padre di **controllare i suoi figli senza conoscerne l'implementazione interna**. La gestione corretta del tipo con `isValidElement<T>` è fondamentale per evitare errori in fase di compilazione e ottenere tutti i vantaggi dell'autocompletamento e della validazione offerti da TypeScript.













---

## **Injection in React: concetto e applicazione**

Nel contesto di React, il termine **injection** fa riferimento alla pratica di **inserire dati, comportamenti o logica all'interno di un componente figlio**, senza che quest’ultimo li definisca esplicitamente nel proprio utilizzo. È un meccanismo essenziale per la costruzione di componenti riutilizzabili e controllabili, particolarmente utile nel pattern di composizione.

### Due principali forme di injection in React:

1. **Injection esplicita tramite props**
2. **Injection programmatica tramite `React.cloneElement`**

---

## **1. Injection tramite props**

La forma più semplice di injection consiste nel **passare direttamente una o più props a un componente** per configurarne il comportamento.

### Esempio in TypeScript

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
};

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

function App() {
  const handleClick = () => alert('Hai cliccato');

  return <Button label="Invia" onClick={handleClick} />;
}
```

Qui, `App` inietta al componente `Button` il testo e la funzione `onClick`. Questo è injection classico: **il componente è progettato per ricevere dei comportamenti esterni**.

---

## **2. Injection tramite `React.cloneElement`**

Quando si lavora con componenti composti (Compound Components), può essere utile che il componente genitore **inietti dinamicamente delle props** nei figli, **senza che il chiamante debba occuparsene**.

Questo avviene utilizzando `React.cloneElement`, una funzione che **clona un elemento React già dichiarato** e vi aggiunge nuove props o ne sovrascrive di esistenti.

### Scenario tipico

Si vogliono creare componenti dichiarativi, come:

```tsx
<Panel>
  <Panel.Section title="Titolo 1">Contenuto 1</Panel.Section>
  <Panel.Section title="Titolo 2">Contenuto 2</Panel.Section>
</Panel>
```

Il componente `Panel` deve poter **interagire con `Panel.Section`**, per esempio iniettando una prop comune, come `highlighted`.

---

## **Esempio professionale completo con cloneElement**

### `Panel.tsx`

```tsx
import React, { ReactNode, ReactElement } from 'react';

type PanelProps = {
  children: ReactNode;
};

type PanelSectionProps = {
  title: string;
  children: ReactNode;
  highlighted?: boolean;
};

// Componente padre
export function Panel({ children }: PanelProps) {
  return (
    <div className="panel">
      {React.Children.map(children, (child) => {
        // Verifica che il figlio sia un ReactElement con tipo atteso
        if (!React.isValidElement<PanelSectionProps>(child)) return child;

        // Iniezione della prop 'highlighted'
        return React.cloneElement(child, {
          highlighted: true,
        });
      })}
    </div>
  );
}

// Componente figlio
Panel.Section = function Section({
  title,
  children,
  highlighted,
}: PanelSectionProps) {
  return (
    <div
      className="panel-section"
      style={{ borderLeft: highlighted ? '4px solid blue' : 'none' }}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
};
```

### `App.tsx`

```tsx
import React from 'react';
import { Panel } from './Panel';

export default function App() {
  return (
    <Panel>
      <Panel.Section title="Chi siamo">Contenuto della sezione 1</Panel.Section>
      <Panel.Section title="Contatti">Contenuto della sezione 2</Panel.Section>
    </Panel>
  );
}
```

---

## **Cosa succede dietro le quinte**

1. Il componente `Panel` riceve i suoi figli attraverso `props.children`.
2. Usa `React.Children.map` per iterare in modo sicuro su tutti i figli.
3. Verifica che ciascun figlio sia un `ReactElement` valido con props tipizzate (`PanelSectionProps`).
4. Usa `React.cloneElement` per creare una nuova copia del figlio, aggiungendo la prop `highlighted: true`.
5. Il componente `Panel.Section` riceve questa prop anche se l’utente non l’ha specificata nel JSX.

---

## **Perché usare `cloneElement`**

- Per **centralizzare logica comune** all’interno del componente padre.
- Per **automatizzare la configurazione** dei figli senza obbligare l’utente a passare manualmente ogni prop.
- Per costruire **API dichiarative** leggibili e modulari.

---

## **Tipizzazione corretta**

In TypeScript, è fondamentale:

- Verificare che `child` sia un `ReactElement<T>` prima di clonarlo
- Fornire un tipo esplicito come `PanelSectionProps` a `React.isValidElement`

Questo evita errori come:

```
TS2769: 'highlighted' does not exist in type 'Partial<unknown>'
```

---

## **Conclusione**

L’injection in React è una tecnica essenziale per **separare struttura e comportamento**, favorendo riusabilità, chiarezza e manutenibilità. Mentre le props rappresentano la forma più diretta di injection, `React.cloneElement` permette una composizione dichiarativa avanzata, utile in componenti genitori che devono coordinare figli. Per usarlo in modo sicuro in TypeScript, è necessario **verificare i tipi** con `React.isValidElement<T>` e **fornire interfacce esplicite** per le props.




















### **Ciclo di vita dei componenti React: approfondimento teorico**

Il **lifecycle** di un componente React rappresenta l’insieme delle **fasi sequenziali e prevedibili** che un componente attraversa dalla sua creazione alla sua distruzione. Ogni componente, funzionale o classico, ha una sua "vita" che React gestisce con precisione attraverso fasi ben distinte: **montaggio, aggiornamento, smontaggio**.

Conoscere a fondo queste fasi permette di:
- Eseguire codice al momento più opportuno (es. chiamate API, timers, listeners)
- Ottimizzare le prestazioni del rendering
- Prevenire memory leaks e comportamenti non desiderati
- Organizzare il codice in modo prevedibile e mantenibile

---

## **1. Le tre fasi principali del ciclo di vita**

### A. **Montaggio (Mounting)**

È la fase in cui il componente viene:
1. Costruito (con il costruttore o l’invocazione della funzione)
2. Inserito nel DOM virtuale (Virtual DOM)
3. Reso visibile nel DOM reale

Questa fase avviene **una sola volta**, quando il componente viene istanziato per la prima volta.

**Momenti tipici di utilizzo**:
- Effettuare fetch iniziali di dati
- Inizializzare librerie di terze parti
- Registrare listeners globali (es. `window.addEventListener`)

---

### B. **Aggiornamento (Updating)**

Questa fase avviene ogni volta che:
- Cambiano le `props`
- Cambia lo `state`
- Cambia il valore derivato da un `context`

Ogni aggiornamento provoca un **nuovo ciclo di render**, seguito da eventuali aggiornamenti del DOM. React cerca sempre di **minimizzare le operazioni sul DOM**, grazie al suo Virtual DOM e all’algoritmo di riconciliazione.

**Momenti tipici di utilizzo**:
- Sincronizzare lo stato con una prop o un effetto collaterale
- Reagire al cambiamento di un dato (es. aggiornare il titolo della pagina)
- Gestire operazioni basate su confronto con lo stato precedente

---

### C. **Smontaggio (Unmounting)**

È la fase in cui il componente:
- Viene rimosso dal DOM
- Libera tutte le risorse precedentemente allocate

**Momenti tipici di utilizzo**:
- Annullare chiamate API non concluse
- Rimuovere event listener
- Pulire timers, socket, observer

---

## **2. Functional vs Class Components nel ciclo di vita**

### **Functional Components con `useEffect`**

Nel paradigma moderno, il ciclo di vita si gestisce principalmente con l’hook `useEffect`.

```tsx
useEffect(() => {
  // codice eseguito al montaggio o aggiornamento

  return () => {
    // codice eseguito allo smontaggio
  };
}, [/* dipendenze */]);
```

Il comportamento cambia in base alle dipendenze:

| Dipendenza       | Fase corrispondente                 |
|------------------|--------------------------------------|
| `[]`             | Solo al **montaggio**               |
| `[variabile]`    | Al **montaggio + ogni cambiamento** della variabile |
| Assente          | Ad **ogni render**, incluso il primo |
| `return`         | **Smontaggio** o **prima del prossimo aggiornamento** |

---

### **Class Components: Lifecycle Methods**

I Class Components esplicitano le fasi tramite metodi:

```tsx
class MyComponent extends React.Component {
  componentDidMount() {
    // Montaggio
  }

  componentDidUpdate(prevProps, prevState) {
    // Aggiornamento
  }

  componentWillUnmount() {
    // Smontaggio
  }

  render() {
    return <div>Componente</div>;
  }
}
```

Ogni metodo corrisponde a un punto preciso del ciclo:

| Metodo                   | Fase         | Dettaglio                                                                 |
|--------------------------|--------------|--------------------------------------------------------------------------|
| `constructor()`          | Inizializzazione | Solo nei Class Components                                                |
| `render()`               | Sempre       | Usato per generare l’albero del DOM virtuale                             |
| `componentDidMount()`    | Dopo il primo render | Ottimo per fetch o inizializzazioni                                      |
| `componentDidUpdate()`   | Dopo ogni aggiornamento | Utile per confrontare vecchie e nuove props o stato                      |
| `componentWillUnmount()` | Prima della rimozione dal DOM | Utile per pulire risorse                                                 |

---

## **3. Approccio reattivo: il ciclo si adatta ai dati**

Una caratteristica fondamentale del ciclo di vita in React è che non è manuale: **React osserva le variazioni di stato e props, e attiva il ciclo di aggiornamento in automatico**.

Questa **reattività** è al centro dell'architettura di React e permette di:
- Rilevare i cambiamenti con precisione
- Evitare operazioni superflue nel DOM
- Scrivere componenti dichiarativi e prevedibili

---

## **4. Effetti collaterali e sincronizzazione: quando agire**

### Esempi di azioni da posizionare correttamente nel ciclo:

| Azione                                | Dove collocarla                     |
|---------------------------------------|--------------------------------------|
| Chiamata a un'API                     | `useEffect(..., [])` o `componentDidMount()` |
| Pulizia di un timer o listener        | `return () => {...}` o `componentWillUnmount()` |
| Aggiornare il titolo del documento    | `useEffect(..., [dipendenza])` |
| Riconciliare stato locale con prop    | `useEffect(..., [prop])`            |

---

## **5. Best Practice**

- Non inserire logica asincrona nel corpo del componente o dentro `render()`
- Separa effetti diversi in `useEffect` distinti
- Pulisci sempre risorse in `useEffect` per evitare memory leaks
- Evita dipendenze non dichiarate nei `useEffect` con array di dipendenze incompleti
- Usa `useLayoutEffect` **solo** se è necessario eseguire codice prima del repaint del browser

---

## **Conclusione**

Il ciclo di vita dei componenti React è uno degli elementi chiave per comprendere quando e come interagire con il mondo esterno (es. browser, API, librerie esterne). Con i Functional Components, `useEffect` sostituisce in modo efficace e flessibile i vecchi metodi delle classi, mantenendo chiarezza e potenza espressiva. Conoscerne le sfumature è fondamentale per scrivere componenti robusti, efficienti e reattivi.































ESERCIZIO CONCLUSIVO

- Composizione dei componenti
- Gestione dello state con `useState`
- Passaggio e gestione delle props
- Tipizzazione in TypeScript

---

## Titolo  
**Gestione di una Lista Progetti**

---

## Obiettivo  

Costruire un'applicazione React che gestisce dinamicamente una lista di progetti, composta da:

- Aggiunta di nuovi progetti
- Completamento o annullamento del completamento
- Visualizzazione della lista in una struttura modulare
- Separazione tra componente genitore e figli
- Tipizzazione chiara delle props e dello state

---

## Struttura dei file

```
src/
├── App.tsx
├── components/
│   ├── AddProjectForm.tsx
│   ├── ProjectList.tsx
│   └── ProjectItem.tsx
├── types/
│   └── project.ts
```

---

## Tipi

### types/project.ts

```ts
export type Project = {
  id: number;
  title: string;
  isCompleted: boolean;
};
```

---

## Descrizione dei componenti

### App.tsx

Responsabilità:
- Gestire lo `state` globale della lista progetti
- Fornire le funzioni per: aggiungere un progetto e modificarne lo stato
- Passare i dati e le funzioni ai componenti figli

Comportamento:
- All’avvio contiene almeno due progetti iniziali
- Visualizza il numero di progetti completati
- Ordina la lista mettendo quelli incompleti sopra

---

### AddProjectForm.tsx

Responsabilità:
- Gestire localmente lo `state` dell’input
- Validare l’input (non vuoto)
- Inviare il titolo al genitore tramite la prop `onAdd`

---

### ProjectList.tsx

Responsabilità:
- Ricevere la lista dei progetti e la funzione di toggle
- Comporre una lista di `ProjectItem`

---

### ProjectItem.tsx

Responsabilità:
- Ricevere i dati di un singolo progetto
- Visualizzarne il titolo
- Cambiare stile se completato
- Gestire il bottone per attivare/disattivare il completamento

---

## Guida step-by-step

### Step 1 – Definire il tipo `Project`  
Crea `types/project.ts` come mostrato sopra.

---

### Step 2 – Creare `App.tsx`

- Inizializza lo `state` con `useState<Project[]>`
- Implementa la funzione `addProject(title: string)`
- Implementa la funzione `toggleProject(id: number)`
- Ordina la lista: incompleti prima, completati dopo
- Conta i completati con `.filter()`

---

### Step 3 – `AddProjectForm.tsx`

- Input controllato con `useState<string>`
- Al submit:
  - valida il contenuto (trim)
  - invoca `onAdd(title)`
  - resetta l’input

---

### Step 4 – `ProjectList.tsx`

- Props:
  - `projects: Project[]`
  - `onToggle: (id: number) => void`
- Cicla i progetti e crea `ProjectItem` per ciascuno

---

### Step 5 – `ProjectItem.tsx`

- Props:
  - `project: Project`
  - `onToggle: () => void`
- Visualizza titolo
- Cambia colore se completato (es. verde)
- Bottone "Completa" o "Annulla"

---

## Schema visivo

```
App.tsx
├── AddProjectForm
└── ProjectList
    ├── ProjectItem
    ├── ProjectItem
    └── ...
```

---

## Obiettivi didattici

- Comprendere come progettare componenti modulati
- Applicare `useState` per gestire lo stato locale e globale
- Tipizzare correttamente props e state
- Comprendere il flusso dati unidirezionale in React
- Usare `map`, `filter`, `sort` in modo reattivo

---



















Ecco la **soluzione completa** dell'esercizio sulla gestione della lista progetti. La struttura è coerente, modulare, completamente tipizzata in TypeScript e **non utilizza `useEffect`**, rispettando le tue indicazioni.

---

##  `types/project.ts`

```ts
export type Project = {
  id: number;
  title: string;
  isCompleted: boolean;
};
```

---

##  `App.tsx`

```tsx
import { useState } from 'react';
import { Project } from './types/project';
import AddProjectForm from './components/AddProjectForm';
import ProjectList from './components/ProjectList';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: 'Sviluppo sito aziendale', isCompleted: false },
    { id: 2, title: 'Analisi dei competitor', isCompleted: true },
  ]);

  const handleAddProject = (title: string) => {
    const newProject: Project = {
      id: Date.now(),
      title,
      isCompleted: false,
    };
    setProjects([...projects, newProject]);
  };

  const handleToggleProject = (id: number) => {
    const updated = projects.map((proj) =>
      proj.id === id ? { ...proj, isCompleted: !proj.isCompleted } : proj
    );
    setProjects(updated);
  };

  const completedCount = projects.filter((p) => p.isCompleted).length;

  const sortedProjects = [
    ...projects.filter((p) => !p.isCompleted),
    ...projects.filter((p) => p.isCompleted),
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Progetti attivi</h1>
      <AddProjectForm onAdd={handleAddProject} />

      {projects.length === 0 ? (
        <p>Nessun progetto presente.</p>
      ) : (
        <>
          <p>
            Completati: {completedCount} / {projects.length}
          </p>
          <ProjectList projects={sortedProjects} onToggle={handleToggleProject} />
        </>
      )}
    </div>
  );
}
```

---

##  `components/AddProjectForm.tsx`

```tsx
import { useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
};

export default function AddProjectForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed === '') return;
    onAdd(trimmed);
    setTitle('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={title}
        placeholder="Nuovo progetto"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={handleSubmit}>Aggiungi</button>
    </div>
  );
}
```

---

##  `components/ProjectList.tsx`

```tsx
import { Project } from '../types/project';
import ProjectItem from './ProjectItem';

type Props = {
  projects: Project[];
  onToggle: (id: number) => void;
};

export default function ProjectList({ projects, onToggle }: Props) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onToggle={() => onToggle(project.id)}
        />
      ))}
    </ul>
  );
}
```

---

##  `components/ProjectItem.tsx`

```tsx
import { Project } from '../types/project';

type Props = {
  project: Project;
  onToggle: () => void;
};

export default function ProjectItem({ project, onToggle }: Props) {
  return (
    <li
      style={{
        marginBottom: '10px',
        color: project.isCompleted ? 'green' : 'black',
        fontWeight: 'bold',
      }}
    >
      {project.title}{' '}
      <button onClick={onToggle}>
        {project.isCompleted ? 'Annulla' : 'Completa'}
      </button>
    </li>
  );
}
```

---

##  Risultato atteso

L'app mostra inizialmente due progetti. L'utente può:
- Aggiungere nuovi progetti con l'input
- Segnarli come completati o annullarli
- Vedere i completati in fondo alla lista
- Vedere il conteggio dei completati

---