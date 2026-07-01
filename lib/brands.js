/**
 * Brand delle strutture — Le Mura degli Angeli
 *
 * Ogni struttura ha nome e logo propri. L'header del sito li usa per
 * mostrare dinamicamente in quale struttura ci si trova.
 *
 * - Navigazione generale        -> "Le Mura degli Angeli & Menima"
 * - Dettaglio Sternatia         -> "Le Mura degli Angeli"
 * - Dettaglio Corigliano/camere -> "Menima"
 */

// Brand mostrato di default (pagine non legate a una struttura specifica).
export const DEFAULT_BRAND = {
  name: 'Le Mura degli Angeli & Menima',
  logo: '/logo_no_background.png',
  href: '/',
};

// Brand per singola struttura (chiave = slug usato nelle route /strutture/[slug]).
export const STRUTTURA_BRANDS = {
  sternatia: {
    name: 'Le Mura degli Angeli',
    logo: '/logo_no_background.png',
    href: '/strutture/sternatia',
  },
  corigliano: {
    name: 'Menima',
    logo: '/logo-menima.png', // <-- salva qui il logo Menima (public/logo-menima.png)
    href: '/strutture/corigliano',
  },
};

/**
 * Restituisce il brand corretto in base al percorso corrente.
 * @param {string} pathname - il pathname attuale (es. da usePathname()).
 * @returns {{name: string, logo: string, href: string}}
 */
export function getBrandForPath(pathname) {
  if (!pathname) return DEFAULT_BRAND;

  // Dettaglio struttura: /strutture/<slug>
  const match = pathname.match(/^\/strutture\/([^/]+)/);
  if (match && STRUTTURA_BRANDS[match[1]]) {
    return STRUTTURA_BRANDS[match[1]];
  }

  // Le camere appartengono al B&B di Corigliano (Menima).
  if (pathname.startsWith('/camere/')) {
    return STRUTTURA_BRANDS.corigliano;
  }

  return DEFAULT_BRAND;
}
