import { useState, useEffect } from "react";
import useAvailability, { isRangeBlocked } from "../hooks/useAvailability";
import { submitBooking, getPricing } from "../lib/wordpress";

// ─────────────────────────────────────────────────────────────
// Costanti
// ─────────────────────────────────────────────────────────────
const STRUTTURE = [
  {
    id: "sternatia",
    label: "Sternatia",
    sublabel: "Casa intera",
    icon: "🏡",
    desc: "Affitto esclusivo dell'intera dimora nel cuore del Salento.",
  },
  {
    id: "corigliano",
    label: "Corigliano d'Otranto",
    sublabel: "B&B",
    icon: "🏨",
    desc: "Scegli la tua camera nel nostro B&B con spa.",
  },
];

const CAMERE = [
  { id: "corigliano-camera-1", label: "Camera 1" },
  { id: "corigliano-camera-2", label: "Camera 2" },
];

const TODAY = new Date().toISOString().slice(0, 10);

const UNIT_LABELS = {
  sternatia: "Sternatia — Casa intera",
  "corigliano-camera-1": "Corigliano — Camera 1",
  "corigliano-camera-2": "Corigliano — Camera 2",
};

// ─────────────────────────────────────────────────────────────
// Helpers UI
// ─────────────────────────────────────────────────────────────
function nightsBetween(ci, co) {
  if (!ci || !co) return 0;
  return Math.round((new Date(co) - new Date(ci)) / 86400000);
}

