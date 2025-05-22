---

#  Modulo 1 – Introduzione alle chiamate API in React

## 1. Cos’è un’API e cosa significa “consumare un’API esterna”

**API** è l'acronimo di *Application Programming Interface*: un insieme di regole che permette a due sistemi software di comunicare tra loro.

In React, “consumare un’API esterna” significa:

* Inviare una **richiesta** (HTTP) a un server (di solito tramite `fetch` o `axios`)
* Attendere la **risposta** (generalmente in formato JSON)
* Utilizzare i **dati ricevuti** per aggiornare lo stato e il contenuto visualizzato nel componente

 Esempi di API esterne:

* [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)
* [https://api.github.com](https://api.github.com)
* Qualsiasi backend realizzato in Django, Laravel, Node, Spring ecc.

---

## 2. Differenza tra client e server

| Ruolo      | Azione principale                               |
| ---------- | ----------------------------------------------- |
| **Client** | Richiede dati o invia input (browser, React)    |
| **Server** | Riceve la richiesta, elabora e restituisce dati |

In un’app React, ogni volta che chiami un’API, stai agendo da **client**. React non “contiene” i dati, ma li recupera da server esterni.

---

## 3. Dove scrivere la logica di chiamata

### Opzione 1 – All’interno del componente (con `useEffect`)

 Utile per chiamate semplici, veloci, una tantum
 Non riutilizzabile, poco testabile

### Opzione 2 – In un modulo esterno (es. `api/courses.ts`)

 Buona separazione tra logica e presentazione
 Permette riutilizzo e testing
 Migliora la scalabilità del progetto

***Best practice***: separare la logica (chiamata, parsing, gestione errori) dai componenti visuali.

---

## 4. Cos’è una chiamata asincrona

Una **funzione asincrona** non restituisce immediatamente il risultato, ma lo promette in futuro (*Promise*).

```ts
const promise = fetch('https://...');

// possiamo usare .then
promise.then(response => response.json())

// oppure async/await
const response = await fetch('https://...');
const data = await response.json();
```

> In React, l’uso di `async/await` dentro a `useEffect` è il modo più leggibile e moderno per gestire chiamate asincrone.

---

## 5. Il ciclo completo di una chiamata API

```
1. Inizia il componente → React fa il render
2. Parte la chiamata API (useEffect)
3. Lo stato è: isLoading = true
4. Quando arriva la risposta:
   - se OK → aggiorna lo stato con i dati ricevuti
   - se errore → aggiorna lo stato con un messaggio di errore
5. React fa il re-render in base allo stato (dati, errore, loading)
```

---

## 6. Esempio: `fetch()` in un componente React

### Obiettivo: ottenere e mostrare una lista di utenti

```tsx
import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // definisco la funzione asincrona
    const fetchUsers = async () => {
      try {
        setLoading(true); // attiva loader
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error('Errore di rete');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Impossibile caricare i dati');
      } finally {
        setLoading(false); // disattiva loader
      }
    };

    fetchUsers(); // chiamata reale
  }, []); // solo al primo render

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

---

## 7. Alternative a `useEffect` per il fetch

| Alternativa                         | Quando si usa                                      |
| ----------------------------------- | -------------------------------------------------- |
| `useQuery` (React Query / TanStack) | Quando vuoi caching, refetch, retry, polling       |
| `createAsyncThunk` con Redux        | Se devi condividere dati tra più componenti        |
| `SWR`, `Axios hook`, `GraphQL hook` | Se stai usando librerie avanzate o backend GraphQL |

Per ora, `useEffect` con `async/await` resta la modalità di base più semplice da apprendere.

---






















---

##  Perché si usa `useEffect`

React è pensato per essere **dichiarativo**: i componenti descrivono *cosa* mostrare, ma **non cosa succede nel tempo**. Tuttavia, nella maggior parte delle applicazioni reali ci sono effetti esterni che devono essere gestiti manualmente, come:

* Chiamate API (fetch di dati remoti)
* Accesso al `localStorage`
* Subscriptions o WebSocket
* Eventi del DOM (es. scroll, resize)
* Timer (`setTimeout`, `setInterval`)
* Modifiche manuali al DOM (solo in casi eccezionali)

Tutte queste operazioni **non fanno parte del normale ciclo di rendering** di React. Per questo motivo, React mette a disposizione `useEffect` come **meccanismo controllato per gestire codice che ha effetti esterni sul sistema**.

---

##  Cosa succede internamente a livello di logica

### 1. Render fase

Quando un componente React viene **renderizzato**, React:

* Esegue il corpo della funzione componente
* Valuta lo **JSX da mostrare**
* **Registra gli hook** (`useState`, `useEffect`, ecc.)
* Costruisce una rappresentazione interna del DOM virtuale

> In questa fase, React **non esegue ancora l’effetto definito in `useEffect`**

---

### 2. Commit phase

Dopo il render e l’aggiornamento del DOM virtuale, React entra nella **fase di commit**, dove:

* Applica le modifiche reali al DOM (se ce ne sono)
* **Esegue il codice dentro `useEffect`**

Questo significa che:

* `useEffect` **viene sempre eseguito dopo il render**
* Serve per effettuare **operazioni che devono avvenire dopo che il DOM è stato aggiornato**
* Può opzionalmente **pulire** effetti precedenti

---

### 3. Dependency array (dipendenze)

La logica interna di `useEffect` cambia in base al secondo argomento (dependency array):

| Dichiarazione                     | Significato                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `useEffect(() => {...})`          | Eseguito **dopo ogni render**                                |
| `useEffect(() => {...}, [])`      | Eseguito **una volta sola**, al montaggio                    |
| `useEffect(() => {...}, [count])` | Eseguito al primo render **e ogni volta che `count` cambia** |

Internamente, React memorizza l’array di dipendenze per ogni effetto e al render successivo lo confronta con il precedente. Se almeno una dipendenza è diversa (shallow comparison), l’effetto viene **rieseguito**.

---

### 4. Cleanup interno (return di `useEffect`)

Se `useEffect` ritorna una funzione, React la chiama **prima di smontare il componente** o **prima di rieseguire l’effetto**. Questo è utile per:

* Annullare fetch (`AbortController`)
* Disiscrivere eventi
* Fermare timer

```tsx
useEffect(() => {
  const id = setInterval(() => { ... }, 1000);

  return () => clearInterval(id); // cleanup
}, []);
```

---

## Riassunto: cosa succede in ordine

1. React esegue la funzione componente
2. Registra l’hook `useEffect`
3. Esegue il rendering e aggiorna il DOM virtuale
4. Dopo il commit:

   * Esegue la funzione di `useEffect`
5. Se il componente viene smontato o il valore di dipendenza cambia:

   * Esegue il cleanup dell’effetto precedente (se presente)
   * Esegue l’effetto aggiornato

---

## 🛠 Esempio interno semplificato

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effetto: titolo aggiornato');
    document.title = `Hai cliccato ${count} volte`;

    return () => {
      console.log('Cleanup: effetto precedente distrutto');
    };
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Clicca</button>;
}
```

* Al primo render: effetto eseguito → aggiorna `document.title`
* Dopo ogni clic: React ricalcola il componente, rileva che `count` è cambiato, esegue il **cleanup** e poi il nuovo effetto

---

## In sintesi

| `useEffect` serve per...                      | ...perché React di default non esegue side effects      |
| --------------------------------------------- | ------------------------------------------------------- |
| Chiamare API, settare timer, ascoltare eventi | ...dopo che il DOM è stato aggiornato                   |
| Sincronizzarsi con librerie esterne o browser | ...ma **solo quando serve**, controllando le dipendenze |
| Liberare risorse (cleanup)                    | ...prima che il componente venga smontato o aggiornato  |

































---

##  Cos’è `fetch()`

`fetch()` è l’API nativa del browser per eseguire richieste HTTP (senza librerie esterne). È **promisified**, cioè restituisce una `Promise` che risolve con la **risposta (Response object)** del server.

---

## 1. Sintassi base – Richiesta `GET`

```ts
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error('Errore:', error));
```

### Passaggi:

1. `fetch()` effettua la richiesta
2. `.then(res => res.json())` legge il corpo della risposta come JSON
3. `.then(data => ...)` riceve i dati estratti
4. `.catch()` gestisce eventuali errori di rete o parsing

---

## 2. Sintassi equivalente con `async/await`

```ts
async function getPosts() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error('Errore di rete');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Errore:', err);
  }
}
```

 Più leggibile
 Gestione errori con `try/catch`
 Facilita il controllo dei flussi asincroni

---

## 3. Richiesta `POST` con `body` e `headers`

Per inviare dati (es. form, nuovo record), si usa `POST` e si invia il contenuto nel `body`, spesso in formato JSON.

### Esempio:

```ts
const nuovoPost = {
  title: 'Titolo',
  body: 'Contenuto del post',
  userId: 1
};

fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nuovoPost)
})
  .then(res => res.json())
  .then(data => console.log('Risposta:', data))
  .catch(err => console.error('Errore:', err));
```

---

##  Spiegazione parametri `fetch`

```ts
fetch(url, {
  method: 'POST',               // Metodo HTTP (GET, POST, PUT, DELETE, ecc.)
  headers: {
    'Content-Type': 'application/json', // Header per indicare il tipo di dati inviati
    'Authorization': 'Bearer ...'       // Altri header opzionali (token, ecc.)
  },
  body: JSON.stringify(data),   // Dati inviati (solo per POST, PUT, PATCH)
});
```

>  Se `body` è un oggetto, **va sempre convertito in JSON** con `JSON.stringify()`
>  Le intestazioni (`headers`) vanno sempre specificate in caso di invio JSON

---

## 4. Altri metodi HTTP supportati

| Metodo   | Scopo principale                          |
| -------- | ----------------------------------------- |
| `GET`    | Ottenere dati                             |
| `POST`   | Inviare un nuovo dato                     |
| `PUT`    | Sovrascrivere un dato esistente           |
| `PATCH`  | Aggiornare parzialmente un dato esistente |
| `DELETE` | Eliminare un dato                         |

---

## Conclusione

| Azione            | Cosa usare                                      |
| ----------------- | ----------------------------------------------- |
| Ottenere dati     | `fetch(url)`                                    |
| Inviare dati JSON | `fetch(url, { method: 'POST', body, headers })` |
| Parsing risposta  | `.then(res => res.json())` o `await res.json()` |
| Gestione errori   | `.catch()` o `try/catch`                        |



















---

##  Introduzione ad Axios

**Axios** è una libreria HTTP basata su Promises, utilizzata per effettuare richieste asincrone verso API REST.
È più potente e flessibile rispetto all'API nativa `fetch()`, ed è uno standard de facto in molte applicazioni React e Node.js.

Si installa con:

```bash
npm install axios
```

---

## Perché usare Axios al posto di `fetch`

| Caratteristica                      | `fetch`                  | `axios`                                 |
| ----------------------------------- | ------------------------ | --------------------------------------- |
| Supporto automatico al formato JSON | manuale con `res.json()` | automatico: `res.data`                  |
| Gestione degli errori               | solo errori di rete      | anche errori di risposta (`res.status`) |
| Timeout                             | non supportato           | supportato nativamente                  |
| Interceptor globali                 | assente                  | sì, per logging, autenticazione, ecc.   |
| Supporto automatico a `baseURL`     | manuale                  | sì, centralizzato                       |
| Richieste abortabili                | con `AbortController`    | supportato con `CancelToken` (v0.27)    |

---

## Vantaggi principali

### 1. Gestione automatica del JSON

Con `fetch`, sei obbligato a chiamare manualmente `.json()` sulla risposta:

```ts
const res = await fetch(url);
const data = await res.json();
```

Con Axios, la risposta è **già parsata automaticamente** in `res.data`:

```ts
const res = await axios.get(url);
console.log(res.data);
```

---

### 2. Gestione centralizzata di baseURL

Axios consente di definire un **client HTTP personalizzato** con configurazioni comuni:

```ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.miosito.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Poi potrai usare:

```ts
apiClient.get('/corsi'); // esegue GET su https://api.miosito.com/corsi
```

Questo approccio:

* Riduce la duplicazione di codice
* Centralizza la gestione degli header comuni (es. autorizzazione)
* Rende il codice più leggibile

---

### 3. Interceptor

Gli **interceptor** permettono di eseguire codice **prima o dopo ogni richiesta o risposta**, utile per:

* Iniettare token di autenticazione
* Visualizzare loader globali
* Loggare errori
* Gestire redirect automatici

#### Esempio:

```ts
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // logout automatico o redirect
    }
    return Promise.reject(error);
  }
);
```

---

## Esempio pratico con Axios in React

```tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListaUtenti() {
  const [utenti, setUtenti] = useState([]);
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUtenti(res.data))
      .catch(() => setErrore('Errore nel caricamento'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (errore) return <p>{errore}</p>;

  return (
    <ul>
      {utenti.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

---



































#  Modulo 3 – Gestione di loading, errori e fallback UI con Axios



## 1. Pattern `isLoading`, `error`, `data`

Quando si effettua una richiesta asincrona all'interno di un componente React, si devono **gestire esplicitamente gli stati dell’operazione**. Lo standard è il seguente:

| Stato       | Significato                                         |
| ----------- | --------------------------------------------------- |
| `isLoading` | La richiesta è in corso                             |
| `error`     | Si è verificato un errore nella richiesta           |
| `data`      | I dati sono stati ricevuti correttamente dal server |

---

## 2. Stato gestito con `useState`

Per implementare questo pattern in React, dichiariamo tre variabili di stato:

```tsx
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');
const [data, setData] = useState<Oggetto[] | null>(null);
```

Queste verranno aggiornate in base al ciclo di vita della chiamata asincrona.

---

## 3. Esempio completo con `axios` + `useEffect`

```tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type Post = {
  id: number;
  title: string;
};

export default function ListaPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);    // Avvio caricamento
        setError('');          // Reset eventuale errore precedente

        const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(res.data);    // Dati ricevuti correttamente
      } catch (err) {
        setError('Errore nel caricamento');  // Errore di rete o risposta non OK
      } finally {
        setIsLoading(false);   // Fine caricamento (successo o errore)
      }
    };

    fetchData();
  }, []);
```

---

## 4. Visualizzazione condizionale in base allo stato

React mostrerà una UI diversa in base allo stato corrente:

```tsx
  if (isLoading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;
  if (!posts) return <p>Nessun dato disponibile.</p>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## 5. Uso di `try/catch` per catturare errori

Axios lancia un’eccezione (`Error`) quando:

* La rete è assente
* Il server risponde con stato ≥ 400
* La risposta è malformata (es. non JSON)

Per questo è fondamentale racchiudere la chiamata in un `try/catch` e, in caso di errore, aggiornare lo stato `error`.

---

## 6. Dettagli importanti da tenere presenti

* L’`error` può essere una stringa generica oppure un oggetto `AxiosError`.
  È possibile accedere a `error.response`, `error.message`, ecc.
* Il `finally` viene sempre eseguito, indipendentemente dal successo o dal fallimento della chiamata, ed è perfetto per disattivare il loader.
* Se si vogliono gestire errori più sofisticati, si possono estrarre status code o messaggi personalizzati dalla risposta di Axios.

---

## 7. Variante con `axios.create()`

Puoi usare un client Axios centralizzato:

```ts
// apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: { 'Content-Type': 'application/json' }
});
```

E poi nel componente:

```tsx
const res = await apiClient.get('/posts');
```

---





























---

## Obiettivo dell’esempio

Creare un componente React che:

* Effettua una **chiamata GET** a un’API pubblica (`jsonplaceholder`)
* Gestisce **caricamento**, **errore** e **dati**
* Mostra una **lista di post**
* Utilizza `axios` con `useEffect` e `useState`

---

## Struttura

```
src/
├── api/
│   └── apiClient.ts         # configurazione axios
├── components/
│   └── PostList.tsx         # componente principale
├── App.tsx                  # app principale
└── main.tsx                 # entrypoint (Vite o CRA)
```

---

## 1. `api/apiClient.ts`

```ts
import axios from 'axios';

/**
 * Axios client configurato con baseURL e header comuni.
 */
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});
```

---

## 2. `components/PostList.tsx`

```tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostList(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);     // attiva loader
        setError('');           // resetta errori precedenti

        const response = await apiClient.get<Post[]>('/posts');
        setPosts(response.data); // salva dati
      } catch (err) {
        setError('Errore nel caricamento dei post');
      } finally {
        setIsLoading(false);    // disattiva loader
      }
    };

    fetchPosts();
  }, []);

  // Fallback UI
  if (isLoading) return <p>Caricamento in corso...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (posts.length === 0) return <p>Nessun post trovato.</p>;

  // Render dati
  return (
    <div>
      <h2>Elenco Post</h2>
      <ul style={{ paddingLeft: '1rem' }}>
        {posts.slice(0, 10).map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. `App.tsx`

```tsx
import PostList from './components/PostList';

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Gestione asincrona con Axios</h1>
      <PostList />
    </div>
  );
}
```

---

## 4. `main.tsx` (con Vite)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Risultato atteso

Al caricamento della pagina:

* Viene mostrato un messaggio **"Caricamento in corso..."**
* Dopo qualche secondo, i post vengono visualizzati (max 10 per esempio)
* In caso di errore (es. URL errato, offline), viene mostrato un messaggio di errore
























ESEMPIO

---

##  Hook: `useApi.ts` (con validazione e commenti dettagliati)

```ts
import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, Method, AxiosError } from 'axios';
import { apiClient } from '../api/apiClient';

/**
 * Interfaccia per configurare la chiamata API.
 */
type Options = {
  url: string;                                  // Endpoint dell’API da chiamare
  method?: Method;                              // Metodo HTTP (GET, POST, ecc.)
  payload?: unknown;                            // Corpo della richiesta (per POST/PUT)
  params?: Record<string, any>;                 // Parametri query string (es. ?page=2)
  headers?: Record<string, string>;             // Header HTTP aggiuntivi
  immediate?: boolean;                          // Se eseguire la chiamata al mount
};

/**
 * Hook generico per effettuare chiamate API con axios.
 * Supporta stato, errori e ri-esecuzione.
 */
export function useApi<T = unknown>(options: Options) {
  const {
    url,
    method = 'GET',     // Default: GET
    payload,
    params,
    headers,
    immediate = true,
  } = options;

  // Stato dei dati ricevuti (generico, tipizzato)
  const [data, setData] = useState<T | null>(null);

  // Stato del caricamento
  const [isLoading, setIsLoading] = useState<boolean>(immediate);

  // Stato dell’errore (stringa leggibile)
  const [error, setError] = useState<string>('');

  // Stato dettagliato per codice HTTP o messaggi da backend
  const [status, setStatus] = useState<number | null>(null);

  /**
   * Funzione di fetch (o invio) che esegue la richiesta.
   * È memorizzata con useCallback per evitare ricreazioni a ogni render.
   */
  const execute = useCallback(async () => {
    setIsLoading(true);   // Attiva il loader
    setError('');         // Reset errore testuale
    setStatus(null);      // Reset codice HTTP

    // Configurazione standard per axios
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      headers,
      data: payload,
    };

    try {
      const response = await apiClient.request<T>(config); // Chiamata principale
      setData(response.data);                              // Salva i dati ricevuti
    } catch (err) {
      // Controllo se l’errore è un AxiosError tipizzato
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setStatus(axiosError.response?.status || null); // Salva codice HTTP
        setError(
          axiosError.response?.data?.message ||       // Messaggio personalizzato backend
          axiosError.message ||                       // Messaggio generico axios
          'Errore sconosciuto nella chiamata API'
        );
      } else {
        setError('Errore imprevisto');
      }
    } finally {
      setIsLoading(false); // In ogni caso, termina il caricamento
    }
  }, [url, method, payload, params, headers]);

  /**
   * useEffect opzionale: esegue la fetch al mount, se richiesto
   */
  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  // Ritorno dell’hook con API accessibili
  return {
    data,
    isLoading,
    error,     // Stringa leggibile
    status,    // Codice HTTP numerico
    refetch: execute,
  };
}
```

---

## Esempio d’uso nel componente

```tsx
import { useApi } from '../hooks/useApi';

type User = { id: number; name: string };

export default function ListaUtenti() {
  const { data, isLoading, error, status, refetch } = useApi<User[]>({
    url: '/users',
    method: 'GET',
  });

  if (isLoading) return <p>Caricamento...</p>;
  if (error) return (
    <p style={{ color: 'red' }}>
      {status && <strong>Errore {status}: </strong>}
      {error}
    </p>
  );

  return (
    <div>
      <h2>Utenti</h2>
      <button onClick={refetch}>Ricarica</button>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Benefici dell’approccio

| Aspetto gestito                           | Dove                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| Separazione tra logica e presentazione    | Logica in `useApi`, UI nel componente                |
| Fallback errori dettagliati               | `status`, `error.message`, `response.data.message`   |
| Riutilizzabilità                          | Qualsiasi URL e metodo, anche in POST o PUT          |
| Stato coerente con React (`isLoading`)    | Imposta loading in `true/false` attorno al fetch     |
| Comportamento controllabile (`immediate`) | Si può attivare la fetch subito o solo con `refetch` |

---



































---

# Redux Toolkit per la gestione asincrona: teoria e funzionamento

## 1. Il problema: perché Redux ha bisogno di una gestione asincrona

Redux è nato per gestire **stato sincrono e predicibile**. Tuttavia, nella maggior parte delle applicazioni reali, i dati vengono recuperati tramite **chiamate API asincrone**, che introducono una complessità aggiuntiva:

* Le chiamate sono **non deterministiche** (possono fallire, richiedere tempo o restituire risultati diversi)
* La sequenza temporale di eventi **non è garantita**
* Il risultato di una fetch **non è immediatamente disponibile**

Redux, in sé, **non può gestire operazioni asincrone** senza middleware. La gestione asincrona richiede quindi una soluzione strutturata che consenta di:

* Avviare una richiesta
* Tracciare lo stato di avanzamento (`loading`)
* Salvare il risultato (`data`)
* Gestire eventuali errori (`error`)

---

## 2. La soluzione: Redux Toolkit + `createAsyncThunk`

Redux Toolkit (RTK) fornisce un approccio integrato e standardizzato per gestire flussi asincroni attraverso il metodo `createAsyncThunk`.

### Cos’è `createAsyncThunk`?

È una funzione helper che consente di creare **azioni asincrone** che integrano automaticamente:

* Avvio della richiesta (`pending`)
* Risultato positivo (`fulfilled`)
* Fallimento (`rejected`)

Tutti questi stati vengono automaticamente gestiti da Redux Toolkit e mappati nel reducer tramite `extraReducers`.

---

## 3. Come funziona `createAsyncThunk` a livello logico

### Internamente, accade questo:

1. `createAsyncThunk` crea un’**azione con Promise incorporata**.
2. Quando l’azione viene **dispatchata**:

   * Redux Toolkit **genera automaticamente** un'azione `pending`.
   * La funzione asincrona viene eseguita (es. `fetch`, `axios`, ecc.).
3. Al termine della chiamata:

   * Se **risolta**, RTK invia un'azione `fulfilled` con i dati.
   * Se **rigettata**, RTK invia un'azione `rejected` con l'errore.

L'applicazione può intercettare questi tre momenti usando `extraReducers` all’interno di `createSlice`.

---

## 4. Come si struttura un flusso completo con Redux Toolkit asincrono

### a. Definizione dell'azione asincrona

```ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUtenti = createAsyncThunk('utenti/fetchUtenti', async () => {
  const response = await axios.get('/api/utenti');
  return response.data;
});
```

Questa azione ha tre **tipi** generati automaticamente:

* `'utenti/fetchUtenti/pending'`
* `'utenti/fetchUtenti/fulfilled'`
* `'utenti/fetchUtenti/rejected'`

---

### b. Definizione dello stato iniziale

```ts
interface StatoUtenti {
  data: Utente[];
  loading: boolean;
  error: string | null;
}

const initialState: StatoUtenti = {
  data: [],
  loading: false,
  error: null,
};
```

---

### c. Gestione degli stati nel reducer tramite `extraReducers`

```ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchUtenti } from './actions';

const utentiSlice = createSlice({
  name: 'utenti',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUtenti.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUtenti.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUtenti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore nella chiamata';
      });
  },
});
```

---

### d. Uso nel componente

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUtenti } from '../store/utenti/actions';

export default function ListaUtenti() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.utenti);

  useEffect(() => {
    dispatch(fetchUtenti());
  }, [dispatch]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {data.map(utente => (
        <li key={utente.id}>{utente.nome}</li>
      ))}
    </ul>
  );
}
```

