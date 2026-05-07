import { useParams, Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getCorigliano, getSternatia } from "../lib/wordpress";
import Loader from "../components/Loader";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "#";

// ── Placeholders ──────────────────────────────────────────────────────────────

const PLACEHOLDER_CORIGLIANO = {
  rooms: [
    {
      id: 1,
      slug: "suite-ulivi",
      title: "Suite degli Ulivi",
      prezzo_notte: "120",
      ospiti_max: "2",
      superficie: "35 mq",
      servizi: "Vista giardino, vasca idromassaggio, minibar",
      featured_image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    },
    {
      id: 2,
      slug: "camera-pietra",
      title: "Camera della Pietra",
      prezzo_notte: "85",
      ospiti_max: "2",
      superficie: "22 mq",
      servizi: "Volta a stella, pavimento originale in pietra",
      featured_image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    },
  ],
};

const PLACEHOLDER_STERNATIA = {
  title: "Sternatia",
  description:
    "Un'intera dimora nel suggestivo borgo di Sternatia, uno dei paesi della Grecìa Salentina. Spazi generosi su due livelli: soggiorno con camino, cucina attrezzata, tre camere da letto e un cortile privato all'ombra degli ulivi.",
  superficie: "120 mq",
  ospiti_max: "6",
  featured_image:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalizza i campi dell'API CRM per Corigliano */
function normalizeCorigliano(data) {
  const rooms = (data?.rooms || []).map((r) => ({
    id: r.id,
    slug: r.slug || `camera-${r.id}`,
    title: r.title,
    prezzo_notte: r.prezzo_notte || "",
    ospiti_max: r.ospiti_max || "",
    superficie: r.superficie || "",
    servizi: r.servizi || "",
    featured_image: r.featured_image || "",
  }));
  return { rooms };
}

/** Normalizza i campi dell'API CRM per Sternatia */
function normalizeSternatia(data) {
  if (!data) return null;
  return {
    title: data.title || "Sternatia",
    description: data.description || "",
    prezzo_notte: data.prezzo_notte || "",
    superficie: data.superficie || "",
    ospiti_max: data.ospiti_max || "",
    servizi: data.servizi || "",
    checkin_time: data.checkin_time || "",
    checkout_time: data.checkout_time || "",
    featured_image: data.featured_image || "",
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
  };
}

// ── Componente Corigliano ─────────────────────────────────────────────────────

function CoriglianoDetail({ data }) {
  const { rooms } = data;

  return (
    <>
      <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img
          src={
            rooms[0]?.featured_image ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
          }
          alt="Corigliano d'Otranto"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
            display: "flex",
            alignItems: "flex-end",
            padding: "2.5rem",
          }}
        >
          <div className="container">
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Due Camere
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                color: "#fff",
                fontSize: "2.4rem",
                margin: "0.3rem 0 0",
              }}
            >
              Corigliano d'Otranto
            </h1>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <Link
            to="/strutture"
            className="text-decoration-none d-inline-block mb-4"
            style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}
          >
            ← Tutte le strutture
          </Link>

          <div className="row mb-5">
            <div className="col-lg-8">
              <span className="section-label">Dimora storica nel borgo medievale</span>
              <hr className="section-divider" style={{ marginTop: "0.8rem" }} />
              <p style={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
                Corigliano d'Otranto è uno dei borghi più suggestivi del
                Salento, custodito da un castello aragonese e attraversato da
                vicoli in pietra leccese. Le nostre due camere sono state
                ricavate dal restauro di un'antica abitazione del centro
                storico, conservando soffitti a volta, pavimenti originali e
                dettagli architettonici d'epoca.
              </p>
            </div>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              marginBottom: "2rem",
            }}
          >
            Le camere disponibili
          </h2>
          <div className="row g-4">
            {rooms.map((camera) => (
              <div className="col-md-6" key={camera.id}>
                <div
                  className="fade-in h-100"
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  {camera.featured_image && (
                    <Link to={`/camere/${camera.slug}`}>
                      <img
                        src={camera.featured_image}
                        alt={camera.title}
                        className="w-100"
                        style={{ aspectRatio: "16/10", objectFit: "cover" }}
                      />
                    </Link>
                  )}
                  <div style={{ padding: "1.4rem" }}>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <Link
                        to={`/camere/${camera.slug}`}
                        className="text-decoration-none"
                        style={{ color: "var(--color-text)" }}
                      >
                        {camera.title}
                      </Link>
                    </h4>
                    <div
                      className="d-flex flex-wrap gap-3 mb-2"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {camera.ospiti_max && (
                        <span className="text-muted">{camera.ospiti_max} ospiti</span>
                      )}
                      {camera.superficie && (
                        <span className="text-muted">{camera.superficie}</span>
                      )}
                      {camera.prezzo_notte && (
                        <span style={{ lineHeight: 1.3 }}>
                          <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
                            €{camera.prezzo_notte} / notte
                          </span>
                          <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-muted)" }}>
                            prezzo base per due persone
                          </span>
                        </span>
                      )}
                    </div>
                    {camera.servizi && (
                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "0.88rem" }}
                      >
                        {camera.servizi}
                      </p>
                    )}
                    <div className="d-flex gap-2">
                      <Link
                        to={`/camere/${camera.slug}`}
                        className="btn-bnb"
                        style={{
                          padding: "0.5rem 1.2rem",
                          fontSize: "0.78rem",
                        }}
                      >
                        Dettagli
                      </Link>
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-bnb btn-bnb-accent"
                        style={{
                          padding: "0.5rem 1.2rem",
                          fontSize: "0.78rem",
                        }}
                      >
                        Prenota
                      </a>
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

