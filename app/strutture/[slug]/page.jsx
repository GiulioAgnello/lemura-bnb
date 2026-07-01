import Link from 'next/link';
import { getCorigliano, getSternatia } from '@/lib/wordpress';
import BookingButtonWithModal from '@/components/BookingButtonWithModal';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ slug: 'sternatia' }, { slug: 'corigliano' }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === 'sternatia') return {
    title: "Sternatia — Casa Vacanze Intera nella Grecìa Salentina",
    description: "Affita l'intera dimora storica di Sternatia: cortile privato, 3 camere, cucina attrezzata, fino a 6 ospiti. Nella Grecìa Salentina, a 15 min da Lecce.",
    openGraph: { title: 'Sternatia — Casa Intera nel Salento | Le Mura degli Angeli', description: "Casa vacanze intera a Sternatia, borgo della Grecìa Salentina. Dimora storica con cortile privato e ulivi." },
  };
  return {
    title: "Menima — B&B in Dimora Storica a Corigliano d'Otranto",
    description: "Menima, B&B a Corigliano d'Otranto: due camere con soffitti a volta in pietra leccese, nel cuore del borgo medievale. Spa inclusa. A 40 min dal mare.",
    openGraph: { title: "Menima — B&B Corigliano d'Otranto | Le Mura degli Angeli", description: "Menima: due camere in un'antica dimora medievale a Corigliano d'Otranto, nel Salento. Volte in pietra, spa e colazione." },
  };
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || '#';

// ── Helpers ──

