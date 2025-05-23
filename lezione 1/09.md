
---

## Cos'è la paginazione Offset-based

La paginazione offset-based è uno dei metodi più comuni per suddividere un insieme di dati in pagine. È comunemente utilizzata nelle API RESTful.

Funziona passando due parametri all'API:

* `limit`: indica quanti elementi per pagina devono essere restituiti.
* `offset`: indica quanti elementi devono essere saltati prima di iniziare a restituire i risultati.

Alcune API usano invece `page` e `limit`, e calcolano l'offset internamente:

```
offset = (page - 1) * limit
```

Esempi:

| URL                         | Risultato      |
| --------------------------- | -------------- |
| `/posts?limit=10&offset=0`  | Elementi 1–10  |
| `/posts?limit=10&offset=10` | Elementi 11–20 |
| `/posts?page=3&limit=10`    | Elementi 21–30 |

---

## Vantaggi

* È semplice da comprendere e implementare.
* Funziona bene per dataset di piccole o medie dimensioni.
* Ideale per interfacce utente che usano numeri di pagina.

## Limiti

* Se il numero di record è molto grande, `OFFSET` può rallentare le query SQL, perché il database deve scansionare e ignorare molte righe.
* Se i dati cambiano frequentemente (inserimenti o cancellazioni), l'offset può portare a risultati inconsistenti tra una pagina e l'altra.
* Richiede una buona indicizzazione e query ottimizzate per evitare prestazioni scarse.

---

## Implementazione in React con Redux Toolkit

### Struttura dello stato Redux

```ts
interface PaginationState {
  pages: { [page: number]: Post[] }; // Cache delle pagine
  currentPage: number; // Pagina attiva
  totalPages: number; // Numero totale di pagine
  limit: number; // Numero di elementi per pagina
  loading: boolean; // Stato di caricamento
}
```

---

### Redux Slice con cache per pagina

```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk per recuperare una pagina specifica
export const fetchPaginatedPosts = createAsyncThunk(
  'posts/fetchPaginated',
  async ({ page, limit }: { page: number; limit: number }) => {
    const offset = (page - 1) * limit;
    const response = await axios.get(`/api/posts?limit=${limit}&offset=${offset}`);
    return {
      data: response.data.results, // Lista dei post
      page, // Numero della pagina recuperata
      totalPages: response.data.totalPages // Totale delle pagine
    };
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    pages: {},
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    loading: false,
  } as PaginationState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Aggiorna la pagina corrente
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedPosts.pending, (state) => {
        state.loading = true; // Imposta stato di caricamento
      })
      .addCase(fetchPaginatedPosts.fulfilled, (state, action) => {
        const { page, data, totalPages } = action.payload;
        state.pages[page] = data; // Salva i dati della pagina nella cache
        state.totalPages = totalPages;
        state.loading = false;
      })
      .addCase(fetchPaginatedPosts.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setPage } = postsSlice.actions;
export default postsSlice.reducer;
```

---

### Componente React con uso di cache e prefetch

```tsx
import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPaginatedPosts, setPage } from '../store/postsSlice';

function PaginatedPosts() {
  const dispatch = useAppDispatch();
  const { pages, currentPage, totalPages, limit, loading } = useAppSelector(state => state.posts);

  // Effettua il fetch dei dati della pagina corrente (solo se non già presenti)
  useEffect(() => {
    if (!pages[currentPage]) {
      dispatch(fetchPaginatedPosts({ page: currentPage, limit }));
    }

    // Prefetch della pagina successiva (se esiste)
    if (!pages[currentPage + 1] && currentPage < totalPages) {
      dispatch(fetchPaginatedPosts({ page: currentPage + 1, limit }));
    }
  }, [currentPage]);

  // Ottimizzazione del rendering con useMemo
  const currentPosts = useMemo(() => pages[currentPage] || [], [pages, currentPage]);

  // Gestione pulsanti di navigazione
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
    }
  };

  return (
    <div>
      <h2>Elenco post</h2>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        currentPosts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))
      )}
      <div>
        <button disabled={currentPage === 1} onClick={handlePrevious}>Precedente</button>
        <span>Pagina {currentPage} di {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={handleNext}>Successiva</button>
      </div>
    </div>
  );
}

export default PaginatedPosts;
```

---

## Best practice per l'offset-based pagination

* **Cache delle pagine**: evita richieste duplicate mantenendo in memoria i dati già caricati.
* **Prefetch della pagina successiva**: migliora l’esperienza utente anticipando la richiesta della prossima pagina.
* **Evita di re-fetchare la stessa pagina**: verifica se la pagina è già disponibile nello stato.
* **Controlla se è già in corso un caricamento** per evitare richieste multiple simultanee.
* **Utilizza useMemo per evitare re-render non necessari**.
* **Assicurati che il backend utilizzi indici efficienti** su colonne usate in `ORDER BY` per evitare `OFFSET` lenti.
* **Mostra lo stato di caricamento in modo coerente** mentre i dati vengono recuperati.

---



































### Ottimizzazione

---

## Approccio 1 – **Cancellare pagine distanti dalla pagina attuale**

### Strategia

Mantieni in memoria solo:

* la pagina corrente
* una o due pagine prima
* una o due pagine dopo

### Esempio di logica

```ts
const MAX_CACHE_DISTANCE = 2;

function cleanOldPages(state: PaginationState) {
  const keys = Object.keys(state.pages).map(Number);
  for (const page of keys) {
    if (Math.abs(page - state.currentPage) > MAX_CACHE_DISTANCE) {
      delete state.pages[page];
    }
  }
}
```

### Applicazione nel reducer Redux

Integra `cleanOldPages` subito dopo il salvataggio dei dati:

```ts
.addCase(fetchPaginatedPosts.fulfilled, (state, action) => {
  const { page, data, totalPages } = action.payload;
  state.pages[page] = data;
  state.totalPages = totalPages;
  state.loading = false;

  // Pulizia cache pagine vecchie
  cleanOldPages(state);
});
```

---

## Approccio 2 – **Limite fisso al numero massimo di pagine nella cache**

### Strategia

* Limita la cache a un numero massimo di pagine (es. 5).
* Se la cache supera quel numero, elimina la più lontana dalla pagina corrente.

```ts
const MAX_CACHED_PAGES = 5;

function limitPageCache(state: PaginationState) {
  const pages = Object.keys(state.pages).map(Number);
  if (pages.length <= MAX_CACHED_PAGES) return;

  const pagesSortedByDistance = pages.sort((a, b) =>
    Math.abs(state.currentPage - b) - Math.abs(state.currentPage - a)
  );

  const pagesToDelete = pagesSortedByDistance.slice(MAX_CACHED_PAGES);
  for (const page of pagesToDelete) {
    delete state.pages[page];
  }
}
```

Anche questa si usa nella stessa posizione del reducer Redux.

---

## Approccio 3 – **Cancellazione manuale (es. su evento specifico)**

