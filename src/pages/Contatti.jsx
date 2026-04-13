import { useState } from "react";
import useWP from "../hooks/useWP";
import { getPageBySlug, submitInquiry } from "../lib/wordpress";
import Loader from "../components/Loader";

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || "#";
const AIRBNB_URL = import.meta.env.VITE_AIRBNB_URL || "#";

const PLACEHOLDER = {
  contatti_title: "Contattaci",
  contatti_subtitle: "Scrivici per verificare la disponibilità, chiedere informazioni o prenotare il tuo soggiorno nel Salento.",
  indirizzo: "Contrada Le Mura, Lecce (LE), Salento, Puglia",
  email: "info@lemuradegliangeli.com",
  telefono: "+39 000 000 0000",
  whatsapp: "+39 000 000 0000",
  mappa_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48576.53!2d18.17!3d40.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134439d8a6b0e0a7%3A0x4062e0a9e4e5b70!2sLecce%2C%20LE!5e0!3m2!1sit!2sit!4v1",
};

export default function Contatti() {
  const { data: page, loading } = useWP(() => getPageBySlug("contatti"));
  const [form, setForm] = useState({ nome: "", email: "", telefono: "", checkin: "", checkout: "", ospiti: "2", messaggio: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  if (loading) return <Loader />;

  const acf = page?.acf || {};
  const info = {
    title: acf.contatti_title || PLACEHOLDER.contatti_title,
    subtitle: acf.contatti_subtitle || PLACEHOLDER.contatti_subtitle,
    indirizzo: acf.indirizzo || PLACEHOLDER.indirizzo,
    email: acf.email || PLACEHOLDER.email,
    telefono: acf.telefono || PLACEHOLDER.telefono,
    whatsapp: acf.whatsapp || PLACEHOLDER.whatsapp,
    mappa: acf.mappa_embed || PLACEHOLDER.mappa_embed,
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    setSending(true);
    try {
      await submitInquiry(form);
      setSent(true);
      setForm({ nome: "", email: "", telefono: "", checkin: "", checkout: "", ospiti: "2", messaggio: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    background: "var(--color-bg)",
  };

  const labelStyle = {
    fontWeight: 500,
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.4rem",
  };

  return (
    <>
      {/* Header */}
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Contatti</span>
          <h1 className="section-title">{info.title}</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: "0 auto" }}>{info.subtitle}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            {/* Form richiesta disponibilità */}
            <div className="col-lg-7 fade-in">
              <h3 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
                Richiedi disponibilità
              </h3>

              {sent ? (
                <div className="text-center p-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                  <h3 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>Richiesta inviata!</h3>
                  <p className="text-muted">Grazie per il tuo interesse. Ti risponderemo entro 24 ore.</p>
                  <button className="btn-bnb mt-3" onClick={() => setSent(false)}>
                    Nuova richiesta
                  </button>
                </div>
              ) : (
                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "2rem" }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Nome completo</label>
                      <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="form-control" style={inputStyle} placeholder="Il tuo nome" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-control" style={inputStyle} placeholder="email@esempio.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Telefono</label>
                      <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} className="form-control" style={inputStyle} placeholder="+39..." />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Ospiti</label>
                      <select name="ospiti" value={form.ospiti} onChange={handleChange} className="form-select" style={inputStyle}>
                        <option value="1">1 ospite</option>
                        <option value="2">2 ospiti</option>
                        <option value="3">3 ospiti</option>
                        <option value="4">4 ospiti</option>
                        <option value="5+">5+ ospiti</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Check-in</label>
                      <input type="date" name="checkin" value={form.checkin} onChange={handleChange} className="form-control" style={inputStyle} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={labelStyle}>Check-out</label>
                      <input type="date" name="checkout" value={form.checkout} onChange={handleChange} className="form-control" style={inputStyle} />
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={labelStyle}>Messaggio (opzionale)</label>
                      <textarea name="messaggio" value={form.messaggio} onChange={handleChange} rows="4" className="form-control" style={{ ...inputStyle, resize: "vertical" }} placeholder="Richieste particolari, preferenze camera..." />
                    </div>
                    {error && (
                      <div className="col-12">
                        <p className="text-danger mb-0" style={{ fontSize: "0.9rem" }}>{error}</p>
                      </div>
                    )}
                    <div className="col-12 mt-2">
                      <button type="button" onClick={handleSubmit} disabled={sending} className="btn-bnb btn-bnb-accent w-100">
                        {sending ? "Invio in corso…" : "Invia richiesta"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Link prenotazione diretta */}
              <div className="mt-4 p-4 text-center" style={{ background: "var(--color-bg-warm)", borderRadius: "var(--radius-lg)" }}>
                <p className="mb-3" style={{ fontSize: "0.95rem", color: "var(--color-text)" }}>
                  Preferisci prenotare direttamente?
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}>
                    Booking.com
                  </a>
                  <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }}>
                    Airbnb
                  </a>
                </div>
              </div>
            </div>

            {/* Info + Mappa */}
            <div className="col-lg-4 offset-lg-1 fade-in fade-in-d1">
              <div className="mb-5">
                <h5 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>Dove siamo</h5>
                <p className="text-muted">{info.indirizzo}</p>
              </div>

              <div className="mb-5">
                <h5 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>Email</h5>
                <a href={`mailto:${info.email}`}>{info.email}</a>
              </div>

              <div className="mb-5">
                <h5 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>Telefono / WhatsApp</h5>
                <a href={`tel:${info.telefono}`}>{info.telefono}</a>
                {info.whatsapp && (
                  <div className="mt-2">
                    <a href={`https://wa.me/${info.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: "0.5rem 1.2rem", fontSize: "0.78rem", borderColor: "#25D366", color: "#25D366" }}>
                      Scrivici su WhatsApp
                    </a>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h5 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>Come raggiungerci</h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Aeroporto di Brindisi: 40 min in auto<br />
                  Stazione di Lecce: 15 min in auto<br />
                  Centro storico di Lecce: 10 min
                </p>
              </div>

              {/* Mappa */}
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                <iframe
                  src={info.mappa}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Le Mura degli Angeli"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