---

## 5. Struttura di flusso concettuale

```
[Utente clicca] → dispatch(fetchUtenti)
   ↳ Stato: loading = true
   ↳ Attendi risposta
      ↳ Se OK → fulfilled → dati salvati
      ↳ Se errore → rejected → error salvato
```

---

## 6. Best practice

* **Non gestire fetch in `useEffect` se i dati devono essere globali**: sposta la logica in slice + thunk.
* **Centralizza le chiamate API** in moduli o servizi separati.
* **Tipizza bene** lo `state`, il `payload` e gli errori.
* Usa i tre stati (`loading`, `data`, `error`) **in ogni slice asincrona**.
* Se la logica cresce, **crea un middleware personalizzato** o usa `RTK Query`.

---


































---

# Approfondimento: `createAsyncThunk` e `extraReducers` per metodi REST

---

## 1. `createAsyncThunk`: comportamento e firma

La funzione `createAsyncThunk` accetta due argomenti:

```ts
createAsyncThunk<Type, Arg, ThunkApiConfig>(typePrefix, payloadCreator)
```

### Argomenti principali:

* **`typePrefix`**: stringa che identifica il tipo di azione (`nomeSlice/azione`)
* **`payloadCreator`**: funzione asincrona che esegue la richiesta API e restituisce i dati