function normalizeCorigliano(data) {
  const PLACEHOLDER_ROOMS = [
    { id: 1, slug: 'suite-ulivi', title: 'Suite degli Ulivi', prezzo_notte: '120', ospiti_max: '2', superficie: '35 mq', servizi: 'Vista giardino, vasca idromassaggio, minibar', featured_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
    { id: 2, slug: 'camera-pietra', title: 'Camera della Pietra', prezzo_notte: '85', ospiti_max: '2', superficie: '22 mq', servizi: 'Volta a stella, pavimento originale in pietra', featured_image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80' },
  ];
  const rooms = (data?.rooms || []).map((r) => ({
    id: r.id, slug: r.slug || `camera-${r.id}`, title: r.title,
    prezzo_notte: r.prezzo_notte || '', ospiti_max: r.ospiti_massimi || '',
    superficie: r.superficie || '', servizi: r.servizi || '', featured_image: r.featured_image || '',
  }));
  return { rooms: rooms.length > 0 ? rooms : PLACEHOLDER_ROOMS };
}

function normalizeSternatia(data) {
  const PLACEHOLDER = {
    title: 'Sternatia', description: "Un'intera dimora nel suggestivo borgo di Sternatia, uno dei paesi della Grecìa Salentina. Spazi generosi su due livelli: soggiorno con camino, cucina attrezzata, tre camere da letto e un cortile privato all'ombra degli ulivi.",
    superficie: '120 mq', ospiti_max: '6',
    featured_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
  };
  if (!data) return PLACEHOLDER;
  return {
    title: data.title || PLACEHOLDER.title, description: data.description || PLACEHOLDER.description,
    prezzo_notte: data.prezzo_notte || '', superficie: data.superficie || PLACEHOLDER.superficie,
    ospiti_max: data.ospiti_massimi || PLACEHOLDER.ospiti_max, servizi: data.servizi || '',
    checkin_time: data.checkin_time || '', checkout_time: data.checkout_time || '',
    featured_image: data.featured_image || PLACEHOLDER.featured_image,
    gallery: Array.isArray(data.gallery) ? data.gallery : PLACEHOLDER.gallery,
  };
}

// ── Componente Corigliano ──

function CoriglianoDetail({ data }) {
  const schemaB2B = {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    name: "Menima — B&B a Corigliano d'Otranto (Le Mura degli Angeli)",
    description: "Menima, B&B in un'antica dimora medievale a Corigliano d'Otranto. Due camere con volte in pietra leccese e spa.",
    url: 'https://www.lemuradegliangeli.it/strutture/corigliano',
    address: { '@type': 'PostalAddress', addressLocality: "Corigliano d'Otranto", addressRegion: 'Puglia', addressCountry: 'IT' },
    containsPlace: data.rooms.map((r) => ({
      '@type': 'HotelRoom',
      name: r.title,
      description: r.servizi,
      occupancy: { '@type': 'QuantitativeValue', maxValue: r.ospiti_max },
      ...(r.prezzo_notte ? { priceRange: `€${r.prezzo_notte} / notte` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaB2B) }} />
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={data.rooms[0]?.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'} alt="Corigliano d'Otranto — B&B dimora storica" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))', display: 'flex', alignItems: 'flex-end', padding: '2.5rem' }}>
          <div className="container">
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Due Camere — B&B</span>
            <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2.8rem', margin: '0.2rem 0 0', lineHeight: 1.1 }}>Menima</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: '0.4rem 0 0', letterSpacing: '0.03em' }}>Dimora storica a Corigliano d'Otranto</p>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <Link href="/strutture" className="text-decoration-none d-inline-block mb-4" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>← Tutte le strutture</Link>
          <div className="row mb-5">
            <div className="col-lg-8">
              <span className="section-label">Dimora storica nel borgo medievale del Salento</span>
              <hr className="section-divider" style={{ marginTop: '0.8rem' }} />
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                Corigliano d'Otranto è uno dei borghi più suggestivi del Salento, custodito da un castello aragonese e attraversato da vicoli in pietra leccese. Le nostre due camere sono state ricavate dal restauro di un'antica abitazione del centro storico, conservando soffitti a volta, pavimenti originali e dettagli architettonici d'epoca.
              </p>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '2rem' }}>Le camere disponibili</h2>
          <div className="row g-4">
            {data.rooms.map((camera) => (
              <div className="col-md-6" key={camera.id}>
                <div className="fade-in h-100" style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  {camera.featured_image && (
                    <Link href={`/camere/${camera.slug}`}>
                      <img src={camera.featured_image} alt={camera.title} className="w-100" style={{ aspectRatio: '16/10', objectFit: 'cover' }} />
                    </Link>
                  )}
                  <div style={{ padding: '1.4rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.3rem' }}>
                      <Link href={`/camere/${camera.slug}`} className="text-decoration-none" style={{ color: 'var(--color-text)' }}>{camera.title}</Link>
                    </h3>
                    <div className="d-flex flex-wrap gap-3 mb-2" style={{ fontSize: '0.85rem' }}>
                      {camera.ospiti_max && <span className="text-muted">{camera.ospiti_max} ospiti</span>}
                      {camera.superficie && <span className="text-muted">{camera.superficie}</span>}
                      {camera.prezzo_notte && (
                        <span style={{ lineHeight: 1.3 }}>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>€{camera.prezzo_notte} / notte</span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-muted)' }}>prezzo base per due persone</span>
                        </span>
                      )}
                    </div>
                    {camera.servizi && <p className="text-muted mb-3" style={{ fontSize: '0.88rem' }}>{camera.servizi}</p>}
                    <div className="d-flex gap-2">
                      <Link href={`/camere/${camera.slug}`} className="btn-bnb" style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem' }}>Dettagli</Link>
                      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent" style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem' }}>Prenota</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Componente Sternatia ──

function SternatiaDetail({ data }) {
  const schemaVacation = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: 'Le Mura degli Angeli — Sternatia',
    description: "Casa vacanze intera a Sternatia, nella Grecìa Salentina. Dimora storica con cortile privato, 3 camere, fino a 6 ospiti.",
    url: 'https://www.lemuradegliangeli.it/strutture/sternatia',
    numberOfRooms: 3,
    address: { '@type': 'PostalAddress', addressLocality: 'Sternatia', addressRegion: 'Puglia', postalCode: '73010', addressCountry: 'IT' },
    occupancy: { '@type': 'QuantitativeValue', maxValue: parseInt(data.ospiti_max) || 6 },
    ...(data.prezzo_notte ? { priceRange: `€${data.prezzo_notte} / notte` } : {}),
  };

  const caratteristiche = Array.isArray(data.servizi)
    ? data.servizi.filter(Boolean)
    : typeof data.servizi === 'string' && data.servizi
      ? data.servizi.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Cortile privato', 'Cucina attrezzata', 'Camino', 'Wi-Fi', '3 camere da letto', '2 bagni'];

  const dettagli = [
    { label: 'Superficie', value: data.superficie },
    { label: 'Ospiti', value: data.ospiti_max ? `fino a ${data.ospiti_max}` : '' },
    { label: 'Check-in', value: data.checkin_time },
    { label: 'Check-out', value: data.checkout_time },
    ...(data.prezzo_notte ? [{ label: 'Prezzo', value: `€${data.prezzo_notte} / notte`, accent: true }] : []),
  ].filter((d) => d.value);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaVacation) }} />
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={data.featured_image} alt={`${data.title} — Casa vacanze nel Salento`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))', display: 'flex', alignItems: 'flex-end', padding: '2.5rem' }}>
          <div className="container">
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Casa Intera — Affitto Esclusivo</span>
            <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2.4rem', margin: '0.3rem 0 0' }}>{data.title}</h1>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <Link href="/strutture" className="text-decoration-none d-inline-block mb-4" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>← Tutte le strutture</Link>
          <div className="row mb-5">
            <div className="col-lg-8">
              <span className="section-label">Dimora privata nella Grecìa Salentina</span>
              <hr className="section-divider" style={{ marginTop: '0.8rem' }} />
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>{data.description}</p>
            </div>
          </div>
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Caratteristiche</h2>
              {dettagli.map((d) => (
                <div key={d.label} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-muted">{d.label}</span>
                  <strong style={d.accent ? { color: 'var(--color-accent)' } : {}}>{d.value}</strong>
                </div>
              ))}
              {caratteristiche.map((c) => (
                <div key={c} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-muted">{c}</span><strong>✓</strong>
                </div>
              ))}
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent" style={{ padding: '0.6rem 1.5rem', fontSize: '0.82rem' }}>Prenota la casa</a>
                <Link href="/contatti" className="btn-bnb" style={{ padding: '0.6rem 1.5rem', fontSize: '0.82rem' }}>Richiedi info</Link>
              </div>
            </div>
            {data.gallery.length > 0 && (
              <div className="col-lg-7">
                <div className="row g-2">
                  {data.gallery.map((img, i) => (
                    <div key={i} className={i === 0 ? 'col-12' : 'col-6'}>
                      <img src={img.url || img} alt={img.alt || `${data.title} ${i + 1}`} className="img-bnb w-100" style={{ aspectRatio: i === 0 ? '16/9' : '1', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Pagina principale ──

export default async function StrutturaDetail({ params }) {
  const { slug } = await params;

  if (slug === 'corigliano') {
    const raw = await getCorigliano();
    const data = normalizeCorigliano(raw);
    return <CoriglianoDetail data={data} />;
  }

  if (slug === 'sternatia') {
    const raw = await getSternatia();
    const data = normalizeSternatia(raw);
    return <SternatiaDetail data={data} />;
  }

  return (
    <div className="section-padding text-center">
      <h2>Struttura non trovata</h2>
      <Link href="/strutture" className="btn-bnb mt-3">← Torna alle strutture</Link>
    </div>
  );
}
