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