Redux Toolkit genera automaticamente tre **tipi di azione**:

| Azione generata      | Quando viene inviata          |
| -------------------- | ----------------------------- |
| `[prefix]/pending`   | Subito prima dell’inizio      |
| `[prefix]/fulfilled` | Al completamento con successo |
| `[prefix]/rejected`  | In caso di errore             |

---

## 2. Stato standard per operazioni asincrone

Per ogni operazione asincrona è buona norma gestire tre campi nello stato:

```ts
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

Ogni azione (`GET`, `POST`, ecc.) può usare una copia di questo schema.

---

## 3. Gestione con `extraReducers`

Ogni `createAsyncThunk` viene “collegato” al reducer tramite `builder.addCase` in `extraReducers`, intercettando gli stati `pending`, `fulfilled`, `rejected`.

---

## 4. Esempi per ogni metodo HTTP

### `GET`: ottenere dati

```ts
export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const res = await axios.get('/api/posts');
  return res.data;
});
```

#### Extra reducer:

```ts
.addCase(fetchPosts.pending, state => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchPosts.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload;
})
.addCase(fetchPosts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Errore nel caricamento';
});
```

---

### `POST`: creare risorsa

```ts
export const createPost = createAsyncThunk(
  'posts/create',
  async (post: { title: string; body: string }) => {
    const res = await axios.post('/api/posts', post);
    return res.data;
  }
);
```

#### Best practice:

* Ricevere il nuovo oggetto dal backend
* Aggiungerlo alla lista esistente

```ts
.addCase(createPost.fulfilled, (state, action) => {
  state.data.push(action.payload); // aggiunta in fondo
})
```

---

### `PUT` o `PATCH`: aggiornare risorsa

```ts
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, data }: { id: number; data: { title?: string } }) => {
    const res = await axios.patch(`/api/posts/${id}`, data);
    return res.data;
  }
);
```

#### Reducer:

```ts
.addCase(updatePost.fulfilled, (state, action) => {
  const index = state.data.findIndex(p => p.id === action.payload.id);
  if (index !== -1) {
    state.data[index] = action.payload;
  }
});
```

---

### `DELETE`: eliminare risorsa

```ts
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: number) => {
    await axios.delete(`/api/posts/${id}`);
    return id;
  }
);
```

#### Reducer:

```ts
.addCase(deletePost.fulfilled, (state, action) => {
  state.data = state.data.filter(p => p.id !== action.payload);
});
```

---

## 5. Uso combinato nello slice

Esempio di slice con gestione completa CRUD:

```ts
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, ...)
      .addCase(fetchPosts.fulfilled, ...)
      .addCase(fetchPosts.rejected, ...)
      .addCase(createPost.fulfilled, ...)
      .addCase(updatePost.fulfilled, ...)
      .addCase(deletePost.fulfilled, ...);
  },
});
```

---

## 6. Vantaggi di questa struttura

| Vantaggio                         | Descrizione                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| Coerenza                          | Tutti gli stati seguono il pattern `loading / data / error` |
| Integrazione nativa               | Nessun middleware aggiuntivo richiesto                      |
| Testabilità                       | Ogni azione è testabile e separabile                        |
| Separazione delle responsabilità  | Il componente non conosce la logica asincrona               |
| Supporto a retry, chaining, abort | Possibile con middleware o thunk avanzati                   |

---

## 7. Conclusione

`createAsyncThunk` e `extraReducers` costituiscono la struttura più moderna e robusta per la gestione asincrona in Redux Toolkit. Consentono una separazione chiara tra **azione**, **comportamento asincrono** e **stato globale**, fornendo un flusso predicibile e leggibile.
































---

## Struttura del progetto

```
src/
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── usersSlice.ts
├── components/
│   ├── UserItem.tsx
│   ├── UsersList.tsx
│   └── UsersForm.tsx
└── App.tsx
```

---

### 1. `store/index.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

