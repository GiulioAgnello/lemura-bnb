import AgendaClient from '@/components/AgendaClient';

// Pagina privata collaboratori — NON indicizzare.
export const metadata = {
  title: 'Agenda',
  robots: { index: false, follow: false, nocache: true },
};

// Su mobile: layout "statico", niente zoom da pinch o doppio tap.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Sempre dinamica: nessuna cache statica di dati prenotazioni.
export const dynamic = 'force-dynamic';

export default function AgendaPage() {
  return <AgendaClient />;
}
