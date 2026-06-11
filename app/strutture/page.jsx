import Link from 'next/link';
import { getStrutture } from '@/lib/wordpress';

export const revalidate = 3600;

export const metadata = {
  title: 'Le Nostre Strutture — B&B e Casa Vacanze nel Salento',
  description:
    "Due esperienze nel cuore del Salento: il B&B a Corigliano d'Otranto con spa in una dimora storica medievale, e la casa intera a Sternatia nella Grecìa Salentina.",
  openGraph: {
    title: "Le Mura degli Angeli — B&B Corigliano d'Otranto e Casa Sternatia",
    description: "Scopri le nostre strutture nel Salento: dimora storica a Corigliano d'Otranto e casa vacanze a Sternatia.",
  },
};

const PLACEHOLDER = {
  corigliano: {
    nome: "Corigliano d'Otranto", tipo: 'Due Camere',
    descrizione: "Nel cuore del borgo medievale di Corigliano d'Otranto, due camere ricavate dal restauro di un'antica dimora. Volte in pietra leccese, arredi d'epoca e comfort moderni si fondono in un'atmosfera unica nel Salento.",
    ospiti: '2 per camera',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
  sternatia: {
    nome: 'Sternatia', tipo: 'Casa Intera',
    descrizione: "Un'intera dimora nel suggestivo borgo di Sternatia, uno dei paesi della Grecìa Salentina. Spazi ampi, cortile privato e l'atmosfera autentica di un villaggio dove ancora si parla il griko.",
    ospiti: 'fino a 6',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  },
};

function normalizeStrutture(apiData) {
  if (!apiData) return [{ slug: 'corigliano', ...PLACEHOLDER.corigliano }, { slug: 'sternatia', ...PLACEHOLDER.sternatia }];
  return [
    { slug: 'corigliano', ...PLACEHOLDER.corigliano, image: apiData.corigliano?.rooms?.[0]?.featured_image || PLACEHOLDER.corigliano.image },
    { slug: 'sternatia', ...PLACEHOLDER.sternatia, nome: apiData.sternatia?.title || PLACEHOLDER.sternatia.nome, descrizione: apiData.sternatia?.description || PLACEHOLDER.sternatia.descrizione, image: apiData.sternatia?.featured_image || PLACEHOLDER.sternatia.image },
  ];
}

export default async function Strutture() {
  const apiData = await getStrutture();
  const strutture = normalizeStrutture(apiData);

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Ospitalità</span>
          <h1 className="section-title">Le nostre strutture nel Salento</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: '0 auto' }}>
            Due esperienze diverse nel cuore del Salento: camere d'autore a Corigliano d'Otranto e una casa intera a Sternatia, tra storia e autenticità.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {strutture.map((s, i) => (
            <div
              key={s.slug}
              className="row align-items-center g-5 mb-5 pb-5 fade-in"
              style={{ borderBottom: i < strutture.length - 1 ? '1px solid var(--color-border)' : 'none', animationDelay: `${i * 0.12}s` }}
            >
              <div className={`col-lg-6 ${i % 2 !== 0 ? 'order-lg-2' : ''}`}>
                <Link href={`/strutture/${s.slug}`}>
                  <img src={s.image} alt={`${s.nome} — ${s.tipo} Salento`} className="img-bnb w-100" style={{ aspectRatio: '16/11', objectFit: 'cover' }} />
                </Link>
              </div>
              <div className={`col-lg-5 ${i % 2 !== 0 ? 'order-lg-1' : 'offset-lg-1'}`}>
                <span className="section-label">{s.tipo}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', marginTop: '0.5rem' }}>
                  <Link href={`/strutture/${s.slug}`} className="text-decoration-none" style={{ color: 'var(--color-text)' }}>{s.nome}</Link>
                </h2>
                <hr className="section-divider" />
                <div className="d-flex flex-wrap gap-4 mb-3" style={{ fontSize: '0.9rem' }}>
                  <div><small className="text-muted d-block">Ospiti</small><strong>{s.ospiti}</strong></div>
                  <div><small className="text-muted d-block">Tipo</small><strong>{s.tipo}</strong></div>
                </div>
                <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>{s.descrizione}</p>
                <Link href={`/strutture/${s.slug}`} className="btn-bnb" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Scopri di più</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