// Configurazione dello store Redux con il reducer degli utenti
export const store = configureStore({
  reducer: {
    users: usersReducer,              // slice utenti
  },
});

// Tipi utili per TypeScript
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 2. `store/hooks.ts`

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook tipizzati per dispatch e selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 3. `store/usersSlice.ts`

```ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Tipo utente
export interface User {
  id: number;
  name: string;
  email: string;
}

// Stato iniziale del slice
interface UsersState {
  data: User[];           // elenco degli utenti
  loading: boolean;       // stato di caricamento
  error: string | null;   // messaggio di errore
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
};

// Thunk per GET /users
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchAll',
  async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;   // payload: array di User
  }
);

// Thunk per POST /users
export const createUser = createAsyncThunk<User, { name: string; email: string }>(
  'users/create',
  async (newUser) => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
    return response.data;   // payload: User creato (con id)
  }
);

// Thunk per PATCH /users/:id
export const updateUser = createAsyncThunk<
  User,
  { id: number; changes: Partial<Omit<User, 'id'>> }
>(
  'users/update',
  async ({ id, changes }) => {
    const response = await axios.patch(`https://jsonplaceholder.typicode.com/users/${id}`, changes);
    return response.data;   // payload: User aggiornato
  }
);

// Thunk per DELETE /users/:id
export const deleteUser = createAsyncThunk<number, number>(
  'users/delete',
  async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    return id;              // payload: id del User eliminato
  }
);