// ── Componente Sternatia ──────────────────────────────────────────────────────

function SternatiaDetail({ data }) {
  const dettagli = [
    {
      label: "Prezzo",
      value: data.prezzo_notte ? data.prezzo_notte : "",
      render: data.prezzo_notte
        ? () => (
            <span style={{ textAlign: "right" }}>
              <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
                €{data.prezzo_notte} / notte
              </span>
              <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-muted)" }}>
                prezzo base per due persone
              </span>
            </span>
          )
        : null,
    },
    { label: "Superficie", value: data.superficie },
    { label: "Ospiti", value: data.ospiti_max ? `fino a ${data.ospiti_max}` : "" },
    { label: "Check-in", value: data.checkin_time },
    { label: "Check-out", value: data.checkout_time },
  ].filter((d) => d.value);

  const caratteristiche = Array.isArray(data.servizi)
    ? data.servizi.filter(Boolean)
    : typeof data.servizi === "string" && data.servizi
    ? data.servizi.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Cortile privato", "Cucina attrezzata", "Camino", "Wi-Fi", "3 camere da letto", "2 bagni"];

  return (
    <>
      <div style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img
          src={data.featured_image}
          alt={data.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
            display: "flex",
            alignItems: "flex-end",
            padding: "2.5rem",
          }}
        >
          <div className="container">
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Casa Intera
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                color: "#fff",
                fontSize: "2.4rem",
                margin: "0.3rem 0 0",
              }}
            >
              {data.title}
            </h1>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <Link
            to="/strutture"
            className="text-decoration-none d-inline-block mb-4"
            style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}
          >
            ← Tutte le strutture
          </Link>

          <div className="row mb-5">
            <div className="col-lg-8">
              <span className="section-label">Dimora privata nella Grecìa Salentina</span>
              <hr className="section-divider" style={{ marginTop: "0.8rem" }} />
              <p style={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
                {data.description}
              </p>
            </div>
          </div>

          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                Caratteristiche
              </h2>

              {dettagli.length > 0 && (
                <div className="mb-3">
                  {dettagli.map((d) => (
                    <div
                      key={d.label}
                      className="d-flex justify-content-between align-items-center py-2"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <span className="text-muted">{d.label}</span>
                      {d.render ? d.render() : <strong>{d.value}</strong>}
                    </div>
                  ))}
                </div>
              )}

              {caratteristiche.length > 0 && (
                <div className="mt-3">
                  {caratteristiche.map((c) => (
                    <div
                      key={c}
                      className="d-flex justify-content-between py-2"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <span className="text-muted">{c}</span>
                      <strong>✓</strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="d-flex gap-3 mt-4 flex-wrap">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bnb btn-bnb-accent"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                >
                  Prenota la casa
                </a>
                <Link
                  to="/contatti"
                  className="btn-bnb"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                >
                  Richiedi info
                </Link>
              </div>
            </div>

            {data.gallery.length > 0 && (
              <div className="col-lg-7">
                <div className="row g-2">
                  {data.gallery.map((img, i) => (
                    <div key={i} className={i === 0 ? "col-12" : "col-6"}>
                      <img
                        src={img}
                        alt={`${data.title} ${i + 1}`}
                        className="img-bnb w-100"
                        style={{
                          aspectRatio: i === 0 ? "16/9" : "1",
                          objectFit: "cover",
                        }}
                      />
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

// ── Componente principale ─────────────────────────────────────────────────────

export default function StrutturaDetail() {
  const { slug } = useParams();

  const isCorigliano = slug === "corigliano";
  const isSternatia = slug === "sternatia";

  const { data: rawData, loading } = useWP(
    () => (isCorigliano ? getCorigliano() : isSternatia ? getSternatia() : Promise.resolve(null)),
    [slug]
  );

  if (loading) return <Loader />;

  if (!isCorigliano && !isSternatia) {
    return (
      <div className="section-padding text-center">
        <h2>Struttura non trovata</h2>
        <Link to="/strutture" className="btn-bnb mt-3">
          ← Torna alle strutture
        </Link>
      </div>
    );
  }

  if (isCorigliano) {
    const data = normalizeCorigliano(rawData);
    const rooms = data.rooms.length > 0 ? data.rooms : PLACEHOLDER_CORIGLIANO.rooms;
    return <CoriglianoDetail data={{ rooms }} />;
  }

  const data = normalizeSternatia(rawData) || PLACEHOLDER_STERNATIA;
  return <SternatiaDetail data={data} />;
}
