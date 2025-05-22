# **Modulo 1 – Introduzione e configurazione base di React Router**

Durata stimata: 60–75 minuti

---

## 1. Cos'è React Router e perché si usa

**React Router** è la libreria ufficiale per la gestione delle rotte in un'applicazione React. Consente di costruire interfacce a **pagina singola (SPA)** che supportano una navigazione simile a quella di un'applicazione multipagina, **senza ricaricare il browser**.

### Perché è necessario:

* React, di base, non ha un sistema di routing.
* Permette di gestire viste diverse in un'app mantenendo l'URL coerente.
* Abilita la navigazione dinamica tra componenti.
* Supporta rotte dinamiche, nested, protette e navigazione imperativa.

---

## 2. Differenza tra SPA e navigazione nativa

### Navigazione nativa (Multi-Page App)

* Ogni clic su un link genera una nuova richiesta HTTP al server.
* Il server restituisce una nuova pagina HTML.
* Tutto il contenuto viene ricaricato.

### SPA con React Router

* L'app carica una singola pagina HTML.
* La navigazione aggiorna **solo il contenuto visibile**, modificando la URL.
* Il comportamento del browser (back/forward, bookmark) è mantenuto.
* Tutto viene gestito **lato client**, senza ricaricare la pagina.

---

## 3. Installazione del pacchetto

Per iniziare a usare React Router in un progetto React:

```bash
npm install react-router-dom
```

Per progetti TypeScript, le tipizzazioni sono già incluse.

---

## 4. Configurazione iniziale

### a. Wrappare l'app con `<BrowserRouter>`

Nel punto più alto dell'applicazione (di solito `main.tsx` o `index.tsx`), avvolgere il componente `<App />`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

Questo abilita la gestione della storia del browser, degli URL e della navigazione.

---

### b. Definizione delle rotte con `<Routes>` e `<Route>`

Nel file `App.tsx`, definire le rotte:

```tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
```

### Dettagli:

* `path` definisce l'URL
* `element` accetta il componente React da renderizzare
* Le rotte sono valutate in ordine e sono **esclusive**: solo una alla volta viene attivata

---

## 5. Navigazione con `<Link>` vs `<a>`

### Componente `<Link>`

```tsx
import { Link } from 'react-router-dom';

<Link to="/about">Vai alla pagina About</Link>
```

* Navigazione **client-side**, veloce e senza ricarica
* Non ricarica il browser
* Mantiene lo stato dell'app e del router

### Tag HTML `<a>`

```html
<a href="/about">Vai alla pagina About</a>
```

* Causa un **reload completo della pagina**
* Sconsigliato in SPA con React Router

**Best practice:** usare sempre `<Link>` per la navigazione interna

---

## 6. Redirezione con `<Navigate>`

Per effettuare un redirect programmatico o condizionato, usare il componente `<Navigate>`:

### Esempio:

```tsx
import { Navigate } from 'react-router-dom';

function LoginRedirect() {
  const isLoggedIn = false;
  return isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />;
}
```

* `to`: destinazione del redirect
* `replace`: sostituisce l'URL corrente nella history (evita che il back lo riapra)

Può essere usato all'interno di componenti per gestire accessi, logout o flussi condizionati.

---









































---

#  Esercizio: Mini-sito con 3 pagine

---

##  Obiettivo

* Configurare React Router in un'app React
* Definire tre rotte statiche
* Navigare tra le pagine usando `<Link>`
* Mostrare una pagina di default (`/`)
* Implementare un redirect dalla pagina `/contatti-vecchia` a `/contatti` con `<Navigate>`

---

##  Struttura del progetto

```
src/
├── main.tsx
├── App.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
```

---

##  1. Installazione

```bash
npm install react-router-dom
```

---

##  2. Wrapping con `<BrowserRouter>` in `main.tsx`

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

###  Perché:

`<BrowserRouter>` avvolge tutta l'app e abilita il controllo dell’URL e della cronologia, necessario affinché React Router funzioni correttamente.

---

##  3. Definizione delle rotte in `App.tsx`

```tsx
// App.tsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link>
        <Link to="/chi-siamo">Chi siamo</Link>
        <Link to="/contatti">Contatti</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chi-siamo" element={<AboutPage />} />
        <Route path="/contatti" element={<ContactPage />} />

        {/* Redirect da URL vecchio a nuovo */}
        <Route path="/contatti-vecchia" element={<Navigate to="/contatti" replace />} />
      </Routes>
    </div>
  );
}
```

###  Perché:

* `Routes` contiene tutte le rotte dell’applicazione.
* Ogni `Route` ha un `path` e un `element` da renderizzare.
* `<Link>` consente la navigazione **client-side**, senza ricaricare la pagina.
* `<Navigate>` gestisce il **redirect automatico** da una rotta obsoleta.

---

##  4. Pagine statiche

```tsx
// pages/HomePage.tsx
export default function HomePage() {
  return <h1>Benvenuto nella Home</h1>;
}
```

```tsx
// pages/AboutPage.tsx
export default function AboutPage() {
  return <h1>Chi siamo</h1>;
}
```

```tsx
// pages/ContactPage.tsx
export default function ContactPage() {
  return <h1>Contattaci</h1>;
}
```

###  Perché:

Separare le pagine in componenti dedicati consente una **struttura chiara e scalabile**. Ogni componente è autonomo e può essere evoluto in seguito con contenuti dinamici o logica aggiuntiva.

---

##  Comportamenti ottenuti

| Azione                                              | Comportamento                                              |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Visito `/`                                          | Viene renderizzata la pagina Home                          |
| Clicco su "Chi siamo"                               | React Router mostra `AboutPage` senza ricaricare la pagina |
| Scrivo `/contatti` nella barra                      | Appare la pagina Contatti                                  |
| Scrivo `/contatti-vecchia` o clicco un link vecchio | Vengo automaticamente reindirizzato su `/contatti`         |

---













































---

# Modulo 2.1 – Rotte dinamiche

## 1. Cosa sono le rotte dinamiche

Le rotte dinamiche permettono di definire percorsi che cambiano in base al contenuto o al contesto.

Esempi reali:

* `/user/42`
* `/post/react-router-6`
* `/prodotto/macbook-air`

### Sintassi:

```tsx
<Route path="/user/:id" element={<UserPage />} />
```

Il valore `:id` è un **segnaposto** dinamico che corrisponde a qualsiasi valore nella posizione dell’URL. Può essere letto all’interno del componente associato tramite il hook `useParams`.

---

## 2. Accesso ai parametri con `useParams()`

`useParams()` è un hook fornito da `react-router-dom` che restituisce un oggetto con tutti i parametri dinamici della rotta.

### Esempio:

```tsx
import { useParams } from 'react-router-dom';

export default function UserPage() {
  const { id } = useParams();

  return <h2>Profilo utente con ID: {id}</h2>;
}
```

* `id` sarà una stringa contenente il valore corrispondente all’URL.
* Se visiti `/user/123`, il valore di `id` sarà `"123"`.

---

## 3. Definizione completa in `App.tsx`

```tsx
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/user/1">Profilo 1</Link>
        <Link to="/user/2">Profilo 2</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </div>
  );
}
```

---