// Slice con gestione di pending/fulfilled/rejected
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},             // nessun reducer sincrono
  extraReducers: builder => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false; state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || 'Errore nel fetch';
      })
      // createUser
      .addCase(createUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false; state.data.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || 'Errore nella creazione';
      })
      // updateUser
      .addCase(updateUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const idx = state.data.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || 'Errore nell\'aggiornamento';
      })
      // deleteUser
      .addCase(deleteUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.data = state.data.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || 'Errore nell\'eliminazione';
      });
  },
});

export default usersSlice.reducer;
```

---

### 4. `components/UserItem.tsx`

```tsx
import React, { memo, useCallback } from 'react';
import { User } from '../store/usersSlice';
import { useAppDispatch } from '../store/hooks';
import { deleteUser } from '../store/usersSlice';

type Props = { user: User };

// Componente memoizzato per evitare re-render non necessari
export const UserItem = memo(({ user }: Props) => {
  const dispatch = useAppDispatch();

  // handler stabile per cancellazione
  const onDelete = useCallback(() => {
    dispatch(deleteUser(user.id));
  }, [dispatch, user.id]);

  return (
    <li style={{ marginBottom: 8 }}>
      {/* visualizzo nome ed email */}
      <span>{user.name} ({user.email})</span>
      {/* bottone di cancellazione utente */}
      <button onClick={onDelete} style={{ marginLeft: 12 }}>
        Elimina
      </button>
    </li>
  );
});
```

---

### 5. `components/UsersList.tsx`

```tsx
import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/usersSlice';
import { UserItem } from './UserItem';