Puoi anche fornire un'azione Redux per pulire **tutta** la cache o solo alcune pagine, ad esempio quando l'utente cambia filtro o categoria.

```ts
reducers: {
  clearAllPages: (state) => {
    state.pages = {};
  },
  clearPage: (state, action: PayloadAction<number>) => {
    delete state.pages[action.payload];
  }
}
```

---

## Considerazioni

| Aspetto            | Buona pratica                                                                           |
| ------------------ | --------------------------------------------------------------------------------------- |
| Esperienza utente  | Non cancellare la pagina corrente o prossima                                            |
| Scroll infinito    | Preferibile mantenere una "finestra mobile" di pagine visibili                          |
| Complessità        | In scenari semplici non è strettamente necessario                                       |
| Performance mobile | Eliminare le pagine non necessarie riduce uso di memoria                                |
| Componente React   | Verifica sempre se la pagina è già stata rimossa prima di accedere `pages[currentPage]` |

---



























Perfetto. Di seguito trovi un approfondimento completo, professionale e strutturato su come funziona la **Cursor-based Pagination**: cos'è, perché è più efficiente, come implementarla, vantaggi rispetto alla offset-based e un esempio pratico con React.

---

## Cos'è la Cursor-based Pagination

La **paginazione basata su cursore** (cursor-based pagination, nota anche come **keyset pagination**) consiste nel recuperare la "pagina successiva" di risultati a partire da un **punto di riferimento univoco**: il *cursor*.

### Esempio tipico:

```http
GET /posts?after=abc123&limit=10
```

In questo esempio:

* `abc123` è il **cursore**: identifica l’ultimo elemento restituito nella pagina precedente.
* `limit=10` specifica quanti risultati vogliamo dopo quel punto.

Il backend, invece di saltare un certo numero di righe (`OFFSET`), recupera direttamente i record **successivi** al valore indicato dal cursore.

---

## Differenze con offset-based

| Aspetto                  | Offset-based                  | Cursor-based                                |
| ------------------------ | ----------------------------- | ------------------------------------------- |
| Scalabilità              | Pessima con grandi dataset    | Eccellente con tabelle molto grandi         |
| Prestazioni              | Richiede scan e `OFFSET`      | Usa indice, molto più veloce                |
| Stabilità                | Suscettibile a modifiche dati | Robusto anche con inserimenti/cancellazioni |
| Implementazione frontend | Più semplice                  | Leggermente più complessa                   |
| Ordine necessario        | Facoltativo                   | Obbligatorio (per avere un cursore)         |

---

## Quando usarla

Cursor-based pagination è ideale quando:

* Stai lavorando con **dataset molto grandi**.
* L'ordinamento è garantito (es. per ID univoco, timestamp).
* Vuoi evitare che l’aggiunta o la rimozione di record alteri l’esperienza utente.
* Usi GraphQL, Firebase, MongoDB o motori di ricerca indicizzati.

---

## Come funziona un cursore

Il cursore può essere:

* Un **ID univoco crescente** (es. `id`, `createdAt`)
* Un **token** serializzato (es. base64 con info criptata o hashata)
* Un **timestamp** (per eventi in tempo reale o timeline)

### Esempio semplice di backend (pseudo-query)

```sql
SELECT * FROM posts 
WHERE id > 'abc123'
ORDER BY id
LIMIT 10;
```

---

## Risposta tipica di un’API cursor-based

```json
{
  "results": [
    { "id": "abc124", "title": "Post 1" },
    { "id": "abc125", "title": "Post 2" },
    ...
  ],
  "nextCursor": "abc133",
  "hasMore": true
}
```

Il frontend deve conservare `nextCursor` per richiedere la pagina successiva.

---


## 1. Redux Slice con Redux Toolkit

```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk asincrono per caricare i post basati su cursore
export const fetchPostsByCursor = createAsyncThunk(
  'posts/fetchByCursor',
  async ({ cursor = null, limit }: { cursor?: string | null; limit: number }) => {
    // Costruisce l’URL con o senza il parametro `after`
    const url = cursor
      ? `/api/posts?after=${cursor}&limit=${limit}`
      : `/api/posts?limit=${limit}`;

    // Effettua la richiesta HTTP
    const response = await axios.get(url);

    // Restituisce l’intera risposta
    return response.data;
  }
);

// Stato iniziale del reducer
interface CursorPaginationState {
  items: Post[];                 // Lista cumulativa dei post caricati
  nextCursor: string | null;    // Cursore per la pagina successiva
  hasMore: boolean;             // Flag per capire se ci sono altri risultati
  loading: boolean;             // Stato di caricamento
}

const initialState: CursorPaginationState = {
  items: [],
  nextCursor: null,
  hasMore: true,
  loading: false,
};

// Slice Redux Toolkit per gestire la logica
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Azione per svuotare la lista (utile quando si cambia filtro, categoria, ecc.)
    clearPosts: (state) => {
      state.items = [];
      state.nextCursor = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByCursor.pending, (state) => {
        state.loading = true; // Imposta lo stato di loading
      })
      .addCase(fetchPostsByCursor.fulfilled, (state, action) => {
        // Aggiunge i nuovi elementi in fondo alla lista esistente
        state.items.push(...action.payload.results);
        // Aggiorna il cursore per la prossima chiamata
        state.nextCursor = action.payload.nextCursor;
        // Verifica se ci sono ancora risultati da caricare
        state.hasMore = action.payload.hasMore;
        state.loading = false;
      })
      .addCase(fetchPostsByCursor.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
```

---

## 2. Componente React che usa scroll o pulsante per caricare più risultati

```tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPostsByCursor } from '../store/postsSlice';

function InfinitePostList() {
  const dispatch = useAppDispatch();
  const { items, nextCursor, hasMore, loading } = useAppSelector(state => state.posts);

  // Carica la prima pagina all'avvio del componente
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPostsByCursor({ limit: 10 }));
    }
  }, []);

  // Handler per caricare la prossima pagina
  const loadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchPostsByCursor({ cursor: nextCursor, limit: 10 }));
    }
  };

  return (
    <div>
      <h2>Post recenti</h2>

      {/* Visualizza i post caricati */}
      {items.map(post => (
        <div key={post.id} style={{ marginBottom: '12px' }}>
          <strong>{post.title}</strong>
        </div>
      ))}

      {/* Stato di caricamento */}
      {loading && <p>Caricamento in corso...</p>}

      {/* Pulsante per caricare altri risultati */}
      {!loading && hasMore && (
        <button onClick={loadMore}>Carica altri</button>
      )}

      {/* Nessun altro elemento disponibile */}
      {!hasMore && <p>Fine dei contenuti.</p>}
    </div>
  );
}

export default InfinitePostList;
```

---

## Best Practice

