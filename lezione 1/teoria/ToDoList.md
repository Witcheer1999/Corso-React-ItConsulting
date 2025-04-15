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