export default function UsersList() {
  const dispatch = useAppDispatch();
  const { data: users, loading, error } = useAppSelector(state => state.users);

  // effetto per caricare gli utenti al mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // handler per ricaricare manualmente
  const onReload = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // UI per loading, error o dati
  if (loading) return <p>Caricamento utenti...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <button onClick={onReload}>Ricarica utenti</button>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {users.map(u => <UserItem key={u.id} user={u} />)}
      </ul>
    </div>
  );
}
```

---

### 6. `components/UsersForm.tsx`

```tsx
import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createUser, updateUser } from '../store/usersSlice';

export default function UsersForm() {
  const dispatch = useAppDispatch();
  const [id, setId]         = useState<number | null>(null);
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');

  // submit per creare o aggiornare
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      // aggiornamento esistente
      dispatch(updateUser({ id, changes: { name, email } }));
    } else {
      // creazione di un nuovo utente
      dispatch(createUser({ name, email }));
    }
    // reset form
    setId(null); setName(''); setEmail('');
  }, [dispatch, id, name, email]);

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 16 }}>
      <input
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ marginLeft: 8 }}
      />
      <button type="submit" style={{ marginLeft: 8 }}>
        {id ? 'Aggiorna' : 'Aggiungi'}
      </button>
    </form>
  );
}
```

---

### 7. `App.tsx`

```tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store }    from './store';
import UsersForm    from './components/UsersForm';
import UsersList    from './components/UsersList';