1. **Ordina sempre i dati nel backend** per una colonna indicizzata (es. `id`, `created_at`).
2. **Non usare cursori direttamente come ID esposti**: codificali se possibile (`Base64.encode`, hash, JWT, ecc.).
3. **Evita di esporre salti diretti alla pagina X**: la paginazione cursor-based è sequenziale.
4. **Mantieni lo stato cumulativo** nel frontend (non sovrascrivere la lista).
5. **Ripulisci i dati quando si cambia contesto** (filtro, categoria, utente) per evitare dati incoerenti.

---




























ESEMPIO

---

### 1. Slice Redux (`githubUsersSlice.ts`)

```ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

// Modello di un utente GitHub
export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

// Stato del slice
interface GithubCursorState {
  pages: { [page: number]: GitHubUser[] };        // Cache dei dati per pagina
  pageCursors: { [page: number]: number | null }; // Cursore (since) per ciascuna pagina
  currentPage: number;                            // Pagina attiva
  limit: number;                                  // Elementi per pagina
  loading: boolean;                               // Stato di caricamento
  cacheLimit: number;                             // Numero massimo di pagine in cache
}

const initialState: GithubCursorState = {
  pages: {},  
  pageCursors: { 1: null },  // La pagina 1 parte con cursore `null`
  currentPage: 1,
  limit: 10,
  loading: false,
  cacheLimit: 2,             // Manteniamo in cache solo due pagine attive
};

// Thunk asincrono per caricare la pagina `page`
export const fetchGithubUsersPage = createAsyncThunk<
  { data: GitHubUser[]; page: number; nextCursor: number | null },
  number,
  { state: RootState }
>(
  'github/fetchUsersPage',
  async (page, { getState }) => {
    const state = getState().github;
    const cursorParam = state.pageCursors[page] ?? null;
    // Costruisci URL con o senza `since`
    const url = cursorParam !== null
      ? `https://api.github.com/users?per_page=${state.limit}&since=${cursorParam}`
      : `https://api.github.com/users?per_page=${state.limit}`;
    const response = await axios.get<GitHubUser[]>(url);
    // Il nuovo cursore è l'ID dell'ultimo elemento ricevuto
    const nextCursor = response.data.length > 0
      ? response.data[response.data.length - 1].id
      : null;
    return { data: response.data, page, nextCursor };
  }
);

// Funzione di utilità per rimuovere le pagine più distanti
function cleanCache(state: GithubCursorState) {
  const loadedPages = Object.keys(state.pages).map(Number);
  if (loadedPages.length <= state.cacheLimit) return;
  // Calcola distanza dalla pagina corrente
  const distances = loadedPages
    .map(p => ({ p, dist: Math.abs(state.currentPage - p) }))
    .sort((a, b) => b.dist - a.dist);
  // Elimina le pagine oltre il limite
  distances.slice(state.cacheLimit).forEach(d => {
    delete state.pages[d.p];
    delete state.pageCursors[d.p];
  });
}

const githubUsersSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    // Cambia pagina corrente
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    // Svuota completamente la cache (es. cambio filtro globale)
    clearCache: (state) => {
      state.pages = {};
      state.pageCursors = { 1: null };
      state.currentPage = 1;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubUsersPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGithubUsersPage.fulfilled, (state, action) => {
        const { page, data, nextCursor } = action.payload;
        // Salva i dati nella cache per la pagina richiesta
        state.pages[page] = data;
        // Registra il cursore per la pagina successiva
        state.pageCursors[page + 1] = nextCursor;
        state.loading = false;
        // Pulisci eventuali pagine troppo vecchie
        cleanCache(state);
      })
      .addCase(fetchGithubUsersPage.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setPage, clearCache } = githubUsersSlice.actions;
export default githubUsersSlice.reducer;
```

---

### 2. Componente React con bottoni, jump-to-page, filtro e pre-fetch

```tsx
// components/GithubUsersPagination.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchGithubUsersPage, setPage, clearCache } from '../store/githubUsersSlice';

