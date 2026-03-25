# Setup WordPress — Le Mura degli Angeli

## 1. Installazione

Installa WordPress su un hosting (SiteGround, Hostinger, Serverplan).
Consiglio: `cms.lemuradegliangeli.com` come sottodominio.

## 2. Plugin obbligatori

| Plugin | Scopo |
|--------|-------|
| **Advanced Custom Fields** | Campi personalizzati (gratuito per iniziare) |
| **ACF to REST API** | Espone i campi ACF nelle REST API |

## 3. Configurazione

### 3.1 — Copia functions.php

Incolla il contenuto di `wordpress-setup/functions.php` nel functions.php
del tema attivo (oppure crea un plugin custom — vedi istruzioni nel file).

### 3.2 — Crea le pagine

Vai su **Pagine > Aggiungi** e crea:

| Titolo | Slug |
|--------|------|
| Home | `home` |
| Galleria | `galleria` |
| Contatti | `contatti` |

Compila i campi ACF che appaiono sotto l'editor.

### 3.3 — Aggiungi le camere

Vai su **Camere > Aggiungi camera**:
- Titolo: nome della camera (es: "Suite degli Ulivi")
- Editor: descrizione dettagliata
- Immagine in evidenza: foto principale
- Campi ACF: prezzo, ospiti, superficie, servizi, gallery foto

### 3.4 — Aggiungi le esperienze

Vai su **Esperienze > Aggiungi esperienza**:
- Titolo: nome del luogo/attività
- Estratto: breve descrizione
- Immagine in evidenza
- Campi ACF: distanza, tipologia

### 3.5 — Aggiungi le recensioni

Vai su **Recensioni > Aggiungi recensione**:
- Campi ACF: nome ospite, provenienza, stelle, testo, data, piattaforma

### 3.6 — Pagina Galleria

Vai su **Pagine > Galleria** e usa il campo ACF "Immagini galleria"
per caricare tutte le foto della struttura.

## 4. Test API

Verifica nel browser:

```
https://cms.tuosito.com/wp-json/wp/v2/pages?slug=home&acf_format=standard
https://cms.tuosito.com/wp-json/wp/v2/camera?_embed&acf_format=standard
https://cms.tuosito.com/wp-json/wp/v2/esperienza?_embed
https://cms.tuosito.com/wp-json/wp/v2/recensione?acf_format=standard
```

## 5. Collegamento frontend

Nel file `.env` del progetto React:
```
VITE_WP_API_URL=https://cms.tuosito.com/wp-json/wp/v2
VITE_BOOKING_URL=https://www.booking.com/hotel/it/le-mura-degli-angeli.html
VITE_AIRBNB_URL=https://www.airbnb.it/rooms/XXXXXXX
```
