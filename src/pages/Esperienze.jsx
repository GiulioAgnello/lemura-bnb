import useWP from "../hooks/useWP";
import { getEsperienze } from "../lib/wordpress";
import Loader from "../components/Loader";

const PLACEHOLDER = [
  { id: 1, title: "Centro storico di Lecce", tipologia: "Cultura", distanza: "15 min", featuredImage: { url: "https://images.unsplash.com/photo-1592482571769-2189eee1d7fc?w=600&q=80", alt: "Lecce" }, excerpt: "<p>La \"Firenze del Sud\" con il suo barocco leccese, le chiese, i palazzi storici e l'anfiteatro romano.</p>" },
  { id: 2, title: "Spiagge di Porto Cesareo", tipologia: "Mare", distanza: "30 min", featuredImage: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", alt: "Mare" }, excerpt: "<p>Acque cristalline e spiagge caraibiche. Le Maldive del Salento sono a pochi chilometri.</p>" },
  { id: 3, title: "Otranto e i suoi mosaici", tipologia: "Cultura", distanza: "40 min", featuredImage: { url: "https://images.unsplash.com/photo-1605779058711-14a83e700cb5?w=600&q=80", alt: "Otranto" }, excerpt: "<p>La cattedrale con il mosaico pavimentale più grande d'Europa, il castello aragonese e il centro storico.</p>" },
  { id: 4, title: "Frantoi ipogei e degustazioni", tipologia: "Enogastronomia", distanza: "10 min", featuredImage: { url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80", alt: "Ulivi" }, excerpt: "<p>Visita i frantoi sotterranei e degusta l'olio extravergine d'oliva salentino direttamente dai produttori.</p>" },
  { id: 5, title: "Grotta della Poesia", tipologia: "Natura", distanza: "35 min", featuredImage: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", alt: "Grotta" }, excerpt: "<p>Una delle piscine naturali più belle d'Italia, con iscrizioni messapiche millenarie.</p>" },
  { id: 6, title: "Gallipoli e la movida", tipologia: "Mare & Svago", distanza: "45 min", featuredImage: { url: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=600&q=80", alt: "Gallipoli" }, excerpt: "<p>Il centro storico sull'isola, le spiagge dorate e la vita notturna più vivace del Salento.</p>" },
];

export default function Esperienze() {
  const { data: esperienzeWP, loading } = useWP(() => getEsperienze());
  if (loading) return <Loader />;

  const esperienze = esperienzeWP?.length > 0 ? esperienzeWP : PLACEHOLDER;

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Esperienze</span>
          <h1 className="section-title">Cosa fare nel Salento</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 650, margin: "0 auto" }}>
            Dal barocco di Lecce alle spiagge cristalline, dai frantoi ipogei alla cucina locale:
            il Salento offre esperienze per ogni tipo di viaggiatore.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            {esperienze.map((exp, i) => (
              <div className="col-md-6 col-lg-4 fade-in" key={exp.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="card-bnb h-100">
                  {exp.featuredImage && (
                    <img src={exp.featuredImage.url} alt={exp.featuredImage.alt || exp.title} className="w-100" style={{ height: 220, objectFit: "cover" }} />
                  )}
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {exp.tipologia && (
                        <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 500, fontSize: "0.73rem", letterSpacing: "0.03em" }}>
                          {exp.tipologia}
                        </span>
                      )}
                      {exp.distanza && (
                        <small className="text-muted">{exp.distanza}</small>
                      )}
                    </div>
                    <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }} dangerouslySetInnerHTML={{ __html: exp.title }} />
                    <div className="text-muted" style={{ fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: exp.excerpt }} />
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
