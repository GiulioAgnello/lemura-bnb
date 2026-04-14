import { Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getStrutture } from "../lib/wordpress";
import Loader from "../components/Loader";

const PLACEHOLDER = {
  corigliano: {
    nome: "Corigliano d'Otranto",
    tipo: "Due Camere",
    descrizione:
      "Nel cuore del borgo medievale di Corigliano d'Otranto, due camere ricavate dal restauro di un'antica dimora. Volte in pietra leccese, arredi d'epoca e comfort moderni si fondono in un'atmosfera unica nel Salento.",
    ospiti: "2 per camera",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  sternatia: {
    nome: "Sternatia",
    tipo: "Casa Intera",
    descrizione:
      "Un'intera dimora nel suggestivo borgo di Sternatia, uno dei paesi della Grecìa Salentina. Spazi ampi, cortile privato e l'atmosfera autentica di un villaggio dove ancora si parla il griko.",
    ospiti: "fino a 6",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
};

function normalizeStrutture(apiData) {
  if (!apiData) return null;

  const { corigliano, sternatia } = apiData;

  const corImage =
    corigliano?.rooms?.[0]?.featured_image ||
    PLACEHOLDER.corigliano.image;

  const sterImage =
    sternatia?.featured_image || PLACEHOLDER.sternatia.image;

  return [
    {
      slug: "corigliano",
      nome: PLACEHOLDER.corigliano.nome,
      tipo: PLACEHOLDER.corigliano.tipo,
      descrizione: PLACEHOLDER.corigliano.descrizione,
      ospiti: PLACEHOLDER.corigliano.ospiti,
      image: corImage,
    },
    {
      slug: "sternatia",
      nome: sternatia?.title || PLACEHOLDER.sternatia.nome,
      tipo: PLACEHOLDER.sternatia.tipo,
      descrizione: sternatia?.description || PLACEHOLDER.sternatia.descrizione,
      ospiti: PLACEHOLDER.sternatia.ospiti,
      image: sterImage,
    },
  ];
}

export default function Strutture() {
  const { data: apiData, loading } = useWP(() => getStrutture());

  if (loading) return <Loader />;

  const strutture = normalizeStrutture(apiData) || [
    { slug: "corigliano", ...PLACEHOLDER.corigliano },
    { slug: "sternatia", ...PLACEHOLDER.sternatia },
  ];

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Ospitalità</span>
          <h1 className="section-title">Le nostre strutture</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: "0 auto" }}>
            Due esperienze diverse nel cuore del Salento: camere d'autore a
            Corigliano d'Otranto e una casa intera a Sternatia, tra storia e
            autenticità.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {strutture.map((s, i) => (
            <div
              key={s.slug}
              className="row align-items-center g-5 mb-5 pb-5 fade-in"
              style={{
                borderBottom:
                  i < strutture.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <div className={`col-lg-6 ${i % 2 !== 0 ? "order-lg-2" : ""}`}>
                <Link to={`/strutture/${s.slug}`}>
                  <img
                    src={s.image}
                    alt={s.nome}
                    className="img-bnb w-100"
                    style={{ aspectRatio: "16/11", objectFit: "cover" }}
                  />
                </Link>
              </div>

              <div
                className={`col-lg-5 ${
                  i % 2 !== 0 ? "order-lg-1" : "offset-lg-1"
                }`}
              >
                <span className="section-label">{s.tipo}</span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.7rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <Link
                    to={`/strutture/${s.slug}`}
                    className="text-decoration-none"
                    style={{ color: "var(--color-text)" }}
                  >
                    {s.nome}
                  </Link>
                </h3>
                <hr className="section-divider" />

                <div
                  className="d-flex flex-wrap gap-4 mb-3"
                  style={{ fontSize: "0.9rem" }}
                >
                  <div>
                    <small className="text-muted d-block">Ospiti</small>
                    <strong>{s.ospiti}</strong>
                  </div>
                  <div>
                    <small className="text-muted d-block">Tipo</small>
                    <strong>{s.tipo}</strong>
                  </div>
                </div>

                <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
                  {s.descrizione}
                </p>

                <Link
                  to={`/strutture/${s.slug}`}
                  className="btn-bnb"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}
                >
                  Scopri di più
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