## 4. Esempio di `UserPage.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function UserPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Pagina utente</h1>
      <p>ID ricevuto dall’URL: {id}</p>
    </div>
  );
}
```

---

## 5. Punti chiave

| Aspetto                   | Dettaglio                                                  |
| ------------------------- | ---------------------------------------------------------- |
| Sintassi del path         | `path="/risorsa/:param"`                                   |
| Lettura parametri         | Con `const { param } = useParams();`                       |
| Tipo di ritorno           | I parametri sono **sempre stringhe**                       |
| Validazione dei parametri | Va effettuata manualmente (es. se ci si aspetta un numero) |
| Multipli parametri        | Possibile ma trattato nel Modulo 2.3                       |

---

## 6. Best practice

* Assegnare sempre nomi **descrittivi** ai parametri (`:id`, `:slug`, `:username`)
* Verificare che il parametro ricevuto sia valido prima di utilizzarlo (es. ID numerico)
* Evitare logica lato client che dipenda da parametri non validati

---






























---

# Modulo 2.2 – Nested Routes (Rotte annidate)

## 1. Cosa sono le rotte annidate

Le **rotte annidate** permettono di dichiarare sottopercorsi interni a un’altra rotta e di visualizzarli all’interno di un layout comune.

Sono utili per:

* Costruire **dashboard**, aree riservate, sezioni con navigazione interna
* Riutilizzare parti comuni dell’interfaccia (es. barra laterale, intestazione)
* Mantenere coerente la struttura URL e visiva

---

## 2. Struttura base delle rotte annidate

```tsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

Questa struttura produce i seguenti percorsi:

* `/dashboard/profile`
* `/dashboard/settings`

Le pagine `Profile` e `Settings` **non sono visibili da sole**: vengono rese all’interno del componente `Dashboard`.

---

## 3. Il componente `<Outlet />`

All’interno del componente che definisce rotte annidate, è necessario inserire il componente `<Outlet />`.

### Funzione:

`<Outlet />` rappresenta lo spazio in cui verrà renderizzato il contenuto figlio della rotta corrente.

### Esempio:

```tsx
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Area riservata</h1>
      <Outlet />
    </div>
  );
}
```

---

## 4. Esempio pratico

### a. Definizione in `App.tsx`

```tsx
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/dashboard/profile">Profilo</Link> | <Link to="/dashboard/settings">Impostazioni</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}
```

---

### b. Componente `Dashboard.tsx`

```tsx
import { Outlet, Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <Link to="profile">Profilo</Link> | <Link to="settings">Impostazioni</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

### c. Componenti `Profile.tsx` e `Settings.tsx`

```tsx
export default function Profile() {
  return <p>Benvenuto nel tuo profilo</p>;
}

export default function Settings() {
  return <p>Modifica le tue impostazioni</p>;
}
```

---

## 5. Considerazioni sulla struttura URL

* `Link to="profile"` si traduce in `/dashboard/profile` **grazie al contesto**
* `Outlet` permette di **non perdere il layout principale** quando si naviga tra le sottosezioni
* È possibile annidare ulteriormente (nested di secondo o terzo livello), ma conviene farlo solo quando necessario

---

## 6. Best practice

| Aspetto                | Raccomandazione                                                       |
| ---------------------- | --------------------------------------------------------------------- |
| Layout riutilizzabili  | Inserire `<Outlet />` in componenti layout (es. Dashboard, AreaAdmin) |
| Chiarezza dei percorsi | Usare nomi coerenti con la struttura dell’interfaccia                 |
| Modularità             | Separare le route complesse in moduli (es. `DashboardRoutes.tsx`)     |
| Ridurre la profondità  | Annidare solo se il layout o la logica lo richiedono                  |

---

























#  Esercizio: Mini portale degli utenti

## Obiettivo

Realizzare un’applicazione React che mostri:

* Una lista di utenti
* Un link che porta al **profilo dinamico** di ciascun utente (`/utenti/:id`)
* Una sezione `Informazioni` e una `Preferenze` **annidate** nel profilo

---

##  Struttura dei file

```
src/
├── App.tsx
├── data/users.ts
├── pages/
│   ├── HomePage.tsx
│   ├── UsersPage.tsx
│   ├── UserLayout.tsx
│   ├── UserInfo.tsx
│   └── UserPreferences.tsx
```

---

## 1. Setup iniziale delle rotte in `App.tsx`

```tsx
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import UserLayout from './pages/UserLayout';
import UserInfo from './pages/UserInfo';
import UserPreferences from './pages/UserPreferences';

export default function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link> | <Link to="/utenti">Utenti</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/utenti" element={<UsersPage />} />

        {/* Rotta dinamica con annidamento */}
        <Route path="/utenti/:id" element={<UserLayout />}>
          <Route path="info" element={<UserInfo />} />
          <Route path="preferenze" element={<UserPreferences />} />
        </Route>
      </Routes>
    </div>
  );
}
```

### Spiegazione

* `/utenti` mostra l’elenco degli utenti.
* `/utenti/:id` rappresenta una rotta dinamica. Il parametro `id` identifica l’utente.
* Dentro questa rotta, sono annidate le sezioni `/info` e `/preferenze`.
* Il componente `UserLayout` funge da layout persistente del profilo.

---

## 2. Finto database utenti `data/users.ts`

```ts
export const users = [
  { id: '1', name: 'Luca' },
  { id: '2', name: 'Anna' },
  { id: '3', name: 'Giulia' },
];
```

---

## 3. `HomePage.tsx`

```tsx
export default function HomePage() {
  return <h1>Benvenuto nel portale utenti</h1>;
}
```

---

## 4. `UsersPage.tsx` – Lista di utenti con link dinamico

```tsx
import { Link } from 'react-router-dom';
import { users } from '../data/users';

