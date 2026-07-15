import { getPageBySlug } from '@/lib/wordpress';
import ContattiForm from '@/components/ContattiForm';

export const revalidate = 3600;

export const metadata = {
  alternates: { canonical: "/contatti" },
  title: 'Contatti e Prenotazioni — B&B Le Mura degli Angeli Salento',
  description:
    "Contatta Le Mura degli Angeli per prenotare il tuo soggiorno nel Salento. B&B a Corigliano d'Otranto e casa vacanze a Sternatia. Risposta entro 24 ore.",
  openGraph: {
    title: 'Contatti | Le Mura degli Angeli B&B Salento',
  },
};

const PLACEHOLDER = {
  title: 'Contattaci',
  subtitle: 'Scrivici per verificare la disponibilità, chiedere informazioni o prenotare il tuo soggiorno nel Salento.',
  indirizzo: 'Via Giudeca 28, Sternatia (LE), Salento, Puglia',
  email: 'lemuradegliangeli@yahoo.com',
  telefono: '+39 327 1208496',
  whatsapp: '+393271208496',
  mappa: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190.40457932392434!2d18.227094209446825!3d40.22077833349466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13442357e0d3014b%3A0x80e7eefe46b30e5!2sVia%20Giudeca%2C%2028%2C%2073010%20Sternatia%20LE!5e0!3m2!1sit!2sit!4v1776167913912!5m2!1sit!2sit',
};

const schemaContact = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  name: 'Le Mura degli Angeli',
  url: 'https://www.lemuradegliangeli.it',
  telephone: '+393271208496',
  email: 'lemuradegliangeli@yahoo.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Giudeca 28',
    addressLocality: 'Sternatia',
    addressRegion: 'Puglia',
    postalCode: '73010',
    addressCountry: 'IT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 40.2208, longitude: 18.2271 },
  openingHours: 'Mo-Su 08:00-22:00',
  hasMap: 'https://www.google.com/maps/place/Via+Giudeca,+28,+73010+Sternatia+LE',
};

export default async function Contatti() {
  const page = await getPageBySlug('contatti');
  const acf = page?.acf || {};
  const info = {
    title: acf.contatti_title || PLACEHOLDER.title,
    subtitle: acf.contatti_subtitle || PLACEHOLDER.subtitle,
    indirizzo: acf.indirizzo || PLACEHOLDER.indirizzo,
    email: acf.email || PLACEHOLDER.email,
    telefono: acf.telefono || PLACEHOLDER.telefono,
    whatsapp: acf.whatsapp || PLACEHOLDER.whatsapp,
    mappa: acf.mappa_embed || PLACEHOLDER.mappa,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaContact) }} />

      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Contatti</span>
          <h1 className="section-title">{info.title}</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: '0 auto' }}>{info.subtitle}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7 fade-in">
              <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Richiedi disponibilità</h2>
              <ContattiForm />
            </div>

            <div className="col-lg-4 offset-lg-1 fade-in fade-in-d1">
              <div className="mb-5">
                <h3 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Dove siamo</h3>
                <p className="text-muted">{info.indirizzo}</p>
              </div>
              <div className="mb-5">
                <h3 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Email</h3>
                <a href={`mailto:${info.email}`}>{info.email}</a>
              </div>
              <div className="mb-5">
                <h3 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Telefono / WhatsApp</h3>
                <a href={`tel:${info.telefono}`}>{info.telefono}</a>
                {info.whatsapp && (
                  <div className="mt-2">
                    <a href={`https://wa.me/${info.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: '0.5rem 1.2rem', fontSize: '0.78rem', borderColor: '#25D366', color: '#25D366' }}>
                      Scrivici su WhatsApp
                    </a>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <h3 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Come raggiungerci</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Aeroporto di Brindisi: 40 min in auto<br />
                  Stazione di Lecce: 15 min in auto<br />
                  Centro storico di Lecce: 10 min
                </p>
              </div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <iframe src={info.mappa} width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mappa Le Mura degli Angeli" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
