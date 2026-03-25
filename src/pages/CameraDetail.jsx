import { useParams, Link } from "react-router-dom";
import useWP from "../hooks/useWP";
import { getCameraBySlug } from "../lib/wordpress";
import Loader from "../components/Loader";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "#";

export default function CameraDetail() {
  const { slug } = useParams();
  const { data: camera, loading } = useWP(() => getCameraBySlug(slug), [slug]);

  if (loading) return <Loader />;

  if (!camera) {
    return (
      <div className="section-padding text-center">
        <h2>Camera non trovata</h2>
        <Link to="/camere" className="btn-bnb mt-3">← Torna alle camere</Link>
      </div>
    );
  }

  const gallery = camera.gallery || [];

  return (
    <section className="section-padding">
      <div className="container">
        <Link to="/camere" className="text-decoration-none d-inline-block mb-4" style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}>
          ← Tutte le camere
        </Link>

        <div className="row g-5">
          <div className="col-lg-7 fade-in">
            {camera.featuredImage && (
              <img src={camera.featuredImage.url} alt={camera.featuredImage.alt} className="w-100 img-bnb" style={{ aspectRatio: "16/11" }} />
            )}

            {gallery.length > 0 && (
              <div className="row g-2 mt-2">
                {gallery.map((img, i) => (
                  <div className="col-4" key={i}>
                    <img src={img.url || img} alt={img.alt || `Foto ${i + 1}`} className="w-100 img-bnb" style={{ aspectRatio: "1", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-5 fade-in fade-in-d1">
            <h1 className="mb-3" style={{ fontFamily: "var(--font-display)" }} dangerouslySetInnerHTML={{ __html: camera.title }} />
            <hr className="section-divider" />

            <div className="mb-4">
              {camera.prezzo && (
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <span className="text-muted">Prezzo</span>
                  <strong style={{ color: "var(--color-accent)" }}>da €{camera.prezzo}/notte</strong>
                </div>
              )}
              {camera.ospiti && (
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <span className="text-muted">Ospiti max</span>
                  <strong>{camera.ospiti}</strong>
                </div>
              )}
              {camera.superficie && (
                <div className="d-flex justify-content-between py-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <span className="text-muted">Superficie</span>
                  <strong>{camera.superficie}</strong>
                </div>
              )}
            </div>

            {camera.servizi && (
              <div className="mb-4">
                <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Servizi in camera</h5>
                <p className="text-muted">{camera.servizi}</p>
              </div>
            )}

            {camera.content && (
              <div className="wp-content mb-4" dangerouslySetInnerHTML={{ __html: camera.content }} />
            )}

            <div className="d-flex gap-3 flex-wrap">
              <a href={camera.bookingUrl || BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb btn-bnb-accent">
                Prenota questa camera
              </a>
              <Link to="/contatti" className="btn-bnb">
                Richiedi info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
