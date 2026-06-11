'use client';
import { useState } from 'react';
import { submitInquiry } from '@/lib/wordpress';

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || '#';
const AIRBNB_URL = process.env.NEXT_PUBLIC_AIRBNB_URL || '#';

const inputStyle = {
  border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
  padding: '0.75rem 1rem', fontSize: '0.95rem', background: 'var(--color-bg)',
};
const labelStyle = {
  fontWeight: 500, fontSize: '0.8rem', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: '0.4rem',
};

export default function ContattiForm() {
  const [form, setForm] = useState({ nome: '', email: '', telefono: '', checkin: '', checkout: '', ospiti: '2', messaggio: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    setSending(true);
    try {
      await submitInquiry(form);
      setSent(true);
      setForm({ nome: '', email: '', telefono: '', checkin: '', checkout: '', ospiti: '2', messaggio: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="text-center p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
      <h3 className="mb-3" style={{ fontFamily: 'var(--font-display)' }}>Richiesta inviata!</h3>
      <p className="text-muted">Grazie per il tuo interesse. Ti risponderemo entro 24 ore.</p>
      <button className="btn-bnb mt-3" onClick={() => setSent(false)}>Nuova richiesta</button>
    </div>
  );

  return (
    <>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
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
            <textarea name="messaggio" value={form.messaggio} onChange={handleChange} rows="4" className="form-control" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Richieste particolari, preferenze camera..." />
          </div>
          {error && <div className="col-12"><p className="text-danger mb-0" style={{ fontSize: '0.9rem' }}>{error}</p></div>}
          <div className="col-12 mt-2">
            <button type="button" onClick={handleSubmit} disabled={sending} className="btn-bnb btn-bnb-accent w-100">
              {sending ? 'Invio in corso…' : 'Invia richiesta'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 text-center" style={{ background: 'var(--color-bg-warm)', borderRadius: 'var(--radius-lg)' }}>
        <p className="mb-3" style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>Preferisci prenotare direttamente?</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Booking.com</a>
          <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer" className="btn-bnb" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Airbnb</a>
        </div>
      </div>
    </>
  );
}