export default function App() {
  return (
    <Provider store={store}>
      <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
        <h1>Gestione Utenti (CRUD completo)</h1>
        {/* Form per creare o aggiornare utenti */}
        <UsersForm />
        {/* Lista utenti con delete */}
        <UsersList />
      </div>
    </Provider>
  );
}
```

---

## Caratteristiche professionali

* **Redux Toolkit** con `createAsyncThunk` per tutte le operazioni asincrone
* **extraReducers** in un unico slice per GET, POST, PATCH, DELETE
* **React.memo** e **useCallback** per ottimizzare i componenti
* Stato strutturato con `loading`/`error`/`data`
* Separazione tra logica (store, thunk) e presentazione (componenti)
* Form riutilizzabile per create e update











































---

## Traccia d’esercizio: “Portale Utenti CRUD con Redux Toolkit e Axios”

### Obiettivi

* Applicare il ciclo completo di **chiamate REST**: **GET**, **POST**, **PATCH**, **DELETE**
* Gestire lo stato globale con **Redux Toolkit** e **createAsyncThunk**
* Strutturare il codice in slice, hook e componenti ottimizzati (`React.memo`, `useCallback`)
* Mostrare caricamento, errori e dati con pattern `isLoading`/`error`/`data`
* Separare la logica di fetch in un **custom hook** o in servizi esterni

### Requisiti tecnici

1. **Slice Redux**

   * Creare un slice `usersSlice` con stato `{ data: User[]; loading: boolean; error: string | null }`
   * Definire quattro thunk asincroni con `createAsyncThunk`:

     * `fetchUsers` (GET `/users`)
     * `createUser` (POST `/users`)
     * `updateUser` (PATCH `/users/:id`)
     * `deleteUser` (DELETE `/users/:id`)

2. **Store e hook tipizzati**

   * Configurare lo store con `configureStore`
   * Esportare `useAppDispatch` e `useAppSelector`

3. **Componenti React**

   * **UsersForm** per inserire o modificare un utente (campi: name, email)
   * **UsersList** per visualizzare l’elenco e gestire reload
   * **UserItem** (memoizzato) con bottone “Elimina”

4. **Custom hook**

   * (Opzionale) `useUsersApi` per incapsulare la logica di chiamata e ritornare `{ data, isLoading, error, refetch }`

5. **Ottimizzazioni**

   * `React.memo` su `UserItem`
   * `useCallback` per stabilizzare i handler (`onDelete`, `onReload`, `onSubmit`)
   * `useMemo` se servono dati derivati

6. **UI di feedback**

   * Mostrare “Caricamento…” durante l’esecuzione di ogni thunk
   * Mostrare `error` se un’azione fallisce
   * Disabilitare i pulsanti durante il `loading` quando sensato

### Indicazioni per la consegna

* Fornire un repository con struttura chiara (`src/store`, `src/hooks`, `src/components`)
* Scrivere commenti essenziali nei file più complessi
* Non è richiesto React Router in questo esercizio

---

## API pubbliche alternative

Se non si vuole utilizzare **[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)**, ecco alcune alternative gratuite:

1. **ReqRes** ([https://reqres.in](https://reqres.in))
   – Utenti fittizi con supporto a GET, POST, PUT, DELETE
   – Esempio: `GET https://reqres.in/api/users`

2. **Random User Generator** ([https://randomuser.me](https://randomuser.me))
   – Utenti casuali, ideale per visualizzare immagini profilo
   – Esempio: `GET https://randomuser.me/api/?results=10`

3. **PokeAPI** ([https://pokeapi.co](https://pokeapi.co))
   – Dati su Pokémon, utilissima per esercizi di paginazione e filtri
   – Esempio: `GET https://pokeapi.co/api/v2/pokemon`

4. **The Star Wars API** ([https://swapi.dev](https://swapi.dev))
   – Risorse su Star Wars (films, people, planets)
   – Esempio: `GET https://swapi.dev/api/people`

5. **Dog CEO’s Dog API** ([https://dog.ceo/dog-api](https://dog.ceo/dog-api))
   – URL di immagini casuali di cani
   – Esempio: `GET https://dog.ceo/api/breeds/image/random/10`

Ognuna di queste API offre endpoint REST standard e response JSON, perfetti per mettere alla prova il flusso di chiamata asincrona, la gestione degli stati e le azioni in Redux Toolkit.

































**esempio completo con routing** 


---

##  Struttura del progetto

```
src/
├── api/
│   └── apiClient.ts
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   ├── authSlice.ts
│   └── usersSlice.ts
├── routes/
│   └── PrivateRoute.tsx
├── components/
│   ├── Navbar.tsx
│   └── UserItem.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── UsersPage.tsx
│   ├── UserDetailPage.tsx
│   ├── UserFormPage.tsx
│   └── NotFoundPage.tsx
├── App.tsx
└── index.tsx
```

---

### 1. Configurazione Axios – `api/apiClient.ts`

```ts
import axios from 'axios';

// Client axios con baseURL e header comuni
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
```

---

### 2. Store Redux – `store/index.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';

export const store = configureStore({
  reducer: {
    auth:  authReducer,   // stato autenticazione
    users: usersReducer,  // stato utenti + CRUD
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 3. Hook tipizzati – `store/hooks.ts`

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook per dispatch tipizzato
export const useAppDispatch: () => AppDispatch = useDispatch;
// Hook per selector tipizzato
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 4. Slice autenticazione – `store/authSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = { username: string; role: 'user' | 'admin' };

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = { user: null, isAuthenticated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // login fittizio: imposta utente e flag
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // logout: resetta lo stato
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

### 5. Slice utenti e CRUD – `store/usersSlice.ts`

```ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

// Tipo utente
export interface User {
  id: number;
  name: string;
  email: string;
}

// Stato slice
interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
};

// GET /users
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchAll',
  async () => {
    const res = await apiClient.get<User[]>('/users');
    return res.data;
  }
);

// POST /users
export const createUser = createAsyncThunk<User, Omit<User,'id'>>(
  'users/create',
  async newUser => {
    const res = await apiClient.post<User>('/users', newUser);
    return res.data;
  }
);

// PATCH /users/:id
export const updateUser = createAsyncThunk<
  User,
  { id: number; changes: Partial<Omit<User,'id'>> }
>(
  'users/update',
  async ({ id, changes }) => {
    const res = await apiClient.patch<User>(`/users/${id}`, changes);
    return res.data;
  }
);

// DELETE /users/:id
export const deleteUser = createAsyncThunk<number, number>(
  'users/delete',
  async id => {
    await apiClient.delete(`/users/${id}`);
    return id;
  }
);

// Slice con extraReducers per gestire pending/fulfilled/rejected
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false; state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore caricamento utenti';
      })
      // CREATE
      .addCase(createUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false; state.data.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore creazione utente';
      })
      // UPDATE
      .addCase(updateUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const idx = state.data.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore aggiornamento utente';
      })
      // DELETE
      .addCase(deleteUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.data = state.data.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore eliminazione utente';
      });
  },
});

export default usersSlice.reducer;
```

---

### 6. Rotta protetta – `routes/PrivateRoute.tsx`

```tsx
import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * Wrappa i componenti che richiedono login
 */
export function PrivateRoute({ children }: { children: ReactElement }) {
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
}
```

---

### 7. Navigazione – `components/Navbar.tsx`

```tsx
import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

/**
 * Barra di navigazione memoizzata
 */
export const Navbar = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);

  // Logout e redirect a login
  const onLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <nav style={{ marginBottom: 20 }}>
      {isAuth && <Link to="/users" style={{ marginRight: 8 }}>Utenti</Link>}
      {isAuth && <button onClick={onLogout}>Logout</button>}
      {!isAuth && <Link to="/login">Login</Link>}
    </nav>
  );
});
```

---

### 8. Lista utenti – `components/UsersList.tsx`

```tsx
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/usersSlice';
import { UserItem } from './UserItem';

