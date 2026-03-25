# Le Mura degli Angeli — B&B nel Salento

Sito web con **React + Vite + Bootstrap** (frontend) e **WordPress headless** (backend/CMS).

## Struttura

```
lemura-bnb/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navbar con bottone "Prenota ora"
│   │   ├── Footer.jsx          # Footer con contatti e credit
│   │   └── Loader.jsx          # Animazione caricamento
│   ├── hooks/
│   │   └── useWP.js            # Hook generico per fetch da WordPress
│   ├── lib/
│   │   └── wordpress.js        # Client API WordPress (camere, esperienze, recensioni...)
│   ├── pages/
│   │   ├── Homepage.jsx        # Hero + intro + camere + recensioni + CTA booking
│   │   ├── Camere.jsx          # Lista camere con prezzi e dettagli
│   │   ├── CameraDetail.jsx    # Singola camera con gallery e prenotazione
│   │   ├── Galleria.jsx        # Griglia foto con lightbox
│   │   ├── Esperienze.jsx      # Cosa fare nel Salento
│   │   ├── Recensioni.jsx      # Tutte le testimonianze con rating
│   │   └── Contatti.jsx        # Form disponibilità + mappa + WhatsApp + booking links
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Stili (palette Salento: calce, pietra leccese, ulivi)
├── wordpress-setup/
│   ├── functions.php           # CPT, ACF fields, CORS
│   └── SETUP.md                # Guida WordPress passo-passo
├── .env                        # URL API + link Booking/Airbnb
└── package.json
```

## Quick Start

```bash
npm install
npm run dev     # → http://localhost:3000
```

Il sito funziona subito con contenuti placeholder.
Quando colleghi WordPress, i placeholder vengono sostituiti automaticamente.

## Pagine

| Pagina | Contenuto da WordPress |
|--------|----------------------|
| Home | Hero, intro, servizi (ACF pagina "home") + camere + recensioni |
| Camere | CPT "camera" con prezzo, ospiti, superficie, gallery |
| Camera singola | Dettaglio + gallery + link prenotazione |
| Galleria | Gallery ACF dalla pagina "galleria" + lightbox |
| Esperienze | CPT "esperienza" con distanza e tipologia |
| Recensioni | CPT "recensione" con stelle, provenienza, piattaforma |
| Contatti | Form disponibilità + info ACF + mappa Google + link Booking/Airbnb/WhatsApp |