export function GithubUsersPagination() {
  const dispatch = useAppDispatch();
  const {
    pages,
    pageCursors,
    currentPage,
    limit,
    loading
  } = useAppSelector(state => state.github);

  // Stati locali per filtro e input "vai a pagina"
  const [filterTerm, setFilterTerm] = useState('');
  const [gotoPageInput, setGotoPageInput] = useState('1');

  // Carica la pagina corrente se non già in cache
  useEffect(() => {
    if (!pages[currentPage]) {
      dispatch(fetchGithubUsersPage(currentPage));
    }
  }, [currentPage, pages, dispatch]);

  // Pre‐fetch della pagina successiva, se il cursore esiste e non è in cache
  useEffect(() => {
    const nextPage = currentPage + 1;
    const cursor = pageCursors[nextPage];
    if (cursor !== undefined && !pages[nextPage]) {
      dispatch(fetchGithubUsersPage(nextPage));
    }
  }, [currentPage, pageCursors, pages, dispatch]);

  // Utenti per la pagina attuale
  const users = pages[currentPage] || [];
  // Applica il filtro client‐side sul `login`
  const displayedUsers = users.filter(u =>
    u.login.toLowerCase().includes(filterTerm.toLowerCase())
  );

  // Handlers per i bottoni
  const handlePrev = () => {
    if (currentPage > 1 && !loading) {
      dispatch(setPage(currentPage - 1));
    }
  };
  const handleNext = () => {
    // Disabilitato se non c’è un cursore per la prossima pagina
    if (pageCursors[currentPage + 1] !== null && !loading) {
      dispatch(setPage(currentPage + 1));
    }
  };
  const handleGoTo = () => {
    const pageNum = parseInt(gotoPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && !loading) {
      dispatch(setPage(pageNum));
    }
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se cambio filtro, resetto cache e torno a pagina 1
    setFilterTerm(e.target.value);
    dispatch(clearCache());
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Elenco Utenti GitHub</h2>

      {/* Filtro per login */}
      <div>
        <input
          type="text"
          placeholder="Filtra per login..."
          value={filterTerm}
          onChange={handleFilterChange}
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />
      </div>

      {/* Lista utenti */}
      {loading && <p>Caricamento...</p>}
      {!loading && displayedUsers.length === 0 && <p>Nessun utente trovato.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {displayedUsers.map(user => (
          <li key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              width={32}
              height={32}
              style={{ borderRadius: '50%', marginRight: '8px' }}
            />
            <a href={user.html_url} target="_blank" rel="noreferrer">
              {user.login}
            </a>
          </li>
        ))}
      </ul>

      {/* Controlli di paginazione */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
        <button onClick={handlePrev} disabled={currentPage === 1 || loading}>
          Indietro
        </button>
        <span>Pagina {currentPage}</span>
        <button
          onClick={handleNext}
          disabled={pageCursors[currentPage + 1] == null || loading}
        >
          Avanti
        </button>
      </div>

      {/* Jump to page */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="number"
          min="1"
          value={gotoPageInput}
          onChange={e => setGotoPageInput(e.target.value)}
          style={{ width: '60px', padding: '4px' }}
        />
        <button onClick={handleGoTo} disabled={loading}>
          Vai a pagina
        </button>
      </div>
    </div>
  );
}
```

---

#### Come funziona

1. **Slice Redux**

   * Mantiene `pages[page]` e `pageCursors[page]`
   * `fetchGithubUsersPage(page)` calcola il `since` corretto da `pageCursors[page]`
   * Dopo il fetch, salva i dati e imposta `pageCursors[page+1]`
   * Chiama `cleanCache` per eliminare le pagine più distanti

2. **Componente**

   * Al mount o al cambio di `currentPage` richiede i dati se non sono in cache
   * Pre-fetch della pagina successiva non appena conosce il cursore
   * Input di filtro: svuota la cache e torna a pagina 1
   * Bottoni **Indietro/Avanti** e input **Vai a pagina** basati su `currentPage` e `pageCursors`
   * Applica un filtro client-side sul `login`

Questa architettura garantisce:

* **Performance**: minimizza le chiamate API via pre-fetch e cache
* **Scalabilità**: pulisce automaticamente la cache
* **UX**: controlli di navigazione flessibili e filtro istantaneo












































Ricerca distante e Ottimizzazione

---

### 1. Il thunk `gotoPageChain`

```ts
// store/githubUsersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

export interface GitHubUser { /* ... */ }

// Thunk per fetch pagine singole (rimane invariato)
export const fetchGithubUsersPage = createAsyncThunk<
  { data: GitHubUser[]; page: number; nextCursor: number | null },
  number,
  { state: RootState }
>(
  'github/fetchUsersPage',
  async (page, { getState }) => {
    const state = getState().github;
    const cursorParam = state.pageCursors[page] ?? null;
    const url = cursorParam !== null
      ? `https://api.github.com/users?per_page=${state.limit}&since=${cursorParam}`
      : `https://api.github.com/users?per_page=${state.limit}`;
    const response = await axios.get<GitHubUser[]>(url);
    const nextCursor = response.data.length
      ? response.data[response.data.length - 1].id
      : null;
    return { data: response.data, page, nextCursor };
  }
);

// --- IL NOSTRO NUOVO THUNK ------------------------------------------------
export const gotoPageChain = createAsyncThunk<
  void,                   // non restituiamo dati
  number,                 // targetPage
  { state: RootState }
>(
  'github/gotoPageChain',
  async (targetPage, { dispatch, getState }) => {
    const state = getState().github;

    // 1) Se abbiamo già caricata la pagina target, salto direttamente
    if (state.pages[targetPage]) {
      dispatch(setPage(targetPage));
      // Prefetch pagine adiacenti per ottimizzazione
      if (targetPage > 1 && !state.pages[targetPage - 1]) {
        await dispatch(fetchGithubUsersPage(targetPage - 1)).unwrap();
      }
      if (state.pageCursors[targetPage + 1] !== undefined && !state.pages[targetPage + 1]) {
        await dispatch(fetchGithubUsersPage(targetPage + 1)).unwrap();
      }
      return;
    }

    // 2) Trova l'ultima pagina inferiore a targetPage di cui conosciamo il cursore
    //    guardando direttamente pageCursors nel redux state
    const knownPages = Object.keys(state.pageCursors)
      .map(Number)
      .filter(p => p < targetPage && state.pageCursors[p] !== undefined);
    const lastKnownPage = knownPages.length
      ? Math.max(...knownPages)
      : 1; // caduta sicura: pagina 1 è sempre definita in initialState

    // 3) Chain-fetch: da lastKnownPage fino a targetPage (inclusa)
    for (let p = lastKnownPage; p <= targetPage; p++) {
      // unwrap() fa fallire l'intera catena in caso di errore
      await dispatch(fetchGithubUsersPage(p)).unwrap();
    }

    // 4) Adesso che targetPage è in cache, imposto la pagina corrente
    dispatch(setPage(targetPage));

    // 5) Prefetch delle pagine adiacenti
    const newState = getState().github;
    if (targetPage > 1 && !newState.pages[targetPage - 1]) {
      await dispatch(fetchGithubUsersPage(targetPage - 1)).unwrap();
    }
    if (newState.pageCursors[targetPage + 1] !== undefined
        && !newState.pages[targetPage + 1]) {
      await dispatch(fetchGithubUsersPage(targetPage + 1)).unwrap();
    }
  }
);
// ---------------------------------------------------------------------------

// Slice e reducer (rimangono invariati, tranne l’import di gotoPageChain)
interface GithubCursorState { /* ... */ }
const initialState: GithubCursorState = { /* ... */ };

const githubUsersSlice = createSlice({
  // name, initialState, reducers: setPage, clearCache...
  extraReducers: builder => {
    builder
      .addCase(fetchGithubUsersPage.pending, /* ... */)
      .addCase(fetchGithubUsersPage.fulfilled, /* salva pages e pageCursors */)
      .addCase(fetchGithubUsersPage.rejected, /* ... */)
      // Non serve extraReducer per gotoPageChain perché dispatcha le stesse azioni interne
  }
});

export const { setPage, clearCache } = githubUsersSlice.actions;
export default githubUsersSlice.reducer;
```

---

### 2. Come integrarlo nel componente

Nel tuo componente `GithubUsersPagination.tsx` modifica l’handler “Vai a pagina” in questo modo:

```diff
-import { fetchGithubUsersPage, setPage, clearCache } from '../store/githubUsersSlice';
+import { fetchGithubUsersPage, setPage, clearCache, gotoPageChain } from '../store/githubUsersSlice';

 // …

 const handleGoTo = () => {
   const pageNum = parseInt(gotoPageInput, 10);
   if (!isNaN(pageNum) && pageNum >= 1 && !loading) {
-    dispatch(setPage(pageNum));
+    dispatch(gotoPageChain(pageNum));
   }
 };
```

---

### 3. Cosa accade, passo per passo

1. **Richiesta jump**
   L’utente inserisce “7” e clicca “Vai a pagina”.
2. **`gotoPageChain(7)`**

   * Controlla se `pages[7]` è già in cache.
   * Se sì: chiama `setPage(7)` e lancia prefetch per 6 e 8.
   * Se no: individua l’**ultima pagina nota** inferiore a 7 leggendo `state.pageCursors`.
3. **Chain-fetch**

   * Esegue (ad es.) `fetchGithubUsersPage(4)`, `…5`, `…6`, `…7`, in ordine.
   * Ogni fetch salva `pages[p]` e popola `pageCursors[p+1]`.
4. **SetPage**
   Alla fine imposta `currentPage = 7`, attivando il render dei dati già caricati.
5. **Prefetch adiacenti**

   * Se non esiste, fetcha pagina 6 (utile se si torna indietro subito)
   * Se esiste cursore per 8, fetcha pagina 8 (ottimizzazione per “Avanti”)

In questo modo il salto “jump-to-page” è **robusto**, **performante** e mantiene in cache le pagine **adiacenti** per un’esperienza utente fluida.






















# 1. RTK Query

## 1.1 Installa la libreria (già inclusa in Redux Toolkit)

Se usi `@reduxjs/toolkit`, **RTK Query è già incluso**.

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 1.2 Configura lo store Redux

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api'; // definiremo questo tra poco

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

---

# 2. Definisci una API (al posto di thunk e slice)

```ts
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api', // chiave nel Redux store
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
  }),
});

