# Installazione Plugin — Le Mura degli Angeli API

## Requisiti

- WordPress installato su Local (o hosting)
- Plugin **Advanced Custom Fields (ACF) — versione gratuita** installato e attivo
- Permalink impostati su "Nome post" (`/wp-admin/options-permalink.php`)

---

## 1. Copia il plugin

Copia la cartella `lemura-api` in:

```
C:\Users\agnel\Local Sites\lemuraworkspace\app\public\wp-content\plugins\
```

Risultato:
```
wp-content/
  plugins/
    lemura-api/
      lemura-api.php   ← deve stare qui
```

## 2. Attiva il plugin

Vai su **Plugin > Plugin installati** nell'admin WordPress e attiva **Le Mura degli Angeli — API**.

## 3. Installa ACF (se non l'hai)

Vai su **Plugin > Aggiungi nuovo**, cerca **Advanced Custom Fields**, installalo e attivalo.

---

## 4. Crea i contenuti nell'admin

Vai su **Alloggi > Aggiungi alloggio** e crea i seguenti post:

### 🏠 Sternatia — Casa intera

| Campo | Valore |
|-------|--------|
| Titolo | `Casa Sternatia` (o come preferisci) |
| Struttura | `Sternatia — Casa intera` |
| Tipo | `Casa intera` |
| Prezzo per notte | es. `180` |
| Superficie | es. `150` |
| Servizi | aggiungi riga per ogni servizio (es. Wi-Fi, Cucina, Parcheggio...) |
| Check-in | es. `15:00` |
| Check-out | es. `10:00` |
| Immagine in evidenza | foto principale |
| Galleria | foto aggiuntive |

---

### 🛏 Corigliano — Camera 1

| Campo | Valore |
|-------|--------|
| Titolo | `Camera 1 — ...` |
| Struttura | `Corigliano — B&B` |
| Tipo | `Camera` |
| Prezzo per notte | es. `90` |
| Superficie | es. `25` |
| Servizi | AC, Wi-Fi, ... |
| Check-in | es. `14:00` |
| Check-out | es. `11:00` |

### 🛏 Corigliano — Camera 2

Uguale alla Camera 1, cambia titolo e dati.

### 🧖 Corigliano — Spa

| Campo | Valore |
|-------|--------|
| Titolo | `Spa` |
| Struttura | `Corigliano — B&B` |
| Tipo | `Spa / Area benessere` |
| Prezzo per notte | lascia vuoto |
| Servizi | Idromassaggio, Sauna, ... |

> **Ordine camere**: Usa il campo "Ordine" (Order) in fondo alla pagina di modifica per stabilire l'ordine in cui appaiono le camere (Camera 1 = 1, Camera 2 = 2, Spa = 3).

---

## 5. Testa le API

Apri il browser e verifica:

```
http://lemura-crm.local/wp-json/lemura-crm/v1/sternatia
http://lemura-crm.local/wp-json/lemura-crm/v1/corigliano
http://lemura-crm.local/wp-json/lemura-crm/v1/strutture
```

Devono restituire JSON con i dati inseriti.

---

## Struttura risposta API

### `/sternatia`
```json
{
  "id": 5,
  "title": "Casa Sternatia",
  "description": "...",
  "struttura": "sternatia",
  "tipo": "casa_intera",
  "prezzo_notte": "180",
  "superficie": "150",
  "servizi": [
    { "nome": "Wi-Fi gratuito", "icona": "wifi" },
    { "nome": "Cucina attrezzata", "icona": "kitchen" }
  ],
  "checkin_time": "15:00",
  "checkout_time": "10:00",
  "featured_image": { "url": "...", "alt": "..." },
  "gallery": [...]
}
```

### `/corigliano`
```json
{
  "rooms": [
    {
      "id": 6,
      "title": "Camera 1",
      "tipo": "camera",
      "prezzo_notte": "90",
      "superficie": "25",
      "servizi": [...],
      "checkin_time": "14:00",
      "checkout_time": "11:00",
      "featured_image": {...},
      "gallery": [...]
    },
    { ... }
  ],
  "spa": {
    "id": 8,
    "title": "Spa",
    "tipo": "spa",
    "servizi": [...],
    "featured_image": {...},
    "gallery": [...]
  }
}
```

---

## Funzioni disponibili nel frontend (wordpress.js)

```js
import { getSternatia, getCorigliano, getStrutture } from '../lib/wordpress';

// Dati solo Sternatia
const sternatia = await getSternatia();

// Dati solo Corigliano
const { rooms, spa } = await getCorigliano();

// Entrambe in un fetch
const { sternatia, corigliano } = await getStrutture();
```
