import AgendaClient from '@/components/AgendaClient';

// Pagina privata collaboratori — NON indicizzare.
export const metadata = {
  title: 'Agenda',
  robots: { index: false, follow: false, nocache: true },
};

// Sempre dinamica: nessuna cache statica di dati prenotazioni.
export const dynamic = 'force-dynamic';

export default function AgendaPage() {
  return <AgendaClient />;
}