// Hook auto-generato
export const { useGetUsersQuery } = api;
```

 Questo `useGetUsersQuery()` **sostituisce**:

* `createAsyncThunk`
* `extraReducers`
* `loading`, `error`, `useEffect`, `dispatch`

---

# 3. Uso base nel componente

```tsx
// components/UserList.tsx
import { useGetUsersQuery } from '../services/api';

function UserList() {
  const { data, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <p>Caricamento...</p>;
  if (isError) return <p>Errore nel caricamento</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

---

# 4. Parametri dinamici: query con argomenti

```ts
getUser: builder.query({
  query: (id) => `users/${id}`,
});

export const { useGetUserQuery } = api;

// uso:
const { data } = useGetUserQuery(5);
```

---















































---

#  Parte 1 – CACHING in RTK Query

## 1. Cos'è il caching in RTK Query

RTK Query **mantiene in memoria i dati delle query** per evitare di rifare il fetch ogni volta.

Quando esegui:

```ts
const { data } = useGetUsersQuery();
```

RTK Query:

* Salva la risposta associata a `['getUsers']` nel Redux store
* Evita nuove chiamate se i dati sono **freschi**
* Rifà il fetch solo se i dati sono **stale** o invalidati

---

## 2. Concetti fondamentali

| Proprietà                   | Descrizione                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| `queryKey`                  | Identificatore univoco della query (`['users', id]`, ecc.)           |
| `keepUnusedDataFor`         | Tempo (in secondi) in cui i dati restano in cache anche se non usati |
| `refetchOnMountOrArgChange` | Refetch automatico se cambia argomento (default: true)               |
| `refetchOnReconnect`        | Refetch quando la connessione ritorna                                |
| `refetchOnFocus`            | Refetch se l’utente torna alla finestra/tab                          |

### Esempio

```ts
getUsers: builder.query({
  query: () => 'users',
  keepUnusedDataFor: 300, // 5 minuti
}),
```

---

## 3. Quando RTK Query rifa il fetch?

### Non rifa il fetch se:

* I dati sono ancora “usati” (un componente li legge)
* Sono freschi (`keepUnusedDataFor` non è scaduto)

### Rifa il fetch se:

* I dati sono “stale” e il componente li richiede
* Chiedi `refetch()`
* C’è una `mutation` che **invalidates** la query

---

# Parte 2 – MUTATIONS in RTK Query

Le **mutation** sono operazioni che modificano dati remoti: `POST`, `PUT`, `PATCH`, `DELETE`.

## 1. Sintassi base

```ts
createUser: builder.mutation({
  query: (newUser) => ({
    url: 'users',
    method: 'POST',
    body: newUser
  }),
}),
```

Nel componente:

```tsx
const [createUser, { isLoading }] = useCreateUserMutation();
createUser({ name: 'Luca' });
```

---

## 2. Aggiornare la cache dopo una mutation

###   `invalidatesTags`

**È il più semplice. RTK Query rifà il fetch delle query con quel tag.**

```ts
getUsers: builder.query({
  query: () => 'users',
  providesTags: ['Users'],
}),

createUser: builder.mutation({
  query: (newUser) => ({ url: 'users', method: 'POST', body: newUser }),
  invalidatesTags: ['Users'], // rifà il fetch di getUsers()
}),
```

---



















































ESEMPIO COMPLETO

---

## 1. store.ts

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';

export const store = configureStore({
  reducer: {
    // RTK Query inserisce il suo reducer sotto `api.reducerPath`
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // aggiunge il middleware di RTK Query per cache, polling, invalidation
    getDefaultMiddleware().concat(api.middleware),
});

// Tipi utili per useDispatch/useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 2. services/api.ts

```ts
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Definizione del tipo Post
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const api = createApi({
  reducerPath: 'api',                  // chiave Redux per questo slice
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  tagTypes: ['Posts'],                // tag per invalidation
  endpoints: (builder) => ({
    // READ: lista di post
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: (result = []) =>
        // fornisce un tag per ogni post e uno "LIST" per invalidation generale
        [
          ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
          { type: 'Posts', id: 'LIST' },
        ],
    }),
    // READ: singolo post
    getPost: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),
    // CREATE: aggiunge un nuovo post
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    // UPDATE: modifica un post esistente
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),
    // DELETE: rimuove un post
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),
  }),
});

// Hook auto-generati per ogni endpoint
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = api;
```

---

## 3. App.tsx

```tsx
// App.tsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  Post,
} from './services/api';

function PostsList() {
  //  Fetch lista post
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  //  Mutation hooks
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  // Stato per creare/modificare
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Handler create
  const handleAdd = async () => {
    if (!newTitle) return;
    await addPost({ title: newTitle, body: '', userId: 1 });
    setNewTitle('');
  };

  // Handler edit start
  const startEdit = (post: Post) => {
    setEditId(post.id);
    setEditTitle(post.title);
  };
  // Handler save edit
  const saveEdit = async () => {
    if (editId === null) return;
    await updatePost({ id: editId, title: editTitle });
    setEditId(null);
    setEditTitle('');
  };

  // Handler delete
  const handleDelete = async (id: number) => {
    await deletePost(id);
  };

  if (isLoading) return <p>Caricamento post...</p>;
  if (isError)   return <p>Errore nel recupero dei post</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Posts (CRUD con RTK Query)</h1>

      {/* Form crea post */}
      <div>
        <input
          placeholder="Titolo nuovo post"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button onClick={handleAdd}>Crea</button>
      </div>

      <ul>
        {posts!.map(post => (
          <li key={post.id} style={{ marginBottom: 8 }}>
            {editId === post.id ? (
              // Edit mode
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <button onClick={saveEdit}>Salva</button>
                <button onClick={() => setEditId(null)}>Annulla</button>
              </>
            ) : (
              // Read mode
              <>
                <strong>{post.title}</strong>
                <button onClick={() => startEdit(post)}>Modifica</button>
                <button onClick={() => handleDelete(post.id)}>Elimina</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PostsList />
    </Provider>
  );
}
```

---

### Come funziona nel dettaglio

1. **Query**

   * `useGetPostsQuery()` fa automaticamente il `GET /posts`, mantiene lo stato `isLoading`/`isError` e **cacha** i risultati
2. **Mutations**

   * `useAddPostMutation()`, `useUpdatePostMutation()`, `useDeletePostMutation()` espongono funzioni per creare, aggiornare e cancellare
3. **Invalidation**

   * `invalidatesTags: ['Posts']` o specifici post `(type: 'Posts', id)` fa sì che RTK Query **rifaccia il fetch** delle query invalidate, mantenendo sempre la lista sincronizzata
4. **Zero boilerplate**

   * Non esistono `createAsyncThunk`, `slice`, `extraReducers`, `dispatch` espliciti per i fetch: tutto è generato automaticamente da RTK Query







































---

#  Cos'è un middleware personalizzato in un thunk?

In Redux Toolkit, un `createAsyncThunk` è una **funzione asincrona con accesso completo a:**

* `dispatch`
* `getState`
* `rejectWithValue` / `fulfillWithValue`

> Quindi puoi **inserire qualsiasi logica personalizzata**, come:

* logging
* accesso al token da `getState`
* gestione errori specifica
* side effect (notifiche, redirect, etc.)
* chaining di più azioni Redux
* check di stato globale prima della fetch

---

#  Esempio di base: middleware inline

```ts
// Esegue un controllo prima della fetch
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id: number, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;

    //  Middleware personalizzato: blocco se utente è già presente
    if (state.users.entities[id]) {
      console.log('[Thunk] Utente già in cache, blocco fetch.');
      return rejectWithValue('Utente già caricato');
    }

    try {
      const res = await axios.get(`/api/users/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data || 'Errore generico');
    }
  }
);
```

---

#  Parametri disponibili nei thunk

Redux Toolkit fornisce come secondo parametro della funzione async un oggetto con:

| Metodo / proprietà        | Scopo                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `dispatch`                | Puoi chiamare altre azioni redux                            |
| `getState`                | Accesso a tutto lo stato globale                            |
| `rejectWithValue(value)`  | Permette di rifiutare con un messaggio custom               |
| `fulfillWithValue(value)` | Permette di forzare il successo con un valore modificato    |
| `extra`                   | Parametri extra passati da `thunkExtraArgument` nello store |

---

#  Esempio avanzato: chaining + notifica

```ts
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user: { id: number; patch: any }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/users/${user.id}`, user.patch);

      //  Middleware: dispatch side effect
      dispatch(showNotification({ type: 'success', message: 'Utente aggiornato!' }));

      //  Middleware: forza il refetch della lista utenti
      dispatch(fetchUsers());

      return res.data;
    } catch (err: any) {
      dispatch(showNotification({ type: 'error', message: 'Errore aggiornamento' }));
      return rejectWithValue(err.response?.data || 'Errore imprevisto');
    }
  }
);
```