export default function UsersPage() {
  return (
    <div>
      <h2>Lista utenti</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/utenti/${user.id}/info`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Spiegazione

* Per ogni utente creiamo un link che punta a `/utenti/:id/info`, cioè alla sezione "info" del profilo.
* `user.id` è il parametro dinamico passato alla rotta.

---

## 5. `UserLayout.tsx` – Componente layout con `useParams` e `<Outlet />`

```tsx
import { useParams, Link, Outlet } from 'react-router-dom';
import { users } from '../data/users';

export default function UserLayout() {
  const { id } = useParams();
  const user = users.find(u => u.id === id);

  if (!user) return <p>Utente non trovato.</p>;

  return (
    <div>
      <h2>Profilo di {user.name}</h2>
      <nav>
        <Link to="info">Info</Link> | <Link to="preferenze">Preferenze</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

### Spiegazione

* `useParams()` ci dà accesso al parametro `:id` dinamico.
* Usiamo il parametro per trovare l’utente dal nostro array statico.
* `<Outlet />` mostra il contenuto delle rotte annidate (info, preferenze).

---

## 6. `UserInfo.tsx` – Sezione annidata

```tsx
import { useParams } from 'react-router-dom';

export default function UserInfo() {
  const { id } = useParams();
  return <p>Sezione informazioni dell’utente con ID {id}</p>;
}
```

---

## 7. `UserPreferences.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function UserPreferences() {
  const { id } = useParams();
  return <p>Preferenze utente ID {id}</p>;
}
```

---

## 🔍 Comportamento finale

| URL                    | Componente visualizzato                                      |
| ---------------------- | ------------------------------------------------------------ |
| `/`                    | HomePage                                                     |
| `/utenti`              | Lista utenti (`UsersPage`)                                   |
| `/utenti/2/info`       | `UserLayout` con contenuto `UserInfo` per utente ID 2        |
| `/utenti/3/preferenze` | `UserLayout` con contenuto `UserPreferences` per utente ID 3 |

---



































---

#  Esercizio: Portale corsi

## Obiettivo

Creare un’applicazione React che simuli un portale di corsi. L’applicazione deve permettere di:

1. Mostrare la lista dei corsi disponibili.
2. Navigare al dettaglio di ogni corso usando una **rotta dinamica** (`/corsi/:id`).
3. All’interno del dettaglio del corso, gestire due **sezioni annidate**:

   * Descrizione (`/corsi/:id/descrizione`)
   * Materiali (`/corsi/:id/materiali`)

---

## Requisiti tecnici

* Utilizzare **React Router DOM** per la gestione delle rotte.
* Utilizzare `useParams()` per leggere l’`id` del corso.
* Utilizzare `<Outlet />` per gestire il layout del dettaglio.
* Separare i componenti in file distinti.

---

## Specifiche

* La rotta `/` deve mostrare una homepage.
* La rotta `/corsi` deve mostrare una lista di corsi (minimo 3), con link verso `/corsi/:id/descrizione`.
* Ogni pagina di dettaglio del corso deve contenere un layout condiviso e due link:

  * `Descrizione` (sezione annidata)
  * `Materiali` (sezione annidata)

---

## Struttura attesa

```
src/
├── App.tsx
├── data/corsi.ts
├── pages/
│   ├── HomePage.tsx
│   ├── CorsiPage.tsx
│   ├── CorsoLayout.tsx
│   ├── CorsoDescrizione.tsx
│   └── CorsoMateriali.tsx
```

---

# Soluzione

---

### `data/corsi.ts`

```ts
export const corsi = [
  { id: '1', titolo: 'React Base' },
  { id: '2', titolo: 'TypeScript Avanzato' },
  { id: '3', titolo: 'Full-Stack con Node.js' }
];
```

---

### `App.tsx`

```tsx
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CorsiPage from './pages/CorsiPage';
import CorsoLayout from './pages/CorsoLayout';
import CorsoDescrizione from './pages/CorsoDescrizione';
import CorsoMateriali from './pages/CorsoMateriali';

export default function App() {
  return (
    <div>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/corsi">Corsi</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/corsi" element={<CorsiPage />} />
        <Route path="/corsi/:id" element={<CorsoLayout />}>
          <Route path="descrizione" element={<CorsoDescrizione />} />
          <Route path="materiali" element={<CorsoMateriali />} />
        </Route>
      </Routes>
    </div>
  );
}
```

---

### `HomePage.tsx`

```tsx
export default function HomePage() {
  return <h1>Benvenuto nel portale corsi</h1>;
}
```

---

### `CorsiPage.tsx`

```tsx
import { Link } from 'react-router-dom';
import { corsi } from '../data/corsi';

export default function CorsiPage() {
  return (
    <>
      <h2>Catalogo corsi</h2>
      <ul>
        {corsi.map(corso => (
          <li key={corso.id}>
            <Link to={`/corsi/${corso.id}/descrizione`}>{corso.titolo}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

---

### `CorsoLayout.tsx`

```tsx
import { useParams, Link, Outlet } from 'react-router-dom';
import { corsi } from '../data/corsi';

export default function CorsoLayout() {
  const { id } = useParams();
  const corso = corsi.find(c => c.id === id);

  if (!corso) return <p>Corso non trovato.</p>;

  return (
    <>
      <h2>{corso.titolo}</h2>
      <nav>
        <Link to="descrizione">Descrizione</Link> | <Link to="materiali">Materiali</Link>
      </nav>
      <Outlet />
    </>
  );
}
```

---

### `CorsoDescrizione.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function CorsoDescrizione() {
  const { id } = useParams();
  return <p>Sezione descrizione del corso ID {id}</p>;
}
```

---

### `CorsoMateriali.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function CorsoMateriali() {
  const { id } = useParams();
  return <p>Materiali per il corso ID {id}</p>;
}
```

---



























# Modulo 2.3 – Parametri multipli, fallback e best practice generali

## 1. Parametri dinamici multipli

### Definizione

React Router consente di definire più parametri nello stesso path utilizzando più segnaposto `:nome`.

### Sintassi

```tsx
<Route path="/articolo/:categoria/:slug" element={<Articolo />} />
```

In questo caso, un URL valido potrebbe essere:

```
/articolo/react/introduzione-a-router
```

### Accesso ai parametri

```tsx
import { useParams } from 'react-router-dom';

export default function Articolo() {
  const { categoria, slug } = useParams();

  return (
    <>
      <h2>Categoria: {categoria}</h2>
      <p>Articolo: {slug}</p>
    </>
  );
}
```

### Nota

* I parametri sono **sempre stringhe**.
* Non è possibile applicare validazioni o trasformazioni nel path: vanno gestite manualmente.

---

## 2. Parametri opzionali

React Router **non supporta direttamente i parametri opzionali** con la sintassi `:id?` (come avviene in Express). Tuttavia, esistono due modi per ottenere un comportamento simile:

### a. Usare due rotte distinte

```tsx
<Route path="/profilo" element={<ProfiloGenerico />} />
<Route path="/profilo/:username" element={<ProfiloDettagliato />} />
```

### b. Gestione condizionale all’interno del componente

```tsx
<Route path="/profilo/:username" element={<Profilo />} />
```

```tsx
export default function Profilo() {
  const { username } = useParams();

  if (!username) {
    return <p>Profilo pubblico</p>;
  }

  return <p>Profilo di {username}</p>;
}
```

**Nota:** Questo approccio è sconsigliato se il parametro è essenziale per distinguere contenuti.

---

## 3. Fallback per rotte inesistenti (pagina 404)

React Router consente di intercettare tutte le rotte non corrispondenti usando:

```tsx
<Route path="*" element={<NotFound />} />
```

Questa rotta viene attivata **solo se nessun'altra viene risolta**.

### Esempio:

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/contatti" element={<Contatti />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Componente `NotFound`

```tsx
export default function NotFound() {
  return <h2>Errore 404 – Pagina non trovata</h2>;
}
```

---

## 4. Redirect fallback o automatici con `<Navigate>`

Per fare redirect automatici (ad esempio da vecchie URL), si usa:

```tsx
<Route path="/vecchia-home" element={<Navigate to="/" replace />} />
```

### Proprietà:

* `to`: destinazione
* `replace`: rimuove l’URL corrente dalla history (utile per evitare il ritorno con "indietro")

---

## 5. Best practice generali nella gestione delle rotte

### a. Pulizia e chiarezza

* Usare nomi di path coerenti (`/utenti/:id`, non `/u/:uid`)
* Separare le rotte principali da quelle annidate

### b. Modularità

* Definire le route in file dedicati (`AppRoutes.tsx`, `DashboardRoutes.tsx`)
* Evitare di mischiare troppe route in un unico componente

### c. Validazione dei parametri

* Non fidarsi mai del contenuto di `useParams()` per scopi critici
* Validare ID, slug o username prima di effettuare richieste o logiche

### d. Fallback sempre presenti

* Includere sempre un fallback con `path="*"` per evitare comportamenti non gestiti
* Creare una `NotFound` personalizzata per uniformare l'esperienza

### e. Uso responsabile di `<Navigate>`

* Usare solo in risposta a condizioni precise (es. autenticazione fallita, logout)
* Non abusarne per gestire normali flussi di navigazione (preferire `useNavigate()`)

---




































# Esempio: Portale Categorie & Articoli

## Obiettivo

Creare un’app che consenta:

1. Navigazione tra **categorie di articoli**
2. Visualizzazione dinamica di un **articolo specifico** (`/articoli/:categoria/:slug`)
3. Comportamento **fallback** per:

   * Articolo non trovato
   * Categoria inesistente
   * URL non valido
4. Integrazione con **Redux Toolkit** per la gestione degli articoli

---

## Struttura file

```
src/
├── App.tsx
├── store/
│   ├── store.ts
│   └── articoliSlice.ts
├── pages/
│   ├── Home.tsx
│   ├── CategoriaPage.tsx
│   ├── ArticoloPage.tsx
│   ├── NotFound.tsx
│   └── RedirectLegacy.tsx
├── data/articoli.ts
```

---

## 1. `data/articoli.ts`

```ts
export const articoli = [
  { categoria: 'react', slug: 'introduzione-hooks', titolo: 'Introduzione a React Hooks' },
  { categoria: 'redux', slug: 'gestione-stato', titolo: 'Gestione dello stato con Redux' },
  { categoria: 'react', slug: 'router-dom', titolo: 'Routing con React Router' },
];
```

---

## 2. Redux store – `store/articoliSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { articoli } from '../data/articoli';

export type Articolo = {
  categoria: string;
  slug: string;
  titolo: string;
};

const articoliSlice = createSlice({
  name: 'articoli',
  initialState: articoli,
  reducers: {},
});

export default articoliSlice.reducer;
```

---

## 3. `store/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import articoliReducer from './articoliSlice';

export const store = configureStore({
  reducer: {
    articoli: articoliReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. `App.tsx`

```tsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoriaPage from './pages/CategoriaPage';
import ArticoloPage from './pages/ArticoloPage';
import NotFound from './pages/NotFound';
import RedirectLegacy from './pages/RedirectLegacy';

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/articoli/react">React</Link> | <Link to="/articoli/redux">Redux</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articoli/:categoria" element={<CategoriaPage />} />
        <Route path="/articoli/:categoria/:slug" element={<ArticoloPage />} />
        <Route path="/old-article" element={<RedirectLegacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

---

## 5. `Home.tsx`

```tsx
export default function Home() {
  return <h1>Benvenuto nel portale tecnico</h1>;
}
```

---

## 6. `CategoriaPage.tsx`

```tsx
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function CategoriaPage() {
  const { categoria } = useParams();
  const articoli = useSelector((state: RootState) =>
    state.articoli.filter(a => a.categoria === categoria)
  );

  if (!categoria || articoli.length === 0) {
    return <p>Nessun articolo trovato per questa categoria.</p>;
  }

  return (
    <>
      <h2>Categoria: {categoria}</h2>
      <ul>
        {articoli.map(a => (
          <li key={a.slug}>
            <Link to={`/articoli/${a.categoria}/${a.slug}`}>{a.titolo}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

---

## 7. `ArticoloPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function ArticoloPage() {
  const { categoria, slug } = useParams();
  const articolo = useSelector((state: RootState) =>
    state.articoli.find(a => a.categoria === categoria && a.slug === slug)
  );

  if (!articolo) {
    return <p>Articolo non trovato o URL errato.</p>;
  }

  return (
    <>
      <h2>{articolo.titolo}</h2>
      <p>Categoria: {articolo.categoria}</p>
      <p>Slug: {articolo.slug}</p>
    </>
  );
}
```

---

## 8. `RedirectLegacy.tsx`

```tsx
import { Navigate } from 'react-router-dom';

export default function RedirectLegacy() {
  return <Navigate to="/articoli/react/introduzione-hooks" replace />;
}
```

---

## 9. `NotFound.tsx`

```tsx
export default function NotFound() {
  return <h2>404 – Pagina non trovata</h2>;
}
```

---

























#  Esercizio – Portale Categorie & Prodotti

## Obiettivo

Realizzare un’applicazione React che permetta di:

1. Visualizzare una lista di prodotti, suddivisi per categoria.
2. Accedere al dettaglio di ogni prodotto tramite una rotta dinamica (`/prodotti/:categoria/:id`).
3. Aggiungere nuovi prodotti tramite un form gestito con Redux Toolkit.
4. Gestire errori di navigazione con un fallback 404.
5. Reindirizzare vecchi URL a nuove destinazioni con `<Navigate>`.

---

## Requisiti funzionali

### Rotte

* `/` – homepage
* `/prodotti` – lista di tutte le categorie
* `/prodotti/:categoria` – lista dei prodotti per categoria
* `/prodotti/:categoria/:id` – dettaglio del prodotto selezionato
* `/aggiungi` – form per aggiungere un nuovo prodotto
* `/catalogo` – redirect automatico a `/prodotti`
* `*` – rotta fallback per pagine non trovate

---

### Stato gestito con Redux

* La lista dei prodotti è salvata nello store Redux (`productsSlice`)
* Ogni prodotto ha:

  * `id: string`
  * `nome: string`
  * `categoria: string`
  * `prezzo: number`

---

### Comportamento richiesto

* La pagina `/prodotti/:categoria` mostra solo i prodotti di quella categoria
* La pagina `/prodotti/:categoria/:id` mostra i dettagli del singolo prodotto
* Il form in `/aggiungi` consente di compilare i campi e salvare un nuovo prodotto nello store
* Se si accede a una categoria inesistente o a un ID non presente, viene mostrato un messaggio di errore
* La rotta `/catalogo` reindirizza automaticamente a `/prodotti`
* Qualsiasi altra rotta non definita mostra una pagina 404

---

## Componenti minimi richiesti

* `HomePage`
* `ProdottiPage` – lista delle categorie con link
* `CategoriaPage` – lista dei prodotti di una categoria
* `DettaglioProdottoPage`
* `AggiungiProdottoPage` – contiene il form
* `NotFoundPage`
* `RedirectCatalogo`

---

## Struttura consigliata

```
src/
├── App.tsx
├── data/
│   └── initialProducts.ts
├── store/
│   ├── store.ts
│   └── productsSlice.ts
├── pages/
│   ├── HomePage.tsx
│   ├── ProdottiPage.tsx
│   ├── CategoriaPage.tsx
│   ├── DettaglioProdottoPage.tsx
│   ├── AggiungiProdottoPage.tsx
│   ├── RedirectCatalogo.tsx
│   └── NotFoundPage.tsx
```

---

## Obiettivi didattici

| Concetto                          | Applicazione concreta                             |
| --------------------------------- | ------------------------------------------------- |
| React Router – parametri dinamici | `:categoria`, `:id` nelle rotte dei prodotti      |
| React Router – fallback 404       | `path="*"` gestito con `NotFoundPage`             |
| React Router – redirect           | uso di `<Navigate />` in `/catalogo`              |
| Redux Toolkit – stato globale     | gestione della lista prodotti                     |
| Redux Toolkit – aggiunta dinamica | dispatch di azione per aggiungere un prodotto     |
| Form React con Redux              | `useState` locale per form + `dispatch` globale   |
| Validazione e gestione condizioni | errore se categoria o id non esistono nello store |

---

## Suggerimenti per la classe

* Strutturare prima le rotte e le pagine principali
* Implementare lo store Redux e i dati iniziali
* Collegare i componenti alla store tramite `useSelector` e `useDispatch`
* Aggiungere infine il form con validazione di base (campi obbligatori)

---












































##  Struttura del progetto

```
src/
├── App.tsx
├── data/
│   └── initialProducts.ts
├── store/
│   ├── store.ts
│   └── productsSlice.ts
├── pages/
│   ├── HomePage.tsx
│   ├── ProdottiPage.tsx
│   ├── CategoriaPage.tsx
│   ├── DettaglioProdottoPage.tsx
│   ├── AggiungiProdottoPage.tsx
│   ├── RedirectCatalogo.tsx
│   └── NotFoundPage.tsx
```



---

## 1. `data/initialProducts.ts`

```ts
export const initialProducts = [
  { id: '1', nome: 'Laptop Pro', categoria: 'elettronica', prezzo: 1200 },
  { id: '2', nome: 'Smartphone X', categoria: 'elettronica', prezzo: 800 },
  { id: '3', nome: 'Divano Comfort', categoria: 'arredamento', prezzo: 500 },
];
```



---

## 2. `store/productsSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialProducts } from '../data/initialProducts';

type Prodotto = {
  id: string;
  nome: string;
  categoria: string;
  prezzo: number;
};

const productsSlice = createSlice({
  name: 'prodotti',
  initialState: initialProducts as Prodotto[],
  reducers: {
    aggiungiProdotto: (state, action: PayloadAction<Prodotto>) => {
      state.push(action.payload);
    },
  },
});

export const { aggiungiProdotto } = productsSlice.actions;
export default productsSlice.reducer;
```



---

## 3. `store/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    prodotti: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```



---

## 4. `App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProdottiPage from './pages/ProdottiPage';
import CategoriaPage from './pages/CategoriaPage';
import DettaglioProdottoPage from './pages/DettaglioProdottoPage';
import AggiungiProdottoPage from './pages/AggiungiProdottoPage';
import RedirectCatalogo from './pages/RedirectCatalogo';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/prodotti">Prodotti</Link> | <Link to="/aggiungi">Aggiungi</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prodotti" element={<ProdottiPage />} />
        <Route path="/prodotti/:categoria" element={<CategoriaPage />} />
        <Route path="/prodotti/:categoria/:id" element={<DettaglioProdottoPage />} />
        <Route path="/aggiungi" element={<AggiungiProdottoPage />} />
        <Route path="/catalogo" element={<RedirectCatalogo />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```



---

## 5. `pages/HomePage.tsx`

```tsx
function HomePage() {
  return <h1>Benvenuto nel portale prodotti</h1>;
}

export default HomePage;
```



---

## 6. `pages/ProdottiPage.tsx`

```tsx
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function ProdottiPage() {
  const prodotti = useSelector((state: RootState) => state.prodotti);
  const categorie = Array.from(new Set(prodotti.map(p => p.categoria)));

  return (
    <div>
      <h2>Categorie disponibili</h2>
      <ul>
        {categorie.map(cat => (
          <li key={cat}>
            <Link to={`/prodotti/${cat}`}>{cat}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdottiPage;
```



---

## 7. `pages/CategoriaPage.tsx`

```tsx
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function CategoriaPage() {
  const { categoria } = useParams();
  const prodotti = useSelector((state: RootState) =>
    state.prodotti.filter(p => p.categoria === categoria)
  );

  return (
    <div>
      <h2>Prodotti nella categoria: {categoria}</h2>
      <ul>
        {prodotti.map(p => (
          <li key={p.id}>
            <Link to={`/prodotti/${p.categoria}/${p.id}`}>{p.nome}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriaPage;
```



---

## 8. `pages/DettaglioProdottoPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function DettaglioProdottoPage() {
  const { id } = useParams();
  const prodotto = useSelector((state: RootState) =>
    state.prodotti.find(p => p.id === id)
  );

  if (!prodotto) {
    return <p>Prodotto non trovato.</p>;
  }

  return (
    <div>
      <h2>{prodotto.nome}</h2>
      <p>Categoria: {prodotto.categoria}</p>
      <p>Prezzo: €{prodotto.prezzo}</p>
    </div>
  );
}

export default DettaglioProdottoPage;
```



---

## 9. `pages/AggiungiProdottoPage.tsx`

```tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { aggiungiProdotto } from '../store/productsSlice';
import { useNavigate } from 'react-router-dom';

function AggiungiProdottoPage() {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuovoProdotto = {
      id: Date.now().toString(),
      nome,
      categoria,
      prezzo: parseFloat(prezzo),
    };
    dispatch(aggiungiProdotto(nuovoProdotto));
    navigate(`/prodotti/${categoria}`);
  };

  return (
    <div>
      <h2>Aggiungi nuovo prodotto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div>
          <label>Categoria:</label>
          <input value={categoria} onChange={e => setCategoria(e.target.value)} required />
        </div>
        <div>
          <label>Prezzo:</label>
          <input type="number" value={prezzo} onChange={e => setPrezzo(e.target.value)} required />
        </div>
        <button type="submit">Aggiungi</button>
      </form>
    </div>
  );
}

export default AggiungiProdottoPage;
```



---

## 10. `pages/RedirectCatalogo.tsx`

```tsx
import { Navigate } from 'react-router-dom';

function RedirectCatalogo() {
  return <Navigate to="/prodotti" replace />;
}

export default RedirectCatalogo;
```



---

## 11. `pages/NotFoundPage.tsx`

```tsx
function NotFoundPage() {
  return <h2>404 – Pagina non trovata</h2>;
}

export default NotFoundPage;
```



---




































La **validazione delle rotte dinamiche** in React Router è una pratica fondamentale per garantire che l’utente non possa accedere a risorse non esistenti o mal formate (es. ID non presenti, categorie inesistenti, slug non validi). React Router non esegue alcuna validazione automatica sui parametri, quindi spetta allo sviluppatore implementarla **all’interno dei componenti associati alle rotte**.

---

##  1. Concetto

Quando definisci una rotta dinamica come:

```tsx
<Route path="/prodotti/:categoria/:id" element={<DettaglioProdotto />} />
```

React Router considera valido **qualsiasi valore** passato in `:categoria` e `:id`, anche se non corrisponde a dati reali nel tuo sistema. Per questo motivo è necessario **validare i parametri lato client**, ad esempio controllando se esiste un prodotto con quell’ID e categoria nel tuo stato globale.

---

## 2. Accesso ai parametri dinamici

Si effettua tramite:

```tsx
import { useParams } from 'react-router-dom';

const { categoria, id } = useParams();
```

Tutti i valori ottenuti sono **stringhe**, anche se numerici nell’URL.

---

## 3. Strategie di validazione

### a. Validazione contro uno store Redux

Nel componente, dopo aver ottenuto i parametri con `useParams`, puoi cercare nel tuo store se i dati esistono:

```tsx
const prodotto = useSelector((state: RootState) =>
  state.prodotti.find(p => p.id === id && p.categoria === categoria)
);

if (!prodotto) {
  return <p>Prodotto non trovato.</p>;
}
```

### b. Validazione contro un elenco di valori validi

Per esempio, in una rotta `/prodotti/:categoria`, puoi validare la categoria confrontandola con un set di categorie note:

```tsx
const categorieValide = ['elettronica', 'arredamento', 'giardinaggio'];

if (!categorieValide.includes(categoria)) {
  return <p>Categoria inesistente.</p>;
}
```

---

## 4. Validazione con redirect automatico (fallback controllato)

In alternativa alla visualizzazione di un messaggio, puoi **reindirizzare l’utente** a una pagina 404 o a un percorso noto:

```tsx
import { Navigate } from 'react-router-dom';

if (!prodotto) {
  return <Navigate to="/not-found" replace />;
}
```

Oppure direttamente:

```tsx
<Route path="*" element={<NotFoundPage />} />
```

---

## 5. Dove NON fare la validazione

* **Non nel router stesso**: React Router non supporta condizioni all’interno delle definizioni `<Route>`.
* **Non nel path**: non puoi scrivere qualcosa come `path="/prodotti/:categoria(\\d+)"`

---

## 6. Best practice

| Buona pratica                                        | Motivazione                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| Validare sempre gli ID prima di mostrarne i dettagli | Previene accesso a dati inesistenti o incoerenti             |
| Separare logica di validazione dalla presentazione   | Mantiene componenti puliti e testabili                       |
| Evitare reindirizzamenti forzati non necessari       | Mostrare un messaggio è spesso più chiaro per l’utente       |
| Gestire fallback con una rotta `*`                   | Garantisce coerenza anche su errori di battitura o deep link |

---

## 7. Esempio completo di validazione in una rotta dinamica

```tsx
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function DettaglioProdotto() {
  const { categoria, id } = useParams();
  const prodotto = useSelector((state: RootState) =>
    state.prodotti.find(p => p.id === id && p.categoria === categoria)
  );

  if (!prodotto) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div>
      <h2>{prodotto.nome}</h2>
      <p>Categoria: {prodotto.categoria}</p>
      <p>Prezzo: €{prodotto.prezzo}</p>
    </div>
  );
}
```

---






































---

# Obiettivo del custom hook

* Accedere ai parametri dinamici (`categoria`, `id`)
* Validare l’esistenza del dato richiesto
* Restituire:

  * Lo stato di validazione (`trovato` / `non trovato`)
  * I dati richiesti (es. `prodotto`)
  * L’errore, se presente

---

## File consigliato: `hooks/useProdottoValidato.ts`

```tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Articolo } from '../store/productsSlice';

type ValidationResult = {
  prodotto?: Articolo;
  loading: boolean;
  trovato: boolean;
};

export function useProdottoValidato(): ValidationResult {
  const { categoria, id } = useParams();

  const prodotto = useSelector((state: RootState) =>
    state.prodotti.find(
      p => p.categoria === categoria && p.id === id
    )
  );

  return {
    prodotto,
    loading: false, // utile se un giorno si integrano API asincrone
    trovato: Boolean(prodotto),
  };
}
```

---

## Come utilizzarlo nel componente `DettaglioProdottoPage`

```tsx
import { Navigate } from 'react-router-dom';
import { useProdottoValidato } from '../hooks/useProdottoValidato';

export default function DettaglioProdottoPage() {
  const { prodotto, trovato } = useProdottoValidato();

  if (!trovato) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div>
      <h2>{prodotto?.nome}</h2>
      <p>Categoria: {prodotto?.categoria}</p>
      <p>Prezzo: €{prodotto?.prezzo}</p>
    </div>
  );
}
```

---

## Vantaggi di questo approccio

| Vantaggio                | Descrizione                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| Separazione della logica | Il componente non contiene più la logica di validazione               |
| Maggiore riuso           | Il hook può essere utilizzato anche in altri componenti, test, loader |
| Facilità di estensione   | Può essere modificato per supportare `loading`, `error`, `API async`  |
| Leggibilità              | Il componente è chiaro e focalizzato sulla UI                         |

---




































# Modulo 3 – Protezione delle rotte (Autenticazione e Autorizzazione)

## 1. Cos’è una *Private Route*

Una **private route** è una rotta accessibile **solo agli utenti autenticati**. Se un utente non è loggato, viene **bloccato** e reindirizzato automaticamente a una pagina di login o errore.

> È uno dei pattern più importanti per la sicurezza delle applicazioni React moderne, anche in ambito SPA.

---

## 2. Pattern: `<PrivateRoute />`

Un **wrapper component** che verifica una condizione (login, ruolo, permesso) e decide se rendere visibile un determinato contenuto o eseguire un redirect.

### Sintassi base:

```tsx
<Route path="/area-privata" element={
  <PrivateRoute>
    <AreaPrivata />
  </PrivateRoute>
} />
```

---

## 3. Esempio: `PrivateRoute.tsx` con Context

```tsx
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Vantaggi:

* Logica riutilizzabile
* Separazione delle responsabilità
* Adatto anche per gestire *loading* o messaggi personalizzati

---

## 4. Gestione dello stato di autenticazione

### Opzioni comuni:

| Soluzione           | Vantaggi                               |
| ------------------- | -------------------------------------- |
| `useContext`        | Semplice per progetti piccoli          |
| Redux Toolkit       | Ideale per app complesse e persistenti |
| Hook personalizzato | Incapsula logica e validazioni         |

### Esempio AuthContext

```tsx
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
});
```

---

## 5. Redirect automatico

Utilizzare `<Navigate />` consente di:

* Reindirizzare a `/login` se l’utente non è loggato
* Reindirizzare a `/403` se l’utente non ha i permessi

### Esempio:

```tsx
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

---

## 6. Protezione su **rotte annidate**

Puoi utilizzare `<PrivateRoute>` anche come **layout protetto** per un’intera sezione:

```tsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <DashboardLayout />
  </PrivateRoute>
}>
  <Route path="profilo" element={<Profilo />} />
  <Route path="impostazioni" element={<Impostazioni />} />
</Route>
```

In questo caso, **tutte le rotte figlie** sono automaticamente protette.

---

## 7. Composizione avanzata: `RoleBasedRoute`, `AdminRoute`, ecc.

In contesti reali, non basta sapere se un utente è loggato: bisogna anche controllare i **ruoli**.

### `RoleBasedRoute.tsx`

```tsx
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
  allowedRoles: string[];
};

export default function RoleBasedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
```

### Esempio di uso

```tsx
<Route path="/admin" element={
  <RoleBasedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </RoleBasedRoute>
} />
```

---

## Best Practice

| Aspetto                       | Raccomandazione                                    |
| ----------------------------- | -------------------------------------------------- |
| Separazione logica            | Non mischiare validazione e presentazione          |
| Stato globale                 | Gestire login/logout con Redux o Context condiviso |
| Reindirizzamenti chiari       | Usare `<Navigate replace />` per evitare loop      |
| Autorizzazione granularizzata | Usare ruoli, permessi e middleware personalizzati  |
| Proteggere anche i figli      | Applicare il controllo anche a rotte annidate      |

---












































## 1  Struttura del progetto

```
src/
├── App.tsx                   ← definizione delle route
├── index.tsx                 ← <Provider> + <BrowserRouter>
├── store/
│   ├── store.ts
│   ├── authSlice.ts
│   └── productsSlice.ts
├── hooks/
│   └── useFilteredProducts.ts
├── routes/
│   ├── PrivateRoute.tsx
│   └── RoleRoute.tsx
├── components/
│   ├── Navbar.tsx
│   └── ProductCard.tsx
└── pages/
    ├── HomePage.tsx
    ├── LoginPage.tsx
    ├── Dashboard.tsx
    ├── ProductsPage.tsx
    ├── ProductDetailPage.tsx
    ├── AdminPage.tsx
    └── NotFoundPage.tsx
```

---

## 2  Redux Toolkit

### 2.1 `store/authSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = { username: string; role: 'user' | 'admin' };

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = { user: null, isAuthenticated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (_, action: PayloadAction<User>) => ({
      user: action.payload,
      isAuthenticated: true,
    }),
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

### 2.2 `store/productsSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
};

const initialState: Product[] = [
  { id: '1', title: 'Notebook Pro',     category: 'tech',  price: 1500 },
  { id: '2', title: 'Chitarra Classica', category: 'music', price: 300  },
  { id: '3', title: 'Mixer DJ',          category: 'music', price: 600  },
];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.push(action.payload);
    },
  },
});

export const { addProduct } = productsSlice.actions;
export default productsSlice.reducer;
```

### 2.3 `store/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './authSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    products: productsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 3  Hook riutilizzabile – `useFilteredProducts.ts`

```ts
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '../store/store';

export function useFilteredProducts(category: string) {
  const products = useSelector((s: RootState) => s.products);

  return useMemo(
    () => products.filter(p => !category || p.category === category),
    [products, category],
  );
}
```

*`useMemo` evita di rifiltrare a ogni render se `products` e `category` non cambiano.*

---

## 4  Rotte protette

### 4.1 `routes/PrivateRoute.tsx`

```tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = useSelector((s: RootState) => s.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
}
```

### 4.2 `routes/RoleRoute.tsx`

```tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

type Props = {
  allowed: ('user' | 'admin')[];
  children: JSX.Element;
};

export default function RoleRoute({ allowed, children }: Props) {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !allowed.includes(user.role))
    return <Navigate to="/403" replace />;   // pagina 403 non mostrata qui
  return children;
}
```

---

## 5  Componenti ottimizzati

### 5.1 `components/Navbar.tsx` — `React.memo` + `useCallback`

```tsx
import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';

function NavbarInner() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    nav('/');
  }, [dispatch, nav]);

  return (
    <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/products">Prodotti</Link>
      {isAuthenticated && user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export const Navbar = memo(NavbarInner);
```

### 5.2 `components/ProductCard.tsx` — `React.memo`

```tsx
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../store/productsSlice';

type Props = { product: Product };

export const ProductCard = memo(({ product }: Props) => (
  <li>
    <Link to={`/products/${product.category}/${product.id}`}>
      {product.title} – €{product.price}
    </Link>
  </li>
));
```

---

## 6  Pagine principali

### 6.1 `pages/LoginPage.tsx`  *(mock login)*

```tsx
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  const handleLogin = (role: 'user' | 'admin') => {
    dispatch(login({ username: 'demo', role }));
    nav('/dashboard');
  };

  return (
    <>
      <h2>Login</h2>
      <button onClick={() => handleLogin('user')}>Entra come user</button>
      <button onClick={() => handleLogin('admin')}>Entra come admin</button>
    </>
  );
}
```

### 6.2 `pages/Dashboard.tsx`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user);
  return <h2>Benvenuto, {user?.username}</h2>;
}
```

### 6.3 `pages/ProductsPage.tsx`

```tsx
import { useState } from 'react';
import { useFilteredProducts } from '../hooks/useFilteredProducts';
import { ProductCard } from '../components/ProductCard';

export default function ProductsPage() {
  const [category, setCategory] = useState('');
  const products = useFilteredProducts(category);

  return (
    <>
      <h2>Prodotti</h2>
      <label>
        Categoria:&nbsp;
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">tutte</option>
          <option value="tech">tech</option>
          <option value="music">music</option>
        </select>
      </label>

      <ul>{products.map(p => <ProductCard key={p.id} product={p} />)}</ul>
    </>
  );
}
```

### 6.4 `pages/ProductDetailPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useSelector((s: RootState) =>
    s.products.find(p => p.id === id)
  );

  if (!product) return <p>Prodotto non trovato.</p>;

  return (
    <>
      <h2>{product.title}</h2>
      <p>Categoria: {product.category}</p>
      <p>Prezzo: €{product.price}</p>
    </>
  );
}
```

### 6.5 `pages/AdminPage.tsx` (protetta da ruolo)

```tsx
export default function AdminPage() {
  return <h2>Area amministratore</h2>;
}
```

### 6.6 `pages/NotFoundPage.tsx`

```tsx
export default function NotFoundPage() {
  return <h2>404 – Pagina non trovata</h2>;
}
```

---

## 7  Definizione delle route – `App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import { Navbar }           from './components/Navbar';
import HomePage             from './pages/HomePage';
import LoginPage            from './pages/LoginPage';
import Dashboard            from './pages/Dashboard';
import ProductsPage         from './pages/ProductsPage';
import ProductDetailPage    from './pages/ProductDetailPage';
import AdminPage            from './pages/AdminPage';
import NotFoundPage         from './pages/NotFoundPage';
import PrivateRoute         from './routes/PrivateRoute';
import RoleRoute            from './routes/RoleRoute';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* area privata generica */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* area prodotti */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category/:id" element={<ProductDetailPage />} />

        {/* area admin (solo role=admin) */}
        <Route path="/admin" element={
          <RoleRoute allowed={['admin']}>
            <AdminPage />
          </RoleRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
```

---

## 8  `index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

---

## 9  Elementi mostrati in questo esempio

| Concetto                           | Dove è presente                                     |
| ---------------------------------- | --------------------------------------------------- |
| Redux Toolkit per auth e prodotti  | `authSlice`, `productsSlice`, `store.ts`            |
| React Router – rotte dinamiche     | `/products/:category/:id`                           |
| React Router – private route       | `PrivateRoute`                                      |
| React Router – role route          | `RoleRoute`                                         |
| Redirect dopo login/dopo logout    | `useNavigate` nei bottoni login/logout              |
| useCallback stabilizza handler     | `Navbar` → `handleLogout`                           |
| useMemo evita ricalcoli            | `useFilteredProducts`                               |
| React.memo evita re-render inutili | `Navbar`, `ProductCard`                             |
| Fallback 404                       | Route `*` → `NotFoundPage`                          |
| Nested (layout privato)            | Dashboard sotto `PrivateRoute` (eredita protezione) |

---











































# Esercizio: Portale corsi con gestione autenticazione e ruoli

## Obiettivo

Realizzare un'applicazione React che consenta:

1. Autenticazione fittizia con due ruoli: `studente` e `admin`
2. Visualizzazione pubblica di un catalogo corsi (`/corsi`)
3. Accesso al dettaglio di ciascun corso tramite rotta dinamica (`/corsi/:id`)
4. Accesso protetto all'area personale (`/area-personale`) solo per utenti autenticati
5. Accesso esclusivo all'area amministrativa (`/admin`) solo per utenti con ruolo `admin`
6. Navigazione globale ottimizzata con `React.memo` e `useCallback`
7. Ottimizzazione delle liste di corsi tramite `useMemo`

---

## Specifiche tecniche

### Rotte richieste

| Percorso          | Protezione       | Componente         |
| ----------------- | ---------------- | ------------------ |
| `/`               | Pubblica         | Homepage           |
| `/login`          | Pubblica         | Pagina di login    |
| `/corsi`          | Pubblica         | Lista corsi        |
| `/corsi/:id`      | Pubblica         | Dettaglio corso    |
| `/area-personale` | Autenticazione   | Area riservata     |
| `/admin`          | Solo per `admin` | Gestione corsi     |
| `*`               | Fallback 404     | Pagina non trovata |

---

## Stato gestito con Redux Toolkit

### Slice: `authSlice`

* Stato: `isAuthenticated`, `user: { username, role }`
* Azioni: `login`, `logout`

### Slice: `coursesSlice`

* Stato: `array` di corsi `{ id, titolo, categoria, docente }`
* Azione: `addCourse` (solo da `admin`)

---

## Comportamento richiesto

* Il **login** permette di scegliere tra ruolo `studente` o `admin`
* La **navbar** mostra voci diverse in base all'autenticazione/ruolo
* Le rotte `area-personale` e `admin` sono **protette**
* Se l'utente non è autorizzato, viene reindirizzato a `/login` o `/403`
* I componenti `Navbar` e `CourseCard` devono essere **memoizzati**
* Le funzioni `handleLogout`, `handleAddCourse` devono essere **stabilizzate** con `useCallback`
* Il filtraggio dei corsi per categoria deve essere fatto con **`useMemo`**

---

## Componenti richiesti

* `Navbar.tsx`
* `CourseCard.tsx` (memoizzato)
* `PrivateRoute.tsx` (protetta da autenticazione)
* `RoleRoute.tsx` (protetta da ruolo)
* `useFilteredCourses.ts` (custom hook con useMemo)
* Pagine principali in `pages/`: `HomePage`, `LoginPage`, `CoursesPage`, `CourseDetailPage`, `AdminPage`, `UserAreaPage`, `NotFoundPage`

---

## Suggerimenti e vincoli

* L'autenticazione può essere **mockata** (nessuna API)
* I dati dei corsi possono essere statici nel slice
* Usare `Navigate` per i redirect protetti
* I campi obbligatori in `addCourse` sono `titolo`, `categoria`, `docente`
* La lista corsi in `AdminPage` deve essere filtrabile per categoria

---

## Conoscenze che verranno valutate

| Aspetto                                  | Verifica                                        |
| ---------------------------------------- | ----------------------------------------------- |
| Gestione stato globale con Redux Toolkit | Autenticazione e gestione corsi                 |
| Routing dinamico                         | `/corsi/:id`                                    |
| Rotte protette e per ruoli               | `/area-personale`, `/admin`                     |
| `React.memo`                             | `Navbar`, `CourseCard`                          |
| `useCallback`                            | Eventi stabilizzati (es. logout, addCourse)     |
| `useMemo`                                | Filtraggio corsi in modo performante            |
| Architettura modulare                    | Struttura separata per slice, hook, route, page |

---







































---

## 1 Store Redux Toolkit

### 1.1 `store/authSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'studente' | 'admin';
export type User = { username: string; role: Role };

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

const initialState: AuthState = { isAuthenticated: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** finto login: salva utente e ruolo scelto */
    login: (_, action: PayloadAction<User>) => ({
      isAuthenticated: true,
      user: action.payload,
    }),
    /** logout: torniamo allo stato iniziale */
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

### 1.2 `store/coursesSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Course = {
  id: string;
  titolo: string;
  categoria: string;
  docente: string;
};

const initialState: Course[] = [
  { id: '1', titolo: 'React Base', categoria: 'frontend', docente: 'Mario' },
  { id: '2', titolo: 'Redux Toolkit', categoria: 'frontend', docente: 'Anna' },
  { id: '3', titolo: 'Spring Boot', categoria: 'backend', docente: 'Luigi' },
];

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    /** solo admin: aggiunge un nuovo corso */
    addCourse: (state, { payload }: PayloadAction<Course>) => {
      state.push(payload);
    },
  },
});
export const { addCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
```

---

### 1.3 `store/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './authSlice';
import coursesReducer from './coursesSlice';

export const store = configureStore({
  reducer: { auth: authReducer, courses: coursesReducer },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 2 Hook riutilizzabile con `useMemo`

`hooks/useFilteredCourses.ts`

```ts
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '../store/store';

export function useFilteredCourses(categoria: string) {
  const courses = useSelector((s: RootState) => s.courses);

  /* useMemo evita di rifiltrare se courses o categoria non cambiano */
  return useMemo(
    () => courses.filter(c => !categoria || c.categoria === categoria),
    [courses, categoria],
  );
}
```

---

## 3 Rotte protette

### 3.1 `routes/PrivateRoute.tsx`

```tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

/** permette l'accesso solo se autenticato */
export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const auth = useSelector((s: RootState) => s.auth.isAuthenticated);
  return auth ? children : <Navigate to="/login" replace />;
}
```

### 3.2 `routes/RoleRoute.tsx`

```tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { Role } from '../store/authSlice';

export default function RoleRoute({
  allowed,
  children,
}: {
  allowed: Role[];
  children: JSX.Element;
}) {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !allowed.includes(user.role)) return <Navigate to="/403" replace />;

  return children;
}
```

---

## 4 Componenti ottimizzati

### 4.1 `components/Navbar.tsx`

```tsx
import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState, AppDispatch } from '../store/store';

/* React.memo evita il re-render se le props non cambiano */
export const Navbar = memo(() => {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  /* useCallback stabilizza la funzione tra render */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/corsi">Corsi</Link>
      {isAuthenticated && <Link to="/area-personale">Area personale</Link>}
      {isAuthenticated && user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
});
```

### 4.2 `components/CourseCard.tsx`

```tsx
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../store/coursesSlice';

export const CourseCard = memo(({ c }: { c: Course }) => (
  <li>
    <Link to={`/corsi/${c.id}`}>{c.titolo} – {c.docente}</Link>
  </li>
));
```

---

## 5 Pagine

Solo le parti salienti sono mostrate; lo scheletro HTML è minimale per chiarezza.

### 5.1 `pages/LoginPage.tsx`

```tsx
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  const onLogin = (role: 'studente' | 'admin') => {
    dispatch(login({ username: 'demo', role }));
    nav('/area-personale');
  };

  return (
    <>
      <h2>Login</h2>
      <button onClick={() => onLogin('studente')}>Studente</button>
      <button onClick={() => onLogin('admin')}>Admin</button>
    </>
  );
}
```

### 5.2 `pages/CoursesPage.tsx`

```tsx
import { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { useFilteredCourses } from '../hooks/useFilteredCourses';

export default function CoursesPage() {
  const [cat, setCat] = useState('');
  const courses = useFilteredCourses(cat);

  return (
    <>
      <h2>Corsi</h2>
      <label>
        Categoria:{' '}
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">tutte</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
        </select>
      </label>

      <ul>{courses.map(c => <CourseCard key={c.id} c={c} />)}</ul>
    </>
  );
}
```

### 5.3 `pages/CourseDetailPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = useSelector((s: RootState) => s.courses.find(c => c.id === id));

  return !course ? (
    <p>Corso non trovato.</p>
  ) : (
    <>
      <h2>{course.titolo}</h2>
      <p>Categoria: {course.categoria}</p>
      <p>Docente: {course.docente}</p>
    </>
  );
}
```

### 5.4 `pages/AdminPage.tsx` (aggiunta corsi)

```tsx
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addCourse } from '../store/coursesSlice';
import { AppDispatch } from '../store/store';

export default function AdminPage() {
  const [titolo, setTitolo] = useState('');
  const [cat, setCat] = useState('');
  const [doc, setDoc] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  /* useCallback per evitare nuova reference a ogni digitazione */
  const onAdd = useCallback(() => {
    dispatch(addCourse({
      id: Date.now().toString(),
      titolo, categoria: cat, docente: doc,
    }));
    setTitolo(''); setCat(''); setDoc('');
  }, [titolo, cat, doc, dispatch]);

  return (
    <>
      <h2>Admin – Aggiungi corso</h2>
      <input placeholder="Titolo" value={titolo} onChange={e => setTitolo(e.target.value)} />
      <input placeholder="Categoria" value={cat} onChange={e => setCat(e.target.value)} />
      <input placeholder="Docente" value={doc} onChange={e => setDoc(e.target.value)} />
      <button onClick={onAdd}>Aggiungi</button>
    </>
  );
}
```

### 5.5 `pages/UserAreaPage.tsx`

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function UserAreaPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  return <h2>Area personale di {user?.username}</h2>;
}
```

---

## 6 Configurazione Router – `App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import { Navbar }              from './components/Navbar';
import HomePage                from './pages/HomePage';
import LoginPage               from './pages/LoginPage';
import CoursesPage             from './pages/CoursesPage';
import CourseDetailPage        from './pages/CourseDetailPage';
import UserAreaPage            from './pages/UserAreaPage';
import AdminPage               from './pages/AdminPage';
import NotFoundPage            from './pages/NotFoundPage';
import PrivateRoute            from './routes/PrivateRoute';
import RoleRoute               from './routes/RoleRoute';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/corsi" element={<CoursesPage />} />
        <Route path="/corsi/:id" element={<CourseDetailPage />} />

        <Route
          path="/area-personale"
          element={
            <PrivateRoute>
              <UserAreaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowed={['admin']}>
              <AdminPage />
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
```

---

## 7 Entrypoint – `index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
```

---

