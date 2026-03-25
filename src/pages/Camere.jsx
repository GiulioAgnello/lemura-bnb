import { Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getCamere } from "../lib/wordpress";
import Loader from "../components/Loader";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "#";

const PLACEHOLDER_CAMERE = [
  {
    id: 1,
    title: "Suite degli Ulivi",
    slug: "suite-ulivi",
    prezzo: "120",
    ospiti: "2",
    superficie: "35 mq",
    servizi: "Vista giardino, vasca idromassaggio, minibar",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      alt: "Suite",
    },
  },
  {
    id: 2,
    title: "Camera del Mare",
    slug: "camera-mare",
    prezzo: "95",
    ospiti: "2",
    superficie: "25 mq",
    servizi: "Terrazza privata, aria condizionata",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1590490360182-c33d3bbe7bba?w=600&q=80",
      alt: "Camera",
    },
  },
  {
    id: 3,
    title: "Camera della Pietra",
    slug: "camera-pietra",
    prezzo: "85",
    ospiti: "2",
    superficie: "22 mq",
    servizi: "Volta a stella, pavimento originale",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
      alt: "Camera",
    },
  },
];

export default function Camere() {
  const { data: camereWP, loading } = useWP(() => getCamere());
  if (loading) return <Loader />;

  const camere = camereWP?.length > 0 ? camereWP : PLACEHOLDER_CAMERE;

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Ospitalità</span>
          <h1 className="section-title">Le nostre camere</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: "0 auto" }}>
            Ogni camera è stata ricavata dal restauro dell'antica dimora,
            conservando volte, pietre e dettagli originali con comfort moderni.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {camere.map((camera, i) => (
            <div
              className={`row align-items-center g-5 mb-5 pb-5 fade-in ${i < camere.length - 1 ? "" : ""}`}
              key={camera.id}
              style={{
                borderBottom:
                  i < camere.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <div className={`col-lg-6 ${i % 2 !== 0 ? "order-lg-2" : ""}`}>
                {camera.featuredImage && (
                  <Link to={`/camere/${camera.slug}`}>
                    <img
                      src={camera.featuredImage.url}
                      alt={camera.featuredImage.alt || camera.title}
                      className="img-bnb w-100"
                      style={{ aspectRatio: "16/11", objectFit: "cover" }}
                    />
                  </Link>
                )}
              </div>
              <div
                className={`col-lg-5 ${i % 2 !== 0 ? "order-lg-1 offset-lg-0" : "offset-lg-1"}`}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.7rem",
                  }}
                >
                  <Link
                    to={`/camere/${camera.slug}`}
                    className="text-decoration-none"
                    style={{ color: "var(--color-text)" }}
                    dangerouslySetInnerHTML={{ __html: camera.title }}
                  />
                </h3>
                <hr className="section-divider" />

                <div
                  className="d-flex flex-wrap gap-4 mb-3"
                  style={{ fontSize: "0.9rem" }}
                >
                  {camera.ospiti && (
                    <div>
                      <small className="text-muted d-block">Ospiti</small>
                      <strong>{camera.ospiti}</strong>
                    </div>
                  )}
                  {camera.superficie && (
                    <div>
                      <small className="text-muted d-block">Superficie</small>
                      <strong>{camera.superficie}</strong>
                    </div>
                  )}
                  {camera.prezzo && (
                    <div>
                      <small className="text-muted d-block">Prezzo</small>
                      <strong style={{ color: "var(--color-accent)" }}>
                        da €{camera.prezzo}/notte
                      </strong>
                    </div>
                  )}
                </div>

                {camera.servizi && (
                  <p
                    className="text-muted mb-4"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {camera.servizi}
                  </p>
                )}

                <div className="d-flex gap-3">
                  <Link
                    to={`/camere/${camera.slug}`}
                    className="btn-bnb"
                    style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}
                  >
                    Dettagli
                  </Link>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bnb btn-bnb-accent"
                    style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}
                  >
                    Prenota
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