---

# Esempio: token injection con `getState()`

```ts
export const fetchSecureData = createAsyncThunk(
  'data/secure',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.get('/api/secure-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Accesso negato');
    }
  }
);
```

---

# Best practice per middleware nei thunk

| Obiettivo                   | Come farlo nel thunk                         |
| --------------------------- | -------------------------------------------- |
| Logging interno             | `console.log(...)` in fase di debug          |
| Bloccare chiamate superflue | Condizione su `getState()`                   |
| Chainare altre azioni Redux | Usa `dispatch()` dopo la chiamata principale |
| Personalizzare errori       | Usa `rejectWithValue()`                      |
| Aggiornare altri slice      | Chiama `dispatch(slice.actions.setX(...))`   |
| Forzare refresh dati        | Dispatcha un’altra `createAsyncThunk()`      |

---

## Vuoi un middleware completamente separato?

Puoi anche **estrarre la logica personalizzata in una funzione separata** e chiamarla all’interno del thunk per modularità:

```ts
async function checkCacheBeforeFetch(id: number, getState: () => RootState) {
  const state = getState();
  if (state.users.entities[id]) {
    throw new Error('Già caricato');
  }
}

export const fetchUser = createAsyncThunk(
  'users/fetch',
  async (id: number, thunkAPI) => {
    await checkCacheBeforeFetch(id, thunkAPI.getState);
    const res = await axios.get(`/api/users/${id}`);
    return res.data;
  }
);
```

---

##  In sintesi

Un thunk in Redux Toolkit è **molto più di un semplice fetcher**:

* Può contenere **middleware personalizzati**
* Può decidere se chiamare il server o no
* Può **orchestrare più slice** e generare side-effect
* È ideale quando React Query non basta o se vuoi **controllo completo**

---


























### Lazy Loading in React – Guida Approfondita

**Lazy loading** (caricamento “pigro”) è una tecnica di ottimizzazione che consiste nel **caricare risorse solo quando servono**, invece di includerle tutte nel bundle iniziale. In React, viene comunemente usata per:

* Componenti secondari o non immediatamente visibili
* Pagine di una Single Page Application (SPA)
* Moduli pesanti, come dashboard o strumenti di amministrazione

---

## 1. Perché usare il lazy loading

Caricare tutto il codice dell’app all’avvio porta a:

* Tempi di caricamento più lunghi (time-to-interactive)
* Esperienza utente peggiore, specialmente su dispositivi lenti
* Maggiore uso di memoria e CPU al primo render

Con il lazy loading, l’app carica solo ciò che serve all’inizio e scarica in rete altri componenti solo quando l’utente ne ha bisogno.

---

## 2. Come funziona in React

React fornisce due strumenti principali per implementare il lazy loading:

* `React.lazy()` – per definire componenti caricati in modo asincrono
* `<Suspense>` – per mostrare un fallback mentre il componente viene caricato

### Sintassi base

```tsx
import React, { Suspense } from 'react';

// Lazy import di una pagina o componente
const SettingsPage = React.lazy(() => import('./SettingsPage'));

function App() {
  return (
    <div>
      {/* Carica SettingsPage solo se l’utente la apre */}
      <Suspense fallback={<div>Caricamento...</div>}>
        <SettingsPage />
      </Suspense>
    </div>
  );
}
```

---

## 3. Dove applicarlo

### a. Routing dinamico

In un’app con `react-router-dom`:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const HomePage = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Caricamento...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

Così `Dashboard` verrà caricato **solo** se l’utente visita la pagina corrispondente.

### b. Componenti secondari

Esempio: modale, carosello, tool di gestione avanzata

```tsx
const ChartModal = React.lazy(() => import('./ChartModal'));

{showChart && (
  <Suspense fallback={<p>Caricamento grafico...</p>}>
    <ChartModal />
  </Suspense>
)}
```

---

## 4. Come viene gestito il codice a livello di bundle

Quando usi `React.lazy`, Webpack (o Vite) crea un **chunk separato** per ogni componente lazy.

Esempio:

* `main.js` contiene la parte principale dell’app
* `Dashboard.js` viene creato come chunk a parte
* Viene scaricato in rete solo quando richiesto

---

## 5. Differenza tra `import()` e `React.lazy()`

* `import()` è una funzione nativa JavaScript per il caricamento dinamico di moduli
* `React.lazy()` è un wrapper che usa `import()` per caricare componenti React in modo asincrono