export function UsersList() {
  const dispatch = useAppDispatch();
  const { data: users, loading, error } = useAppSelector(s => s.users);
  const [filter, setFilter] = useState('');    // stato per ricerca

  // Fetch iniziale
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handler ricerca
  const onFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  // Lista filtrata con useMemo
  const filtered = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())),
    [users, filter]
  );

  if (loading) return <p>Caricamento utenti...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <input
        placeholder="Cerca per nome"
        value={filter}
        onChange={onFilterChange}
        style={{ marginBottom: 12 }}
      />
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {filtered.map(u => <UserItem key={u.id} user={u} />)}
      </ul>
    </div>
  );
}
```

---

### 9. Singolo utente – `components/UserItem.tsx`

```tsx
import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, deleteUser } from '../store/usersSlice';
import { useAppDispatch } from '../store/hooks';

/**
 * Mostra un singolo utente con link a dettaglio e pulsante elimina
 */
export const UserItem = memo(({ user }: { user: User }) => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  // Cancel delete
  const onDelete = useCallback(() => {
    dispatch(deleteUser(user.id));
  }, [dispatch, user.id]);

  // Vai a dettaglio per edit
  const onEdit = useCallback(() => {
    nav(`/users/${user.id}/edit`);
  }, [nav, user.id]);

  return (
    <li style={{ marginBottom: 8 }}>
      <Link to={`/users/${user.id}`} style={{ marginRight: 8 }}>
        {user.name}
      </Link>
      <button onClick={onEdit} style={{ marginRight: 4 }}>Modifica</button>
      <button onClick={onDelete}>Elimina</button>
    </li>
  );
});
```

---

### 10. Form di creazione/aggiornamento – `pages/UserFormPage.tsx`

```tsx
import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createUser, updateUser } from '../store/usersSlice';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const users = useAppSelector(s => s.users.data);

  // Stato locale form
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');

  // Se id è presente, prepopola i campi
  useEffect(() => {
    if (id) {
      const usr = users.find(u => u.id === +id);
      if (usr) {
        setName(usr.name);
        setEmail(usr.email);
      }
    }
  }, [id, users]);

  // Submit handler
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateUser({ id: +id, changes: { name, email } }));
    } else {
      dispatch(createUser({ name, email }));
    }
    navigate('/users');
  }, [dispatch, id, name, email, navigate]);

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Nome</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type="submit" style={{ marginTop: 8 }}>
        {id ? 'Aggiorna Utente' : 'Crea Utente'}
      </button>
    </form>
  );
}
```

---

### 11. Dettaglio utente – `pages/UserDetailPage.tsx`

```tsx
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector(s => 
    s.users.data.find(u => u.id === +id)
  );

  if (!user) return <p>Utente non trovato.</p>;

  return (
    <div>
      <h2>Dettagli utente</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <Link to={`/users/${user.id}/edit`}>Modifica</Link>
    </div>
  );
}
```

---

### 12. Pagina utenti – `pages/UsersPage.tsx`

```tsx
import { Link } from 'react-router-dom';
import { UsersList } from '../components/UsersList';

export default function UsersPage() {
  return (
    <div>
      <h1>Gestione Utenti</h1>
      <Link to="/users/new" style={{ marginBottom: 12, display: 'inline-block' }}>
        Nuovo Utente
      </Link>
      <UsersList />
    </div>
  );
}
```

---

### 13. LoginPage – `pages/LoginPage.tsx`

```tsx
import { useState, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Login fittizio con role 'user'
  const onLogin = useCallback(() => {
    dispatch(login({ username, role: 'user' }));
    navigate('/users');
  }, [dispatch, username, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={onLogin} disabled={!username}>
        Accedi
      </button>
    </div>
  );
}
```

---

### 14. 404 – `pages/NotFoundPage.tsx`

```tsx
export default function NotFoundPage() {
  return <h2>404 – Pagina non trovata</h2>;
}
```

---

### 15. Routing e App – `App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import UserFormPage from './pages/UserFormPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Login pubblico */}
          <Route path="/login" element={<LoginPage />} />

          {/* Qualsiasi altra rotta sotto /users è protetta */}
          <Route path="/users/*" element={
            <PrivateRoute>
              <Routes>
                <Route index element={<UsersPage />} />
                <Route path="new" element={<UserFormPage />} />
                <Route path=":id" element={<UserDetailPage />} />
                <Route path=":id/edit" element={<UserFormPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PrivateRoute>
          } />

          {/* Redirect vuoto a /users se già autenticato */}
          <Route path="/" element={<Navigate to="/users" replace />} />

          {/* Fallback generale */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
```

---

### 16. Entrypoint – `index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Render dell’app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Punti chiave e best practice messe in opera

* **Routing protetto** con `<PrivateRoute>` e redirect su `/login`
* **CRUD completo** con `createAsyncThunk` e `extraReducers`
* **Axios** centralizzato in `apiClient`
* **Separation of concerns**: logica API in slice, UI nei componenti
* **React.memo**, **useCallback**, **useMemo** per prevenire re-render inutili
* **Pattern isLoading/error/data** in ogni slice asincrono
* **Tipizzazione TypeScript** per stato, thunk e componenti

