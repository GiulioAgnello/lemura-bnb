import Link from 'next/link';
import { getStrutture } from '@/lib/wordpress';
import BookingButtonWithModal from '@/components/BookingButtonWithModal';

export const revalidate = 3600;

export const metadata = {
  title: 'B&B e Dimora Antica nel Salento | Le Mura degli Angeli',
  description:
    "Soggiorna in un'antica dimora nel cuore del Salento. Bed & Breakfast a Corigliano d'Otranto e casa vacanze a Sternatia, nella Grecìa Salentina. Pietra leccese, ulivi e ospitalità autentica.",
  keywords: ['bed and breakfast salento', 'dimora antica salento', 'b&b corigliano otranto', 'casa vacanze sternatia', 'affitto salento', 'b&b puglia'],
  openGraph: {
    title: 'Le Mura degli Angeli — B&B e Dimora Antica nel Salento',
    description: "Un'antica dimora pugliese tra Corigliano d'Otranto e Sternatia. B&B con spa e casa intera nel cuore del Salento.",
    images: [{ url: '/IMG_5289.JPEG', width: 1200, height: 800, alt: 'Le Mura degli Angeli — Dimora Storica nel Salento' }],
  },
};

const schemaLodging = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  name: 'Le Mura degli Angeli',
  description: "Antica dimora nel Salento con B&B a Corigliano d'Otranto e casa vacanze a Sternatia. Ospitalità autentica nella Grecìa Salentina.",
  url: 'https://www.lemuradegliangeli.it',
  telephone: '+393271208496',
  email: 'lemuradegliangeli@yahoo.com',
  priceRange: '€€',
  image: 'https://www.lemuradegliangeli.it/IMG_5289.JPEG',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Giudeca 28',
    addressLocality: 'Sternatia',
    addressRegion: 'Puglia',
    postalCode: '73010',
    addressCountry: 'IT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 40.2208, longitude: 18.2271 },
  starRating: { '@type': 'Rating', ratingValue: '5' },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi gratuito', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Spa', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Parcheggio gratuito', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Cortile privato', value: true },
  ],
  sameAs: ['https://www.airbnb.it'],
};

function normalizeStrutture(apiData) {
  const PLACEHOLDER = [
    { slug: 'corigliano', nome: "Corigliano d'Otranto", tipo: 'Due Camere', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
    { slug: 'sternatia', nome: 'Sternatia', tipo: 'Casa Intera', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
  ];
  if (!apiData) return PLACEHOLDER;
  return [
    { slug: 'corigliano', nome: "Corigliano d'Otranto", tipo: 'Due Camere', image: apiData.corigliano?.rooms?.[0]?.featured_image || PLACEHOLDER[0].image },
    { slug: 'sternatia', nome: apiData.sternatia?.title || 'Sternatia', tipo: 'Casa Intera', image: apiData.sternatia?.featured_image || PLACEHOLDER[1].image },
  ];
}

export default async function Homepage() {
  const apiData = await getStrutture();
  const strutture = normalizeStrutture(apiData);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLodging) }} />

      {/* ═══════ HERO ═══════ */}
      <section
        className="position-relative"
        style={{
          background: `linear-gradient(to bottom, rgba(44,36,24,0.3), rgba(44,36,24,0.6)), url("/IMG_5289.JPEG") center/cover no-repeat`,
          minHeight: '90vh', display: 'flex', alignItems: 'center',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 fade-in">
              <span className="section-label" style={{ color: 'rgba(255,255,255,0.65)' }}>B&B nel Salento</span>
              <h1 className="mb-4" style={{ color: '#fff', fontWeight: 500 }}>Benvenuti a Le Mura degli Angeli</h1>
              <p className="mb-4" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: 580 }}>
                Un rifugio di pace nel cuore del Salento, dove la storia incontra l'ospitalità autentica. Tra ulivi secolari, pietra leccese e il calore del sud.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <BookingButtonWithModal label="Prenota il soggiorno" className="btn-bnb btn-bnb-accent" />
                <Link href="/strutture" className="btn-bnb btn-bnb-white">Scopri le strutture</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ INTRO ═══════ */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 fade-in">
              <img src="/2.jpg" alt="Dimora storica Le Mura degli Angeli nel Salento" className="img-bnb w-100" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            </div>
            <div className="col-lg-5 offset-lg-1 fade-in fade-in-d1">
              <span className="section-label">Chi siamo</span>
              <h2 className="section-title">La nostra storia</h2>
              <hr className="section-divider" />
              <p>
                Le Mura degli Angeli nasce dal restauro di un'antica dimora nel Salento, dove ogni pietra racconta secoli di storia. Abbiamo preservato l'autenticità dell'architettura pugliese, arricchendola con comfort moderni per offrirvi un soggiorno indimenticabile. Circondati da ulivi, a pochi chilometri dalle spiagge più belle del Salento e dal centro storico di Lecce, siamo il punto di partenza ideale per esplorare questa terra meravigliosa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STRUTTURE ═══════ */}
      <section className="section-padding" style={{ background: 'var(--color-bg-warm)' }}>
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">Le nostre strutture</span>
            <h2 className="section-title">Sternatia e Corigliano D'Otranto</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row g-4">
            {strutture.map((s) => (
              <div className="col-12 col-md-6" key={s.slug}>
                <Link href={`/strutture/${s.slug}`} className="text-decoration-none">
                  <div className="fade-in" style={{ overflow: 'hidden' }}>
                    <img src={s.image} alt={`${s.nome} — ${s.tipo} nel Salento`} className="img-bnb w-100" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
                    <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
                      <small className="section-label" style={{ display: 'block', marginBottom: '0.3rem' }}>{s.tipo}</small>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-text)' }}>{s.nome}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="section-padding text-center" style={{ background: 'var(--color-dark)', color: '#fff' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 fade-in">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Prenota il tuo soggiorno</span>
              <h2 style={{ color: '#fff', marginBottom: '1.25rem' }}>Vivi l'esperienza del Salento autentico</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>
                Contattaci per verificare la disponibilità o prenota direttamente tramite le piattaforme partner.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <BookingButtonWithModal label="Prenota subito" className="btn-bnb btn-bnb-accent" />
                <Link href="/contatti" className="btn-bnb btn-bnb-white">Richiedi informazioni</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
