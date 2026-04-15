// import { Link } from "react-router-dom";
// import useWP from "../hooks/useWP";
// import { getCorigliano } from "../lib/wordpress";
// import Loader from "../components/Loader";

// const TRATTAMENTI = [
//   {
//     nome: "Massaggio Rigenerante",
//     durata: "60 min",
//     prezzo: "70",
//     descrizione:
//       "Massaggio corpo completo con oli essenziali di lavanda e arancio amaro del Salento. Scioglie le tensioni muscolari e riequilibra corpo e mente.",
//   },
//   {
//     nome: "Percorso Hammam",
//     durata: "90 min",
//     prezzo: "95",
//     descrizione:
//       "Bagno turco, scrub al fango del mar Adriatico e impacco all'argilla verde. Un rito di purificazione profonda ispirato alla tradizione mediterranea.",
//   },
//   {
//     nome: "Trattamento Viso Rigenerante",
//     durata: "50 min",
//     prezzo: "65",
//     descrizione:
//       "Pulizia profonda, maschera all'olio di melograno e siero all'acqua termale. La pelle ritrova luminosità e idratazione duratura.",
//   },
//   {
//     nome: "Percorso Coppia",
//     durata: "120 min",
//     prezzo: "160",
//     descrizione:
//       "Massaggio in coppia, accesso alla vasca idromassaggio privata e calice di prosecco. Il regalo perfetto per celebrare un momento speciale.",
//   },
// ];

// const FALLBACK_HERO =
//   "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80";

export default function Spa() {
  // const { data: coriglianoData, loading } = useWP(() => getCorigliano());

  // if (loading) return <Loader />;

  // const spa = coriglianoData?.spa || null;
  // const heroImage = spa?.featured_image || FALLBACK_HERO;
  // const spaGallery = Array.isArray(spa?.gallery) ? spa.gallery : [];

  // // Se l'API restituisce una lista di servizi come stringa CSV, la usiamo
  // const serviziApi = spa?.servizi
  //   ? spa.servizi.split(",").map((s) => s.trim()).filter(Boolean)
  //   : null;

  return (
    <>
      <div>
        <div className="container">
          <h1 className="text-center py-5">CoomingSoon</h1>
        </div>
      </div>
      {/* Hero
      <div style={{ position: "relative", height: "460px", overflow: "hidden" }}>
        <img
          src={heroImage}
          alt="Spa Le Mura degli Angeli"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div>
            <span
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Benessere
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                color: "#fff",
                fontSize: "3rem",
                margin: "0.4rem 0 0",
              }}
            >
              {spa?.title || "Spa & Wellness"}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                marginTop: "0.8rem",
                fontSize: "1.05rem",
                maxWidth: 480,
              }}
            >
              Un rifugio di pace nelle pietre antiche del Salento
            </p>
          </div>
        </div>
      </div>

      {/* Intro */}
      {/* <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Il nostro benessere</span>
          <h2 className="section-title">Un momento solo per te</h2>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 640, margin: "0 auto", lineHeight: 1.9 }}>
            La nostra spa è ricavata nelle cantine dell'antica dimora, dove la
            pietra mantiene una temperatura naturalmente fresca d'estate e
            tiepida d'inverno. Ritualità mediterranee, prodotti biologici a km 0
            e mani esperte per restituirti equilibrio profondo.
          </p>
        </div>
      </section> */}

      {/* Gallery dalla API (se presente) */}
      {/* {spaGallery.length > 0 && (
        <section className="section-padding pb-0">
          <div className="container">
            <div className="row g-2">
              {spaGallery.map((img, i) => (
                <div key={i} className={i === 0 ? "col-12 col-lg-8" : "col-6 col-lg-4"}>
                  <img
                    src={img}
                    alt={`Spa ${i + 1}`}
                    className="img-bnb w-100"
                    style={{
                      aspectRatio: i === 0 ? "16/9" : "4/3",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Servizi dall'API (se presenti) */}
      {/* {serviziApi && serviziApi.length > 0 && (
        <section className="section-padding pb-0">
          <div className="container">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              I nostri servizi
            </h3>
            <div className="row g-2">
              {serviziApi.map((s) => (
                <div className="col-auto" key={s}>
                  <span
                    style={{
                      border: "1px solid var(--color-border)",
                      padding: "0.4rem 1rem",
                      fontSize: "0.88rem",
                      display: "inline-block",
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Trattamenti */}
      {/* <section className="section-padding">
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              marginBottom: "2rem",
            }}
          >
            Trattamenti
          </h2>
          <div className="row g-4">
            {TRATTAMENTI.map((t, i) => (
              <div className="col-md-6" key={t.nome}>
                <div
                  className="fade-in h-100"
                  style={{
                    border: "1px solid var(--color-border)",
                    padding: "2rem",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        margin: 0,
                      }}
                    >
                      {t.nome}
                    </h4>
                    <span
                      style={{
                        color: "var(--color-accent)",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        whiteSpace: "nowrap",
                        marginLeft: "1rem",
                      }}
                    >
                      €{t.prezzo}
                    </span>
                  </div>
                  <small className="text-muted">{t.durata}</small>
                  <hr className="section-divider" style={{ margin: "0.9rem 0" }} />
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.92rem", lineHeight: 1.75 }}
                  >
                    {t.descrizione}
                  </p>
                </div>
              </div>
            ))} */}
      {/* </div> */}

      {/* CTA */}
      {/* <div
            className="text-center mt-5 pt-4 fade-in"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="section-label">Come prenotare</span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                marginTop: "0.6rem",
              }}
            >
              Riserva il tuo momento di benessere
            </h3>
            <p
              className="text-muted mt-2 mb-4"
              style={{ maxWidth: 480, margin: "0.8rem auto 1.5rem" }}
            >
              I trattamenti sono disponibili su prenotazione per gli ospiti
              delle nostre strutture. Contattaci per scegliere orario e
              trattamento preferito.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/contatti"
                className="btn-bnb btn-bnb-accent"
                style={{ padding: "0.65rem 1.8rem", fontSize: "0.85rem" }}
              >
                Prenota un trattamento
              </Link>
              <Link
                to="/strutture"
                className="btn-bnb"
                style={{ padding: "0.65rem 1.8rem", fontSize: "0.85rem" }}
              >
                Scopri le strutture
              </Link>
            </div>
          </div>
        </div> */}
      {/* </section> } */}
    </>
  );
}