```ts
// Non React-specific
import('./analytics.js').then((mod) => mod.trackUser());

// React-specific
const LazyComponent = React.lazy(() => import('./MyComponent'));
```

---

## 6. Limitazioni di React.lazy()

* Funziona solo per **componenti di default export**
* Richiede l’uso di **<Suspense>** per fallback
* Non si integra automaticamente con fetch dei dati (vedi React Query + Suspense per soluzioni avanzate)

---

## 7. Best practice

| Obiettivo                        | Suggerimento tecnico                                  |
| -------------------------------- | ----------------------------------------------------- |
| Separare codice in moduli logici | Import dinamico solo dei componenti che servono       |
| Non spezzare eccessivamente      | Evita decine di lazy componenti che causano flashing  |
| Fornire fallback UX adeguato     | Usa `fallback` semplice ma coerente con la UI         |
| Lazy solo quando necessario      | I componenti critici devono stare nel bundle iniziale |
| Combina con code splitting       | Usa Webpack o Vite per generare chunk intelligenti    |

---
































### Lazy Loading delle rotte in React: concetto e implicazioni professionali

Nel contesto di un'applicazione React con routing (tipicamente gestito da `react-router-dom`), il **lazy loading delle rotte** è una tecnica che consente di **demandare il caricamento del codice relativo a una determinata pagina o vista solo nel momento in cui l'utente vi accede**. Ciò migliora significativamente i tempi di caricamento iniziali dell'applicazione (`Time To Interactive`), soprattutto in applicazioni di grandi dimensioni.

---

## 1. Comportamento predefinito delle rotte

Se i componenti associati alle rotte vengono importati con `import` statico:

```tsx
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
```

React (tramite Webpack, Vite o un altro bundler) include **tutti questi componenti nel bundle iniziale**. Questo significa che:

* Anche se l’utente visita solo la rotta `/`, il codice di tutte le altre pagine è comunque scaricato e incluso.
* Non si beneficia del code splitting per singola rotta.

---

## 2. Lazy loading con `React.lazy()`

Per abilitare il caricamento asincrono delle rotte, è necessario utilizzare `React.lazy()` in combinazione con `<Suspense>`:

```tsx
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function AppRoutes() {
  return (
    <Suspense fallback={<p>Caricamento...</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

Con questa struttura:

* Il bundle iniziale contiene solo ciò che è necessario per renderizzare il contenuto richiesto dall’utente al primo caricamento.
* Ogni componente associato a una rotta viene scaricato separatamente e in modo asincrono nel momento in cui il browser deve effettivamente renderizzarlo.

---

## 3. Ruolo di `<Suspense>`

`<Suspense>` è un componente React che permette di specificare un contenuto temporaneo (`fallback`) da mostrare mentre il componente figlio viene caricato. È obbligatorio quando si usa `React.lazy`.

```tsx
<Suspense fallback={<p>Caricamento...</p>}>
  <Routes>...</Routes>
</Suspense>
```

Senza `<Suspense>`, l’uso di `React.lazy()` genera un errore a runtime.

---

## 4. Implicazioni per l’architettura dell’applicazione

Utilizzare `React.lazy()` per le rotte principali consente:

* Di separare logicamente il codice per ogni vista
* Di ridurre il bundle iniziale
* Di migliorare l’esperienza utente nei primi secondi di utilizzo
* Di applicare facilmente strategie avanzate di ottimizzazione come il preloading dinamico (anticipare il caricamento di una rotta su `hover` o `focus`)

---

## 5. Considerazioni professionali

* Il lazy loading delle rotte deve essere bilanciato: **non è sempre vantaggioso applicarlo indiscriminatamente**. Ad esempio, in alcune applicazioni SPA molto semplici, il vantaggio è trascurabile rispetto alla complessità introdotta.
* È buona prassi limitare il numero di chunk secondari: **troppe dipendenze dinamiche possono frammentare eccessivamente l’applicazione**, generando troppi piccoli file da caricare.
* Il fallback di `<Suspense>` dovrebbe essere **adeguato al contesto visivo dell'app** e mantenere coerenza con l’interfaccia utente.
* In ambienti SSR (server-side rendering), `React.lazy()` ha limitazioni e richiede soluzioni alternative come `@loadable/component`.

---


























### Ottimizzare liste lunghe in React con `react-window` e virtualizzazione

Quando un componente React deve renderizzare **una lista molto lunga di elementi** (centinaia o migliaia), anche se ciascun item è semplice, il costo complessivo in termini di **DOM nodes**, **layout**, e **re-render** può diventare significativo.

In questi casi si applica una tecnica chiamata **virtualizzazione della lista**, che consente di **renderizzare solo gli elementi effettivamente visibili nell’area di scroll**.

---

## 1. Problema delle liste non ottimizzate

### Esempio classico:

```tsx
<ul>
  {items.map(item => (
    <li key={item.id}>{item.label}</li>
  ))}
</ul>
```

Se `items` contiene 10.000 elementi, React genererà **10.000 nodi nel DOM**, anche se solo 20–30 sono visibili alla volta. Questo provoca:

* Tempo di render molto alto
* Memoria consumata inutilmente
* Scroll lento o a scatti (jitter, lag)

---

## 2. Soluzione: virtualizzazione con `react-window`

[`react-window`](https://github.com/bvaughn/react-window) è una libreria mantenuta dallo stesso autore di React DevTools. È progettata per essere:

* Leggera
* Veloce
* Estremamente semplice da usare

### Concetto chiave:

Renderizza **solo gli elementi visibili nel viewport** e **alcuni in anticipo** per offrire uno scroll fluido.

---

## 3. Esempio completo con `FixedSizeList`

```tsx
import { FixedSizeList as List } from 'react-window';

const items = new Array(10000).fill(null).map((_, i) => ({
  id: i,
  label: `Elemento #${i + 1}`,
}));

function Row({ index, style }: { index: number; style: React.CSSProperties }) {
  const item = items[index];
  return (
    <div style={style}>
      {item.label}
    </div>
  );
}

