import { Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getStrutture } from "../lib/wordpress";
import BookingWidget from "../components/BookingWidget";

const PLACEHOLDER_STRUTTURE = [
  {
    slug: "corigliano",
    nome: "Corigliano d'Otranto",
    tipo: "Due Camere",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    slug: "sternatia",
    nome: "Sternatia",
    tipo: "Casa Intera",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
];

function normalizeStrutture(apiData) {
  if (!apiData) return PLACEHOLDER_STRUTTURE;
  return [
    {
      slug: "corigliano",
      nome: "Corigliano d'Otranto",
      tipo: "Due Camere",
      image:
        apiData.corigliano?.rooms?.[0]?.featured_image ||
        PLACEHOLDER_STRUTTURE[0].image,
    },
    {
      slug: "sternatia",
      nome: apiData.sternatia?.title || "Sternatia",
      tipo: "Casa Intera",
      image:
        apiData.sternatia?.featured_image || PLACEHOLDER_STRUTTURE[1].image,
    },
  ];
}

export default function Homepage() {
  const AIRBNB_URL = import.meta.env.VITE_AIRBNB_URL || "#";
  const { data: apiData } = useWP(() => getStrutture());
  const strutture = normalizeStrutture(apiData);
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section
        className="position-relative"
        style={{
          background: `linear-gradient(to bottom, rgba(44,36,24,0.3), rgba(44,36,24,0.6)), url("/IMG_5289.JPEG") center/cover no-repeat`,
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 fade-in">
              <span
                className="section-label"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                B&B nel Salento
              </span>
              <h1 className="mb-4" style={{ color: "#fff", fontWeight: 500 }}>
                Benvenuti a Le Mura degli Angeli
              </h1>
              <p
                className="mb-4"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.15rem",
                  maxWidth: 580,
                }}
              >
                Un rifugio di pace nel cuore del Salento, dove la storia
                incontra l'ospitalità autentica. Tra ulivi secolari, pietra
                leccese e il calore del sud.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a
                  href={AIRBNB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bnb btn-bnb-accent"
                >
                  Prenota il soggiorno
                </a>
                <Link to="/strutture" className="btn-bnb btn-bnb-white">
                  Scopri le strutture
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section>
        <div className="containerBooking">
          <BookingWidget />
        </div>
      </section> */}

      {/* ═══════ INTRO ═══════ */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 fade-in">
              <img
                src="/2.jpg"
                alt="Le Mura degli Angeli"
                className="img-bnb w-100"
                style={{ aspectRatio: "4/5", objectFit: "cover" }}
              />
            </div>
            <div className="col-lg-5 offset-lg-1 fade-in fade-in-d1">
              <span className="section-label">Chi siamo</span>
              <h2 className="section-title">La nostra storia</h2>
              <hr className="section-divider" />
              <p>
                Le Mura degli Angeli nasce dal restauro di un'antica dimora nel
                Salento, dove ogni pietra racconta secoli di storia. Abbiamo
                preservato l'autenticità dell'architettura pugliese,
                arricchendola con comfort moderni per offrirvi un soggiorno
                indimenticabile. Circondati da ulivi, a pochi chilometri dalle
                spiagge più belle del Salento e dal centro storico di Lecce,
                siamo il punto di partenza ideale per esplorare questa terra
                meravigliosa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STRUTTURE ═══════ */}
      <section
        className="section-padding"
        style={{ background: "var(--color-bg-warm)" }}
      >
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">Le nostre strutture</span>
            <h2 className="section-title">Sternatia e Corigliano D'otranto</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row g-4">
            {strutture.map((s) => (
              <div className="col-12 col-md-6" key={s.slug}>
                <Link
                  to={`/strutture/${s.slug}`}
                  className="text-decoration-none"
                >
                  <div className="fade-in" style={{ overflow: "hidden" }}>
                    <img
                      src={s.image}
                      alt={s.nome}
                      className="img-bnb w-100"
                      style={{ aspectRatio: "4/3", objectFit: "cover" }}
                    />
                    <div style={{ paddingTop: "1rem", textAlign: "center" }}>
                      <small
                        className="section-label"
                        style={{ display: "block", marginBottom: "0.3rem" }}
                      >
                        {s.tipo}
                      </small>
                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.35rem",
                          color: "var(--color-text)",
                        }}
                      >
                        {s.nome}
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RECENSIONI PREVIEW ═══════ */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">Testimonianze</span>
            <h2 className="section-title">I nostri ospiti raccontano</h2>
            <hr className="section-divider section-divider-center" />
          </div>
          <div className="row g-4 justify-content-center">recenzioni</div>
          <div className="text-center mt-5">
            <Link to="/recensioni" className="btn-bnb">
              Tutte le recensioni
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA PRENOTAZIONE ═══════ */}
      <section
        className="section-padding text-center"
        style={{ background: "var(--color-dark)", color: "#fff" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 fade-in">
              <span
                className="section-label"
                style={{ color: "var(--color-accent)" }}
              >
                Prenota il tuo soggiorno
              </span>
              <h2 style={{ color: "#fff", marginBottom: "1.25rem" }}>
                Vivi l'esperienza del Salento autentico
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: "2rem",
                }}
              >
                Contattaci per verificare la disponibilità o prenota
                direttamente tramite le piattaforme partner.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a
                  href={AIRBNB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bnb btn-bnb-accent"
                >
                  Prenota su Airbnb.com
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
