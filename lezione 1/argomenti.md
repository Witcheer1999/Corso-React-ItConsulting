🧪 Modulo 2: Testing in React (8 ore)
🔹 Blocco 1 (1h): Introduzione e Fondamenti del Testing in React

    Perché testare? Tipologie di test (unit, integration, e2e) con focus su componenti React

    Confronto con l’approccio Angular (Karma, Jasmine, TestBed)

    Differenze tra Jest, React Testing Library (RTL), Cypress, Playwright

    Principi di testing “user-centric” promossi da RTL

    Setup ambiente di testing con Vite / Create React App

🔹 Blocco 2 (1h): Jest – Il motore di test

    Introduzione a Jest: caratteristiche principali

    Scrivere un primo test: describe, it/test, expect

    Coverage, watch mode, verbose

    Testing sincrono e asincrono con async/await e done

    Confronto con Jasmine e TS Angular test suite

🔹 Blocco 3 (1.5h): React Testing Library – Concetti chiave

    Filosofia di RTL: testare come l’utente interagisce

    Selezione elementi (getBy, queryBy, findBy)

    Best practice: evitare container, instance, act

    Simulare eventi utente (fireEvent, userEvent)

    Gestione del DOM virtuale: screen, render, cleanup

🔹 Blocco 4 (1.5h): Testing dei componenti

    Rendering test (visibilità, contenuto testuale, classi)

    Snapshot testing: quando usarlo e quando evitarlo

    Test comportamentali: click, input, effetti visivi

    Test su componenti con props condizionali

    Test con stato locale e hooks (useState, useEffect)

    Componenti memoizzati e pure components

🔹 Blocco 5 (1h): Mocking avanzato

    Mocking di moduli con jest.mock()

    Mocking API/fetch con msw o jest.fn()

    Mock di funzioni di callback e timer (jest.fn(), jest.spyOn)

    Mocking router (react-router-dom) e Redux store

    Esercizio: testare un componente con Redux e navigazione

🔹 Blocco 6 (1h): Testing di componenti complessi e custom hooks

    Testing di componenti con:

        useContext (es. autenticazione, tema)

        useReducer o useImmer

        Custom hooks (renderHook da @testing-library/react-hooks)

    Testing di form dinamici e validation

    Testing modali, tooltip, dropdown

🔹 Blocco 7 (30 min): Integrazione in pipeline CI/CD

    Scrivere test robusti e stabili (flaky test e timeout)

    Coverage report (jest --coverage)

    Esempi di configurazione GitHub Actions / GitLab CI per Jest

    Strategie di testing PR e branch coverage

    Parallelizzazione dei test

🔹 Blocco 8 (30 min): Esercizio finale guidato

    Sviluppo di un componente da zero + test completo

        Componente con stato e props

        Mock API

        Snapshot + test comportamentale

        Validazione visuale con screen.getBy*

    Discussione in classe e revisione collettiva




https://github.com/alan2207/bulletproof-react

https://github.com/gothinkster/realworld


https://github.com/angelguzmaning/ts-redux-react-realworld-example-app?tab=readme-ov-file