function VirtualizedList() {
  return (
    <List
      height={400}         // altezza visibile del container
      itemCount={items.length}
      itemSize={35}        // altezza fissa per riga
      width={'100%'}
    >
      {Row}
    </List>
  );
}
```

---

## 4. Come funziona internamente

* `react-window` calcola **quali elementi devono essere renderizzati** in base alla posizione dello scroll.
* Usa un **div contenitore con altezza totale fittizia** (es. 10.000 × 35px = 350.000px).
* I `div` interni sono posizionati assolutamente in base alla riga visibile.
* React renderizza solo una **finestra virtuale** di elementi (es. 30), ignorando il resto.

---

## 5. Parametri fondamentali

| Proprietà   | Descrizione                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `height`    | Altezza visibile della lista (viewport)                                         |
| `itemCount` | Numero totale di righe                                                          |
| `itemSize`  | Altezza fissa per ciascun item (usare `VariableSizeList` per altezze dinamiche) |
| `width`     | Larghezza visibile (può essere numerica o `100%`)                               |

---

## 6. Alternative: `react-virtual`, `Virtuoso`, `tanstack/virtual`

* **`react-window`** è stabile e molto diffuso, ma poco flessibile per casi dinamici.
* **`react-virtual`** (da TanStack, autore di React Query) offre maggiore controllo, supporta griglie e layout dinamici.
* **`Virtuoso`** è ancora più avanzato e supporta infinite scroll bidirezionali, gruppi, sticky headers.

---

## 7. Best practice

* Evita di usare `map()` direttamente su liste molto grandi.
* Usa `react-window` o una sua alternativa per qualsiasi lista superiore a 100 elementi se il contenuto è pesante.
* Non usare `useMemo` per tentare di ottimizzare la lista se puoi usare virtualizzazione: è inefficiente e non scala.
* Evita contenitori con overflow complessi o layout instabili: la virtualizzazione funziona bene con layout prevedibili.

---

## 8. Quando NON serve virtualizzare

* Liste sotto i 50–100 elementi con contenuto leggero
* Componenti dove ogni elemento richiede molte interazioni complesse (focus, drag\&drop), che la virtualizzazione può complicare
* Se il tuo problema è **caricamento da rete**, non rendering: in quel caso usa pagination o lazy fetch, non virtualizzazione

---

## Conclusione

La virtualizzazione è una strategia fondamentale per **ottimizzare la UI nelle applicazioni React che presentano liste di grandi dimensioni**.
Strumenti come `react-window` permettono di implementarla con semplicità, mantenendo un’ottima performance anche con migliaia di elementi, evitando costosi re-render e congestione del DOM.






























### Lazy Fetch in React – Spiegazione Professionale

**Lazy fetch** è una tecnica in cui il caricamento dei dati da un’API avviene **solo quando necessario**, piuttosto che in automatico all’avvio del componente o dell’applicazione. È una strategia utile per migliorare:

* le performance percepite (carico solo se richiesto),
* l’efficienza della rete (evito richieste inutili),
* l’esperienza utente (solo dati pertinenti).

---

## 1. Obiettivo del lazy fetch

Caricare i dati **non appena l’utente compie un’azione esplicita o implicita**, ad esempio:

* clic su un bottone,
* apertura di una sezione o tab,
* scroll verso una certa area,
* input con ricerca.

---

## 2. Lazy fetch senza librerie esterne

Il lazy fetch può essere implementato **con `useState`, `useEffect`, e `fetch`/`axios`**, senza alcuna integrazione complessa.

---

### Esempio: fetch attivato da un bottone

```tsx
import React, { useState, useEffect } from 'react';

function LazyUsers() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;

    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, [shouldFetch]);

  return (
    <div>
      <button onClick={() => setShouldFetch(true)}>
        Carica utenti
      </button>

      {loading && <p>Caricamento...</p>}

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. Caricamento su azione implicita

### a. Lazy fetch su focus

```tsx
<input
  placeholder="Cerca utenti..."
  onFocus={() => setShouldFetch(true)}
/>
```

### b. Lazy fetch su scroll (semplificato)

```tsx
useEffect(() => {
  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom) setShouldFetch(true);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## 4. Best practice nel lazy fetch

| Obiettivo                            | Comportamento consigliato            |
| ------------------------------------ | ------------------------------------ |
| Evitare richieste duplicate          | Usa un flag per fetch eseguito       |
| Evitare fetch su render iniziale     | Controlla `useEffect` con condizione |
| Rendere visibile il caricamento      | Gestisci `loading` per UX chiara     |
| Gestire errori di rete               | Inserisci catch e stato `error`      |
| Pulire i dati su dismount (se serve) | Usa cleanup in `useEffect`           |

---

## 5. Lazy fetch vs fetch immediato

| Strategia           | Vantaggi                                  | Svantaggi                            |
| ------------------- | ----------------------------------------- | ------------------------------------ |
| **Lazy fetch**      | Performance ottimizzata, rete più leggera | Latenza al primo accesso, più logica |
| **Fetch immediato** | Semplicità, UI subito pronta              | Carico di rete, dati inutilizzati    |

---

## 6. Quando usare lazy fetch

Usa lazy fetch quando:

* la risorsa non è sempre necessaria (es. pannelli collapsabili, modali)
* l’utente può non interagire mai con quella sezione
* i dati sono pesanti o lenti da scaricare
* vuoi migliorare performance e gestire traffico condizionato

Evita lazy fetch per:

* dati essenziali all’avvio
* layout critici che devono essere già popolati
* SEO (se non gestito dal server)

---

## Conclusione

Il **lazy fetch** è una strategia semplice ma estremamente efficace per rendere le applicazioni React **più leggere, performanti e reattive**, soprattutto quando il contenuto dipende dalle azioni dell’utente. Con pochi hook (`useState`, `useEffect`) è possibile gestirlo in modo preciso, anche senza librerie esterne.


































---

##  Consegnare alla classe – Traccia esercizio:

### **Progetto React TypeScript: Pokémon Directory con ottimizzazioni professionali**

---

### Obiettivo

Realizzare un’applicazione web React che interroga l’API ufficiale Pokémon ([https://pokeapi.co](https://pokeapi.co)) e visualizza la lista dei Pokémon in pagine ottimizzate:

* La navigazione tra pagine avviene tramite offset
* Ogni pagina mostra un numero sufficiente di righe da giustificare l’uso di `react-window`
* La lista è ottimizzata in performance e UX con lazy loading, caching e virtualizzazione

---

###  Tecnologie e strumenti richiesti

* React + Vite + TypeScript
* Redux Toolkit (`createSlice`, `createAsyncThunk`)
* React Router DOM
* React Window (`FixedSizeList`)
* Axios

---

###  Requisiti funzionali

#### Visualizzazione Pokémon

* Mostra 10 Pokémon per pagina
* Ogni elemento mostra almeno il nome e l’ID
* Ogni pagina viene virtualizzata con `react-window`

#### Navigazione paginata

* Usa l’endpoint API con offset:
  `https://pokeapi.co/api/v2/pokemon?offset=0&limit=50`
* Navigazione avanti/indietro
* Carica automaticamente la pagina successiva e precedente

#### Cache limitata (avanzato)

* Mantieni massimo **3 pagine in memoria**

  * Quando si raggiunge la quarta, elimina la più vecchia
  * Puoi implementare con un oggetto `Record<number, PageData>` e logica LRU (Least Recently Used) semplificata

#### Ottimizzazione caricamento

* Lazy loading dei componenti via `React.lazy()` e `<Suspense>`
* Virtualizzazione lista con `react-window`
* Usa `useCallback` e `useMemo` dove necessario
* Evita fetch duplicati: non rifare fetch se la pagina è già in cache

---










