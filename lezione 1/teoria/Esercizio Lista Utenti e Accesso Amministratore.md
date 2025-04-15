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
