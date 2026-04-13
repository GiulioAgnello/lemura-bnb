import { Link } from "react-router-dom";

const AIRBNB_URL = import.meta.env.VITE_AIRBNB_URL || "#";

export default function Footer() {
  return (
    <footer className="footer-bnb">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 mb-3 mb-lg-0">
            <h5 style={{ fontFamily: "var(--font-display)" }}>
              Le Mura degli Angeli
            </h5>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.55)" }}>
              Un angolo di pace nel cuore del Salento.
              <br />
              Ospitalità autentica tra storia, ulivi e mare.
            </p>
          </div>

          <div className="col-lg-3">
            <h5>Naviga</h5>
            <div className="d-flex flex-column gap-1">
              <Link to="/camere">Camere</Link>
              <Link to="/esperienze">Esperienze</Link>
              <Link to="/galleria">Galleria</Link>
              <Link to="/contatti">Contatti</Link>
            </div>
          </div>

          <div className="col-lg-3">
            <h5>Contatti</h5>
            <div
              className="d-flex flex-column gap-1"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <span>Lecce, Salento (LE)</span>
              <a href="tel:+393271208496">+39 327 120 8496</a>
              <a href="mailto:lemuradegliangeli@yahoo.com">
                lemuradegliangeli@yahoo.com
              </a>
            </div>
          </div>

          <div className="col-lg-2 text-lg-end">
            <h5>Prenota</h5>
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bnb btn-bnb-white"
              style={{ fontSize: "0.75rem", padding: "0.6rem 1.2rem" }}
            >
              Airbnb.com
            </a>
          </div>
        </div>

        <hr
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            margin: "2rem 0 1.5rem",
          }}
        />

        <div className="text-center" style={{ fontSize: "0.8rem" }}>
          <span>
            &copy; {new Date().getFullYear()} Le Mura degli Angeli — CIN:
            IT075080C200098254
          </span>
          <span className="mx-2">·</span>
          <span>Sito realizzato da Giulio Agnello</span>
        </div>
      </div>
    </footer>
  );
}