function fmt(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// ─────────────────────────────────────────────────────────────
// Componente principale
// ─────────────────────────────────────────────────────────────
export default function BookingWidget() {
  // step: "struttura" | "camera" | "date" | "dati" | "success"
  const [step, setStep] = useState("struttura");
  const [struttura, setStruttura] = useState(null); // "sternatia" | "corigliano"
  const [unit, setUnit] = useState(null); // ID completo unità
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    ospiti: "2",
    nome: "",
    email: "",
    telefono: "",
    messaggio: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  const { blocked, loading: loadingCalendar } = useAvailability(unit);

  // Calcola prezzo appena date + ospiti sono pronti e non ci sono errori
  useEffect(() => {
    if (!unit || !form.checkin || !form.checkout || form.checkout <= form.checkin) {
      setPricing(null);
      return;
    }
    if (isRangeBlocked(form.checkin, form.checkout, blocked)) {
      setPricing(null);
      return;
    }
    let cancelled = false;
    setLoadingPricing(true);
    getPricing({ unit, checkin: form.checkin, checkout: form.checkout, ospiti: form.ospiti })
      .then((data) => { if (!cancelled) setPricing(data); })
      .catch(() => { if (!cancelled) setPricing(null); })
      .finally(() => { if (!cancelled) setLoadingPricing(false); });
    return () => { cancelled = true; };
  }, [unit, form.checkin, form.checkout, form.ospiti, blocked]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Aggiorna check-in e forza reset del check-out se necessario
  const handleCheckin = (e) => {
    const ci = e.target.value;
    setForm((prev) => ({
      ...prev,
      checkin: ci,
      checkout: prev.checkout && prev.checkout <= ci ? "" : prev.checkout,
    }));
    setError(null);
  };

  const handleCheckinBlur = () => {
    if (!form.checkin || !form.checkout) return;
    if (isRangeBlocked(form.checkin, form.checkout, blocked)) {
      setError(
        "Le date selezionate non sono disponibili. Scegli un altro periodo.",
      );
    } else {
      setError(null);
    }
  };

  const handleCheckout = (e) => {
    const co = e.target.value;
    setForm((prev) => ({ ...prev, checkout: co }));
    if (form.checkin && co) {
      if (isRangeBlocked(form.checkin, co, blocked)) {
        setError(
          "Le date selezionate non sono disponibili. Scegli un altro periodo.",
        );
      } else {
        setError(null);
      }
    }
  };

  const canProceedDates =
    form.checkin &&
    form.checkout &&
    form.checkout > form.checkin &&
    !isRangeBlocked(form.checkin, form.checkout, blocked);

  const handleSubmit = async () => {
    setError(null);
    if (!form.nome || !form.email) {
      setError("Nome ed email sono obbligatori.");
      return;
    }
    setSending(true);
    try {
      const result = await submitBooking({
        unit,
        checkin: form.checkin,
        checkout: form.checkout,
        ospiti: parseInt(form.ospiti),
        nome: form.nome,
        email: form.email,
        telefono: form.telefono,
        messaggio: form.messaggio,
      });
      setBookingId(result.id);
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setStep("struttura");
    setStruttura(null);
    setUnit(null);
    setForm({
      checkin: "",
      checkout: "",
      ospiti: "2",
      nome: "",
      email: "",
      telefono: "",
      messaggio: "",
    });
    setError(null);
    setBookingId(null);
  };

  // ── Stili condivisi ──────────────────────────────────────
  const card = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "2rem",
    maxWidth: "1200px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.42)",
  };
  const inputStyle = {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    background: "var(--color-bg)",
    width: "100%",
  };
  const labelStyle = {
    fontWeight: 500,
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.4rem",
    display: "block",
  };

  // ── Render step ──────────────────────────────────────────

  // STEP 1 — Scelta struttura
  if (step === "struttura") {
    return (
      <div style={card}>
        <h4
          style={{ fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}
        >
          Dove vuoi soggiornare?
        </h4>
        <div className="row g-3">
          {STRUTTURE.map((s) => (
            <div className="col-md-6" key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setStruttura(s.id);
                  if (s.id === "sternatia") {
                    setUnit("sternatia");
                    setStep("date");
                  } else {
                    setStep("camera");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  textAlign: "left",
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {s.icon}
                </div>
                <div className="px-4">
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-accent)",
                      fontWeight: 600,
                    }}
                  >
                    {s.sublabel}
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-muted)",
                      marginTop: "0.5rem",
                      marginBottom: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2 — Scelta camera (solo Corigliano)
  if (step === "camera") {
    return (
      <div style={card}>
        <button
          type="button"
          onClick={() => setStep("struttura")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            padding: 0,
          }}
        >
          ← Torna indietro
        </button>
        <h4
          style={{ fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}
        >
          Corigliano d'Otranto — Scegli la camera
        </h4>
        <div className="row g-3">
          {CAMERE.map((c) => (
            <div className="col-md-6" key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setUnit(c.id);
                  setStep("date");
                }}
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  textAlign: "center",
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-border)")
                }
              >
                🛏 {c.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP 3 — Date
  if (step === "date") {
    const nights = nightsBetween(form.checkin, form.checkout);
    return (
      <div style={card}>
        <button
          type="button"
          onClick={() =>
            setStep(struttura === "corigliano" ? "camera" : "struttura")
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            padding: 0,
          }}
        >
          ← Torna indietro
        </button>
        <h4
          style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}
        >
          {UNIT_LABELS[unit]}
        </h4>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-muted)",
            marginBottom: "1.5rem",
          }}
        >
          {loadingCalendar
            ? "Caricamento disponibilità…"
            : "Seleziona il periodo di soggiorno."}
        </p>

        <div className="row g-3">
          <div className="col-md-6">
            <label style={labelStyle}>Check-in</label>
            <input
              type="date"
              name="checkin"
              value={form.checkin}
              min={TODAY}
              onChange={handleCheckin}
              onBlur={handleCheckinBlur}
              style={inputStyle}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Check-out</label>
            <input
              type="date"
              name="checkout"
              value={form.checkout}
              min={form.checkin || TODAY}
              onChange={handleCheckout}
              disabled={!form.checkin}
              style={{ ...inputStyle, opacity: !form.checkin ? 0.5 : 1 }}
            />
          </div>
          <div className="col-md-4">
            <label style={labelStyle}>Ospiti</label>
            <select
              name="ospiti"
              value={form.ospiti}
              onChange={handleChange}
              style={inputStyle}
            >
              {[1, 2, 3, 4, "5+"].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "ospite" : "ospiti"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-danger, #dc3545)",
              fontSize: "0.88rem",
              marginTop: "1rem",
            }}
          >
            ⚠ {error}
          </p>
        )}

        {nights > 0 && !error && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "var(--color-muted)",
            }}
          >
            📅 {fmt(form.checkin)} → {fmt(form.checkout)} ·{" "}
            <strong>
              {nights} nott{nights === 1 ? "e" : "i"}
            </strong>
          </p>
        )}

        {/* Stima prezzo */}
        {nights > 0 && !error && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius)",
              background: "var(--color-bg-warm, #faf7f4)",
              border: "1px solid var(--color-border)",
            }}
          >
            {loadingPricing ? (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-muted)" }}>
                Calcolo prezzo…
              </p>
            ) : pricing && !pricing.errori?.length ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Stima totale</span>
                  <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-accent)" }}>
                    €{pricing.totale}
                  </span>
                </div>
                {pricing.extra_ospiti > 0 && (
                  <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", color: "var(--color-muted)" }}>
                    Include supplemento ospiti aggiuntivi: €{pricing.extra_ospiti}
                  </p>
                )}
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  Prezzo indicativo · {pricing.notti} nott{pricing.notti === 1 ? "e" : "i"} · può variare al momento della conferma
                </p>
              </>
            ) : pricing?.errori?.length ? (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-danger, #dc3545)" }}>
                ⚠ {pricing.errori[0]}
              </p>
            ) : null}
          </div>
        )}

        <button
          type="button"
          onClick={() => setStep("dati")}
          disabled={!canProceedDates || loadingCalendar}
          className="btn-bnb btn-bnb-accent mt-3"
          style={{ opacity: !canProceedDates || loadingCalendar ? 0.5 : 1 }}
        >
          Continua →
        </button>
      </div>
    );
  }

  // STEP 4 — Dati ospite
  if (step === "dati") {
    const nights = nightsBetween(form.checkin, form.checkout);
    return (
      <div style={card}>
        <button
          type="button"
          onClick={() => setStep("date")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            padding: 0,
          }}
        >
          ← Torna indietro
        </button>

        {/* Riepilogo */}
        <div
          style={{
            background: "var(--color-bg-warm, #faf7f4)",
            borderRadius: "var(--radius)",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            fontSize: "0.88rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <strong>{UNIT_LABELS[unit]}</strong>
              <br />
              {fmt(form.checkin)} → {fmt(form.checkout)}
              {" · "}
              {nights} nott{nights === 1 ? "e" : "i"}
              {" · "}
              {form.ospiti} ospiti
            </div>
            {pricing && !pricing.errori?.length && (
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-accent)" }}>
                  €{pricing.totale}
                </span>
                <div style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>stima totale</div>
              </div>
            )}
          </div>
        </div>

        <h4
          style={{ fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}
        >
          I tuoi dati
        </h4>

        <div className="row g-3">
          <div className="col-md-6">
            <label style={labelStyle}>Nome completo *</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Il tuo nome"
              style={inputStyle}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="email@esempio.com"
              style={inputStyle}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Telefono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+39..."
              style={inputStyle}
            />
          </div>
          <div className="col-12">
            <label style={labelStyle}>Messaggio (opzionale)</label>
            <textarea
              name="messaggio"
              value={form.messaggio}
              onChange={handleChange}
              rows="3"
              placeholder="Richieste particolari, orario di arrivo previsto…"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-danger, #dc3545)",
              fontSize: "0.88rem",
              marginTop: "1rem",
            }}
          >
            ⚠ {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending}
          className="btn-bnb btn-bnb-accent mt-3 w-100"
        >
          {sending ? "Invio in corso…" : "Invia richiesta"}
        </button>
      </div>
    );
  }

  // STEP 5 — Successo
  if (step === "success") {
    return (
      <div style={{ ...card, textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3
          style={{ fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}
        >
          Richiesta inviata!
        </h3>
        <p
          style={{
            color: "var(--color-muted)",
            maxWidth: 400,
            margin: "0 auto 1.5rem",
          }}
        >
          Grazie per la tua richiesta. Ti risponderemo entro 24 ore
          all'indirizzo <strong>{form.email}</strong>.
        </p>
        {bookingId && (
          <p style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
            Riferimento prenotazione: #{bookingId}
          </p>
        )}
        <button type="button" className="btn-bnb mt-3" onClick={reset}>
          Nuova richiesta
        </button>
      </div>
    );
  }

  return null;
}
le={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>stima totale</div>
              </div>
            )}
          </div>
        </div>

        <h4
          style={{ fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}
        >
          I tuoi dati
        </h4>

        <div className="row g-3">
          <div className="col-md-6">
            <label style={labelStyle}>Nome completo *</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Il tuo nome"
              style={inputStyle}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="email@esempio.com"
              style={inputStyle}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Telefono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+39..."
              style={inputStyle}
            />
          </div>
          <div className="col-12">
            <label style={labelStyle}>Messaggio (opzionale)</label>
            <textarea
              name="messaggio"
              value={form.messaggio}
              onChange={handleChange}
              rows="3"
              placeholder="Richieste particolari, orario di arrivo previsto…"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-danger, #dc3545)",
              fontSize: "0.88rem",
              marginTop: "1rem",
            }}
          >
            ⚠ {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending}
          className="btn-bnb btn-bnb-accent mt-3 w-100"
        >
          {sending ? "Invio in corso…" : "Invia richiesta"}
        </button>
      </div>
    );
  }

  // STEP 5 — Successo
  if (step === "success") {
    return (
      <div style={{ ...card, textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3
          style={{ fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}
        >
          Richiesta inviata!
        </h3>
        <p
          style={{
            color: "var(--color-muted)",
            maxWidth: 400,
            margin: "0 auto 1.5rem",
          }}
        >
          Grazie per la tua richiesta. Ti risponderemo entro 24 ore
          all'indirizzo <strong>{form.email}</strong>.
        </p>
        {bookingId && (
          <p style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
            Riferimento prenotazione: #{bookingId}
          </p>
        )}
        <button type="button" className="btn-bnb mt-3" onClick={reset}>
          Nuova richiesta
        </button>
      </div>
    );
  }

  return null;
}
