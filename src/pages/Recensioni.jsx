import useWP from "../hooks/useWP";
import { getRecensioni } from "../lib/wordpress";
import Loader from "../components/Loader";

const PLACEHOLDER = [
  { id: 1, nome: "Marco & Giulia", provenienza: "Milano", stelle: 5, testo: "Un posto magico. La struttura è bellissima, la colazione straordinaria con prodotti locali freschi. I proprietari sono gentilissimi e pieni di consigli. Torneremo sicuramente.", data_soggiorno: "Agosto 2025", piattaforma: "Booking.com" },
  { id: 2, nome: "Sophie", provenienza: "Parigi", stelle: 5, testo: "L'accueil est exceptionnel. Un endroit magnifique au cœur des Pouilles. Les propriétaires sont adorables et pleins de bons conseils pour découvrir la région.", data_soggiorno: "Luglio 2025", piattaforma: "Airbnb" },
  { id: 3, nome: "Thomas & Anna", provenienza: "Berlino", stelle: 5, testo: "Perfekte Lage, wunderschönes Anwesen mit viel Charme. Das Frühstück war ein Traum mit lokalen Produkten. Wir kommen definitiv wieder!", data_soggiorno: "Settembre 2025", piattaforma: "Booking.com" },
  { id: 4, nome: "Laura", provenienza: "Roma", stelle: 5, testo: "Una perla nascosta nel Salento. Camera splendida con volta a stella, giardino curatissimo con ulivi. La posizione è perfetta per esplorare sia Lecce che le spiagge.", data_soggiorno: "Giugno 2025", piattaforma: "Google" },
  { id: 5, nome: "James & Emily", provenienza: "Londra", stelle: 5, testo: "Absolutely wonderful. The hosts went above and beyond. Beautiful property, amazing breakfast, perfect location to explore Puglia. Can't recommend enough.", data_soggiorno: "Maggio 2025", piattaforma: "Airbnb" },
  { id: 6, nome: "Francesca", provenienza: "Bologna", stelle: 5, testo: "Ogni dettaglio è curato con amore. La struttura è un gioiello di architettura salentina restaurata con gusto. Colazione eccezionale. Ci torneremo per il nostro anniversario.", data_soggiorno: "Aprile 2025", piattaforma: "Booking.com" },
];

export default function Recensioni() {
  const { data: recensioniWP, loading } = useWP(() => getRecensioni());
  if (loading) return <Loader />;

  const recensioni = recensioniWP?.length > 0 ? recensioniWP : PLACEHOLDER;
  const media = (recensioni.reduce((s, r) => s + r.stelle, 0) / recensioni.length).toFixed(1);

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Testimonianze</span>
          <h1 className="section-title">I nostri ospiti raccontano</h1>
          <hr className="section-divider section-divider-center" />
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <span className="stars" style={{ fontSize: "1.3rem" }}>{"★".repeat(5)}</span>
            <span style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>{media}</span>
            <span className="text-muted">su 5 · {recensioni.length} recensioni</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            {recensioni.map((r, i) => (
              <div className="col-md-6 col-lg-4 fade-in" key={r.id} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="testimonial-card h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
                    <span className="stars">{"★".repeat(r.stelle)}{"☆".repeat(5 - r.stelle)}</span>
                    {r.piattaforma && (
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>{r.piattaforma}</small>
                    )}
                  </div>
                  <p className="flex-grow-1" style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--color-text)", lineHeight: 1.7 }}>
                    {r.testo}
                  </p>
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <strong>{r.nome}</strong>
                    <div className="d-flex gap-2">
                      {r.provenienza && <small className="text-muted">{r.provenienza}</small>}
                      {r.data_soggiorno && <small className="text-muted">· {r.data_soggiorno}</small>}
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
