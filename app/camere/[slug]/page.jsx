import Link from 'next/link';
import { getCameraBySlug, getCorigliano } from '@/lib/wordpress';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const data = await getCorigliano();
    return (data?.rooms || []).map((r) => ({ slug: r.slug || `camera-${r.id}` }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const camera = await getCameraBySlug(slug);
  if (!camera) return { title: 'Camera — Le Mura degli Angeli' };
  return {
    title: `${camera.title} — B&B nel Salento`,
    description: `${camera.title} a Le Mura degli Angeli, Corigliano d'Otranto. ${camera.servizi || ''}. ${camera.prezzo ? `Da €${camera.prezzo} / notte.` : ''} Soffitti a volta in pietra leccese nel borgo medievale del Salento.`,
    openGraph: {
      title: `${camera.title} | Le Mura degli Angeli B&B`,
      images: camera.featuredImage ? [{ url: camera.featuredImage.url, alt: camera.featuredImage.alt }] : [],
    },
  };
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || '#';

function normalizeCrmRoom(r) {
  return {
    id: r.id, title: r.title, slug: r.slug || `camera-${r.id}`, content: '',
    featuredImage: r.featured_image ? { url: r.featured_image, alt: r.title } : null,
    prezzo: r.prezzo_notte || '', ospiti: r.ospiti_massimi || '',
    superficie: r.superficie || '',
    servizi: Array.isArray(r.servizi) ? r.servizi.map((s) => s.nome).join(', ') : r.servizi || '',
    checkin_time: r.checkin_time || '', checkout_time: r.checkout_time || '',
    gallery: Array.isArray(r.gallery) ? r.gallery.map((u) => ({ url: u, alt: '' })) : [],
    bookingUrl: r.booking_url || '',
  };
}

export default async function CameraDetail({ params }) {
  const { slug } = await params;

  let camera = await getCameraBySlug(slug);

  if (!camera) {
    const corData = await getCorigliano();
    const room = corData?.rooms?.find((r) => r.slug === slug || `camera-${r.id}` === slug);
    camera = room ? normalizeCrmRoom(room) : null;
  }

  if (!camera) {
    return (
      <div className="section-padding text-center">
        <h2>Camera non trovata</h2>
        <Link href="/strutture/corigliano" className="btn-bnb mt-3">← Torna a Corigliano</Link>
      </div>
    );
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: camera.title,
    description: camera.servizi,
    url: `https://www.lemuradegliangeli.it/camere/${slug}`,
    ...(camera.featuredImage ? { image: camera.featuredImage.url } : {}),
    occupancy: { '@type': 'QuantitativeValue', maxValue: parseInt(camera.ospiti) || 2 },
    ...(camera.prezzo ? { priceRange: `€${camera.prezzo} / notte` } : {}),
    containedInPlace: {
      '@type': 'BedAndBreakfast',
      name: "Le Mura degli Angeli",
      url: 'https://www.lemuradegliangeli.it',
    },
  };

  const gallery = camera.gallery || [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="section-padding">
        <div className="container">
          <Link href="/strutture/corigliano" className="text-decoration-none d-inline-block mb-4" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>
            ← Corigliano d'Otranto
          </Link>
          <div className="row g-5">
            <div className="col-lg-7 fade-in">
              {camera.featuredImage && (
                <img src={camera.featuredImage.url} alt={camera.featuredImage.alt} className="w-100 img-bnb" style={{ aspectRatio: '16/11' }} />
              )}
              {gallery.length > 0 && (
                <div className="row g-2 mt-2">
                  {gallery.map((img, i) => (
                    <div className="col-4" key={i}>
                      <img src={img.url || img} alt={img.alt || `Foto ${i + 1}`} className="w-100 img-bnb" style={{ aspectRatio: '1', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-lg-5 fade-in fade-in-d1">
              <h1 className="mb-3" style={{ fontFamily: 'var(--font-display)' }} dangerouslySetInnerHTML={{ __html: camera.title }} />
              <hr className="section-divider" />
              <div className="mb-4">
                {camera.prezzo && (
                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span className="text-muted">Prezzo</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1.1rem' }}>€{camera.prezzo} / notte</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '1px' }}>prezzo base per due persone</div>
                    </div>
                  </div>
                )}
                {camera.ospiti && <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}><span className="text-muted">Ospiti max</span><strong>{camera.ospiti}</strong></div>}
                {camera.superficie && <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}><span className="text-muted">Superficie</span><strong>{camera.superficie} mq</strong></div>}
                {camera.checkin_time && <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}><span className="text-muted">Check-in</span><strong>dalle {camera.checkin_time}</strong></div>}
                {camera.checkout_time && <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}><span className="text-muted">Check-out</span><strong>entro le {camera.checkout_time}</strong></div>}
              </div>
              {camera.servizi && (
                <div className="mb-4">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Servizi in camera</h2>
                  <p className="text-muted">{camera.servizi}</p>
                </div>
              )}
              {camera.content && <div className="wp-content mb-4" dangerouslySetInnerHTML={{ __html: camera.content }} />}
              <div className="d-flex gap-3 flex-wrap">
                <a href={camera.bookingUrl || BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent">Prenota questa camera</a>
                <Link href="/contatti" className="btn-bnb">Richiedi info</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
