import { Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getPageBySlug, getCamere, getRecensioni } from "../lib/wordpress";
import Loader from "../components/Loader";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "#";

// Placeholder per quando WordPress non è ancora collegato
const PLACEHOLDER = {
  hero_title: "Benvenuti a Le Mura degli Angeli",
  hero_subtitle: "Un rifugio di pace nel cuore del Salento, dove la storia incontra l'ospitalità autentica. Tra ulivi secolari, pietra leccese e il calore del sud.",
  hero_image: { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" },
  intro_title: "La nostra storia",
  intro_text: "<p>Le Mura degli Angeli nasce dal restauro di un'antica dimora nel Salento, dove ogni pietra racconta secoli di storia. Abbiamo preservato l'autenticità dell'architettura pugliese, arricchendola con comfort moderni per offrirvi un soggiorno indimenticabile.</p><p>Circondati da ulivi, a pochi chilometri dalle spiagge più belle del Salento e dal centro storico di Lecce, siamo il punto di partenza ideale per esplorare questa terra meravigliosa.</p>",
  intro_image: { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
  servizi: ["Colazione con prodotti locali", "Wi-Fi gratuito", "Parcheggio privato", "Giardino con ulivi", "Aria condizionata", "Biciclette disponibili"],
};

const PLACEHOLDER_CAMERE = [
  { id: 1, title: "Suite degli Ulivi", slug: "suite-ulivi", prezzo: "120", ospiti: "2", featuredImage: { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", alt: "Suite degli Ulivi" } },
  { id: 2, title: "Camera del Mare", slug: "camera-mare", prezzo: "95", ospiti: "2", featuredImage: { url: "https://images.unsplash.com/photo-1590490360182-c33d3bbe7bba?w=600&q=80", alt: "Camera del Mare" } },
  { id: 3, title: "Camera della Pietra", slug: "camera-pietra", prezzo: "85", ospiti: "2", featuredImage: { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80", alt: "Camera della Pietra" } },
];

const PLACEHOLDER_RECENSIONI = [
  { id: 1, nome: "Marco & Giulia", provenienza: "Milano", stelle: 5, testo: "Un posto magico. La struttura è bellissima, la colazione straordinaria con prodotti locali freschi. Torneremo sicuramente." },
  { id: 2, nome: "Sophie", provenienza: "Parigi", stelle: 5, testo: "L'accueil est exceptionnel. Un endroit magnifique au cœur des Pouilles. Les propriétaires sont adorables et pleins de bons conseils." },
  { id: 3, nome: "Thomas & Anna", provenienza: "Berlino", stelle: 5, testo: "Perfekte Lage, wunderschönes Anwesen. Das Frühstück war ein Traum. Wir kommen wieder!" },
];

export default function Homepage() {
  const { data: page, loading } = useWP(() => getPageBySlug("home"));
  const { data: camereWP } = useWP(() => getCamere());
  const { data: recensioniWP } = useWP(() => getRecensioni());

  if (loading) return <Loader />;

  const acf = page?.acf || {};
  const hero = {
    title: acf.hero_title || PLACEHOLDER.hero_title,
    subtitle: acf.hero_subtitle || PLACEHOLDER.hero_subtitle,
    image: acf.hero_image?.url || PLACEHOLDER.hero_image.url,
  };
  const intro = {
    title: acf.intro_title || PLACEHOLDER.intro_title,
    text: acf.intro_text || PLACEHOLDER.intro_text,
    image: acf.intro_image?.url || PLACEHOLDER.intro_image.url,
  };
  const servizi = acf.servizi_lista || PLACEHOLDER.servizi;
  const camere = camereWP?.length > 0 ? camereWP : PLACEHOLDER_CAMERE;
  const recensioni = recensioniWP?.length > 0 ? recensioniWP : PLACEHOLDER_RECENSIONI;

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section
        className="position-relative"
        style={{
          background: `linear-gradient(to bottom, rgba(44,36,24,0.3), rgba(44,36,24,0.6)), url(${hero.image}) center/cover no-repeat`,
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 fade-in">
              <span className="section-label" style={{ color: "rgba(255,255,255,0.65)" }}>
                B&B nel Salento
              </span>
              <h1 className="mb-4" style={{ color: "#fff", fontWeight: 500 }}>
                {hero.title}
              </h1>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", maxWidth: 580 }}>
                {hero.subtitle}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent">
                  Prenota il soggiorno
                </a>
                <Link to="/camere" className="btn-bnb btn-bnb-white">
                  Scopri le camere
                </Link>
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
              <img src={intro.image} alt="Le Mura degli Angeli" className="img-bnb w-100" style={{ aspectRatio: "4/5", objectFit: "cover" }} />
            </div>
            <div className="col-lg-5 offset-lg-1 fade-in fade-in-d1">
              <span className="section-label">Chi siamo</span>
              <h2 className="section-title">{intro.title}</h2>
              <hr className="section-divider" />
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: intro.text }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SERVIZI ═══════ */}
      <section className="section-padding" style={{ background: "var(--color-bg-warm)" }}>
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">I nostri servizi</span>
            <h2 className="section-title">Tutto per il vostro comfort</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row justify-content-center g-3">
            {(Array.isArray(servizi) ? servizi : []).map((s, i) => {
              const label = typeof s === "string" ? s : s.servizio || s.label || "";
              return (
                <div className="col-6 col-md-4 col-lg-3 fade-in" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="text-center p-3 h-100" style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                    <p className="mb-0 fw-medium" style={{ color: "var(--color-text)", fontSize: "0.95rem" }}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CAMERE PREVIEW ═══════ */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">Le nostre camere</span>
            <h2 className="section-title">Comfort e tradizione</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row g-4">
            {camere.slice(0, 3).map((camera, i) => (
              <div className="col-md-4 fade-in" key={camera.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card-bnb h-100">
                  {camera.featuredImage && (
                    <Link to={`/camere/${camera.slug}`}>
                      <img src={camera.featuredImage.url} alt={camera.featuredImage.alt || camera.title} className="w-100" style={{ height: 260, objectFit: "cover" }} />
                    </Link>
                  )}
                  <div className="p-4">
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                      <Link to={`/camere/${camera.slug}`} className="text-decoration-none" style={{ color: "var(--color-text)" }} dangerouslySetInnerHTML={{ __html: camera.title }} />
                    </h4>
                    <div className="d-flex gap-3 text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                      {camera.ospiti && <span>👤 {camera.ospiti} ospiti</span>}
                      {camera.prezzo && <span className="ms-auto fw-semibold" style={{ color: "var(--color-accent)" }}>da €{camera.prezzo}/notte</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/camere" className="btn-bnb">Tutte le camere</Link>
          </div>
        </div>
      </section>

      {/* ═══════ RECENSIONI PREVIEW ═══════ */}
      <section className="section-padding" style={{ background: "var(--color-bg-warm)" }}>
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">Testimonianze</span>
            <h2 className="section-title">I nostri ospiti raccontano</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row g-4 justify-content-center">
            {recensioni.slice(0, 3).map((r, i) => (
              <div className="col-md-4 fade-in" key={r.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-card h-100 d-flex flex-column">
                  <div className="stars mb-2 mt-2">{"★".repeat(r.stelle)}{"☆".repeat(5 - r.stelle)}</div>
                  <p className="flex-grow-1" style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--color-text)" }}>
                    {r.testo}
                  </p>
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <strong>{r.nome}</strong>
                    {r.provenienza && <small className="d-block text-muted">{r.provenienza}</small>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/recensioni" className="btn-bnb">Tutte le recensioni</Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA PRENOTAZIONE ═══════ */}
      <section className="section-padding text-center" style={{ background: "var(--color-dark)", color: "#fff" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 fade-in">
              <span className="section-label" style={{ color: "var(--color-accent)" }}>Prenota il tuo soggiorno</span>
              <h2 style={{ color: "#fff", marginBottom: "1.25rem" }}>
                Vivi l'esperienza del Salento autentico
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "2rem" }}>
                Contattaci per verificare la disponibilità o prenota direttamente tramite le piattaforme partner.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent">
                  Prenota su Booking.com
                </a>
                <Link to="/contatti" className="btn-bnb btn-bnb-white">
                  Richiedi disponibilità
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
