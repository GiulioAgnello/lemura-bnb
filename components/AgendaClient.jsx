'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Chiamate al proxy same-origin (app/api/agenda) per evitare il blocco
// cross-origin (503) di SiteGround sulle richieste dirette dal browser.
const CRM = '/api/agenda';

/* ------------------------------------------------------------------ */
/* Costanti / helper                                                   */
/* ------------------------------------------------------------------ */

const UNITS = [
  { key: 'sternatia', label: 'Sternatia', color: '#0d9488' },
  { key: 'corigliano-camera-1', label: 'Camera 1', color: '#2563eb' },
  { key: 'corigliano-camera-2', label: 'Camera 2', color: '#7c3aed' },
];
const unitInfo = (k) => UNITS.find((u) => u.key === k) || { label: k, color: '#6b7280' };

const SOURCE_BADGE = {
  airbnb: { label: 'Airbnb', bg: '#ffe4e6', fg: '#be123c' },
  booking: { label: 'Booking', bg: '#dbeafe', fg: '#1d4ed8' },
  website: { label: 'Sito', bg: '#dcfce7', fg: '#15803d' },
  manual: { label: 'Blocco', bg: '#e5e7eb', fg: '#374151' },
};
const PAYMENT = {
  unpaid: { label: 'Non pagato', color: '#dc2626' },
  deposit: { label: 'Acconto', color: '#d97706' },
  paid: { label: 'Saldato', color: '#16a34a' },
};
const CLEANING = {
  todo: { label: 'Pulizia da fare', color: '#d97706' },
  done: { label: 'Pulizia fatta', color: '#16a34a' },
};

const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const fmtLong = (s) => { if (!s) return ''; const d = parseISO(s); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const fmtShort = (s) => { if (!s) return ''; const d = parseISO(s); return `${WEEKDAYS[(d.getDay() + 6) % 7]} ${d.getDate()}/${pad(d.getMonth() + 1)}`; };
const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export default function AgendaClient() {
  const [code, setCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterUnit, setFilterUnit] = useState('all');
  const [cursor, setCursor] = useState(() => { const d = today(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selected, setSelected] = useState(null);   // booking in modale
  const [showBlock, setShowBlock] = useState(false);
  const [blockPreset, setBlockPreset] = useState(null); // data preselezionata dal calendario

  /* --- lettura codice da URL all'avvio --- */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get('code');
    if (c) { setCode(c); setAuthed(true); }
  }, []);

  /* --- fetch prenotazioni --- */
  const load = useCallback(async (theCode) => {
    const c = theCode ?? code;
    if (!c) return;
    setLoading(true); setError('');
    try {
      const from = iso(addDays(today(), -1));
      const res = await fetch(`${CRM}?code=${encodeURIComponent(c)}&from=${from}`, { cache: 'no-store' });
      if (res.status === 401) { setError('Codice di accesso non valido.'); setAuthed(false); setLoading(false); return; }
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setAuthed(true);
    } catch (e) {
      setError('Impossibile caricare l\'agenda. Riprova.');
    } finally { setLoading(false); }
  }, [code]);

  useEffect(() => { if (authed && code) load(code); }, [authed, code, load]);

  const submitCode = (e) => {
    e.preventDefault();
    const c = codeInput.trim();
    if (!c) return;
    const url = new URL(window.location.href);
    url.searchParams.set('code', c);
    window.history.replaceState({}, '', url);
    setCode(c); setAuthed(true);
  };

  /* --- azioni scrittura --- */
  const saveBooking = async (id, patch) => {
    const res = await fetch(`${CRM}/${id}?code=${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error('save');
    const data = await res.json();
    setBookings((b) => b.map((x) => (x.id === id ? data.booking : x)));
    return data.booking;
  };

  const deleteBooking = async (id) => {
    const res = await fetch(`${CRM}/${id}?code=${encodeURIComponent(code)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete');
    setBookings((b) => b.filter((x) => x.id !== id));
  };

  const createBlock = async (payload) => {
    const res = await fetch(`${CRM}/block?code=${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Errore nella creazione del blocco.');
    setBookings((b) => [...b, data.booking]);
    return data.booking;
  };

  /* --- derivati --- */
  const visible = useMemo(
    () => bookings.filter((b) => filterUnit === 'all' || b.unit === filterUnit),
    [bookings, filterUnit]
  );

  const t = iso(today());
  const upcoming = useMemo(
    () => visible.filter((b) => b.checkin >= t).sort((a, b) => a.checkin.localeCompare(b.checkin)),
    [visible, t]
  );
  const nextArrival = upcoming[0] || null;
  const next30 = useMemo(() => {
    const limit = iso(addDays(today(), 30));
    return upcoming.filter((b) => b.checkin <= limit);
  }, [upcoming]);

  /* ------------------------------------------------------------------ */
  /* Gate codice                                                         */
  /* ------------------------------------------------------------------ */
  if (!authed) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh', padding: '2rem' }}>
        <form onSubmit={submitCode} className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 360, width: '100%', border: '1px solid #eee' }}>
          <h1 className="h4 mb-1">Agenda collaboratori</h1>
          <p className="text-muted small mb-3">Inserisci il codice di accesso.</p>
          <input
            type="password" autoFocus value={codeInput} onChange={(e) => setCodeInput(e.target.value)}
            className="form-control form-control-lg mb-3" placeholder="Codice" />
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <button className="btn btn-dark w-100 btn-lg" type="submit">Entra</button>
        </form>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* App                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container-fluid py-4" style={{ maxWidth: 1100 }}>
      {/* Barra superiore */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0 me-auto">Agenda</h1>
        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
          <option value="all">Tutte le unità</option>
          {UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
        </select>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => load()} disabled={loading}>
          {loading ? '…' : '↻ Aggiorna'}
        </button>
        <button className="btn btn-sm btn-dark" onClick={() => setShowBlock(true)}>+ Blocca date</button>
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}

      {/* Prossimo arrivo */}
      <NextArrivalCard booking={nextArrival} onOpen={setSelected} />

      {/* Lista prossimi 30 giorni */}
      <div className="mt-4">
        <h2 className="h6 text-uppercase text-muted mb-2" style={{ letterSpacing: '.05em' }}>Prossimi arrivi · 30 giorni</h2>
        {next30.length === 0 ? (
          <p className="text-muted small">Nessun arrivo previsto nei prossimi 30 giorni.</p>
        ) : (
          <div className="list-group shadow-sm">
            {next30.map((b) => <ArrivalRow key={b.id} b={b} onOpen={() => setSelected(b)} />)}
          </div>
        )}
      </div>

      {/* Calendario */}
      <div className="mt-4">
        <Calendar cursor={cursor} setCursor={setCursor} bookings={visible} onOpen={setSelected}
          onPickDay={(day) => { setShowBlock(true); setBlockPreset(day); }} />
      </div>

      {/* Modale dettaglio/modifica */}
      {selected && (
        <DetailModal booking={selected} onClose={() => setSelected(null)}
          onSave={saveBooking} onDelete={deleteBooking} />
      )}

      {/* Modale blocca date */}
      {showBlock && (
        <BlockModal onClose={() => { setShowBlock(false); setBlockPreset(null); }}
          onCreate={createBlock} preset={blockPreset} filterUnit={filterUnit} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sotto-componenti                                                    */
/* ------------------------------------------------------------------ */

function SourceBadge({ source }) {
  const s = SOURCE_BADGE[source] || SOURCE_BADGE.manual;
  return <span className="badge rounded-pill" style={{ background: s.bg, color: s.fg, fontWeight: 600 }}>{s.label}</span>;
}

function Dot({ color, title }) {
  return <span title={title} style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: color, marginRight: 4 }} />;
}

function NextArrivalCard({ booking, onOpen }) {
  if (!booking) {
    return <div className="p-4 rounded-4 bg-light text-muted text-center">Nessun arrivo in programma.</div>;
  }
  const u = unitInfo(booking.unit);
  const d = daysBetween(iso(today()), booking.checkin);
  const when = d <= 0 ? 'In corso / oggi' : d === 1 ? 'Domani' : `Tra ${d} giorni`;
  return (
    <div className="p-4 rounded-4 shadow-sm text-white" style={{ background: `linear-gradient(135deg, ${u.color}, #111827)`, cursor: 'pointer' }} onClick={() => onOpen(booking)}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-uppercase small opacity-75" style={{ letterSpacing: '.08em' }}>Prossimo arrivo · {when}</div>
          <div className="display-6 fw-bold mt-1">{booking.guest_name || 'Ospite'}</div>
          <div className="mt-2 fs-5">{u.label} · {fmtLong(booking.checkin)}{booking.checkin_time ? ` · h ${booking.checkin_time}` : ''}</div>
          <div className="opacity-75 mt-1">Partenza: {fmtLong(booking.checkout)}{booking.checkout_time ? ` · h ${booking.checkout_time}` : ''}</div>
        </div>
        <SourceBadge source={booking.source} />
      </div>
    </div>
  );
}

function ArrivalRow({ b, onOpen }) {
  const u = unitInfo(b.unit);
  const pay = PAYMENT[b.payment];
  const cl = CLEANING[b.cleaning];
  return (
    <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 text-start" onClick={onOpen}>
      <div className="text-center" style={{ minWidth: 54 }}>
        <div className="fw-bold" style={{ fontSize: '1.3rem', lineHeight: 1 }}>{parseISO(b.checkin).getDate()}</div>
        <div className="small text-muted text-uppercase">{MONTHS[parseISO(b.checkin).getMonth()].slice(0, 3)}</div>
      </div>
      <div style={{ width: 4, alignSelf: 'stretch', background: u.color, borderRadius: 4 }} />
      <div className="flex-grow-1">
        <div className="fw-semibold">{b.guest_name || 'Ospite'}</div>
        <div className="small text-muted">{u.label} · {daysBetween(b.checkin, b.checkout)} notti · fino al {fmtShort(b.checkout)}</div>
      </div>
      <div className="text-end">
        <SourceBadge source={b.source} />
        <div className="small mt-1">
          {pay && <Dot color={pay.color} title={pay.label} />}
          {cl && <Dot color={cl.color} title={cl.label} />}
        </div>
      </div>
    </button>
  );
}

/* --------------------------- Calendario --------------------------- */

function Calendar({ cursor, setCursor, bookings, onOpen, onPickDay }) {
  const { y, m } = cursor;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7; // lun=0
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // mappa giorno ISO -> prenotazioni che occupano quella notte
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dISO = `${y}-${pad(m + 1)}-${pad(day)}`;
    const occ = bookings.filter((b) => b.checkin <= dISO && dISO < b.checkout);
    const arrivals = bookings.filter((b) => b.checkin === dISO);
    cells.push({ day, dISO, occ, arrivals });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const tISO = iso(today());
  return (
    <div className="p-3 rounded-4 shadow-sm bg-white" style={{ border: '1px solid #eee' }}>
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setCursor(m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 })}>‹</button>
        <div className="fw-bold mx-3 flex-grow-1 text-center fs-5">{MONTHS[m]} {y}</div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setCursor(m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 })}>›</button>
        <button className="btn btn-sm btn-link ms-2" onClick={() => { const d = today(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); }}>Oggi</button>
      </div>
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {WEEKDAYS.map((w) => <div key={w} className="text-center small text-muted fw-semibold">{w}</div>)}
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const isToday = c.dISO === tISO;
          const isPast = c.dISO < tISO;
          return (
            <div key={i} onClick={() => c.occ.length === 0 && onPickDay(c.dISO)}
              style={{
                minHeight: 74, borderRadius: 8, padding: 4, cursor: c.occ.length === 0 ? 'pointer' : 'default',
                border: isToday ? '2px solid #111827' : '1px solid #f0f0f0',
                background: isPast ? '#fafafa' : '#fff', opacity: isPast ? 0.65 : 1,
              }}>
              <div className="small fw-semibold text-muted">{c.day}</div>
              <div className="d-flex flex-column gap-1 mt-1">
                {c.occ.slice(0, 3).map((b) => {
                  const u = unitInfo(b.unit);
                  const isArr = b.checkin === c.dISO;
                  return (
                    <div key={b.id} onClick={(e) => { e.stopPropagation(); onOpen(b); }}
                      title={`${u.label} · ${b.guest_name || 'Ospite'}`}
                      style={{
                        fontSize: 10, lineHeight: 1.3, color: '#fff', background: u.color,
                        borderRadius: 4, padding: '1px 4px', cursor: 'pointer', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        borderLeft: isArr ? '3px solid rgba(255,255,255,.85)' : 'none',
                      }}>
                      {isArr ? '▸ ' : ''}{(b.guest_name || 'Ospite').split(' ')[0]}
                    </div>
                  );
                })}
                {c.occ.length > 3 && <div className="small text-muted" style={{ fontSize: 10 }}>+{c.occ.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
        {UNITS.map((u) => <span key={u.key}><Dot color={u.color} /> {u.label}</span>)}
        <span className="ms-auto">▸ arrivo · clic su giorno libero = blocca</span>
      </div>
    </div>
  );
}

/* ------------------------ Modale dettaglio ------------------------ */

function DetailModal({ booking, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(booking);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const u = unitInfo(booking.unit);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true); setErr('');
    try {
      const patch = {
        guest_name: form.guest_name, guest_phone: form.guest_phone, guest_email: form.guest_email,
        guests: form.guests, checkin_time: form.checkin_time, checkout_time: form.checkout_time,
        payment: form.payment, cleaning: form.cleaning, notes: form.notes,
      };
      if (!booking.locked) { patch.checkin = form.checkin; patch.checkout = form.checkout; }
      await onSave(booking.id, patch);
      onClose();
    } catch (e) { setErr('Errore nel salvataggio.'); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm('Liberare queste date? Il blocco verrà eliminato.')) return;
    setBusy(true); setErr('');
    try { await onDelete(booking.id); onClose(); }
    catch (e) { setErr('Errore nell\'eliminazione.'); setBusy(false); }
  };

  return (
    <Modal onClose={onClose}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: u.color }} />
        <h2 className="h5 mb-0 flex-grow-1">{u.label}</h2>
        <SourceBadge source={booking.source} />
      </div>

      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small mb-0">Check-in</label>
          <input type="date" className="form-control form-control-sm" value={form.checkin || ''} disabled={booking.locked}
            onChange={(e) => set('checkin', e.target.value)} />
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Check-out</label>
          <input type="date" className="form-control form-control-sm" value={form.checkout || ''} disabled={booking.locked}
            onChange={(e) => set('checkout', e.target.value)} />
        </div>
        {booking.locked && <div className="col-12"><span className="small text-muted">Date gestite da {SOURCE_BADGE[booking.source]?.label}: non modificabili qui.</span></div>}

        <div className="col-6">
          <label className="form-label small mb-0">Orario check-in</label>
          <input type="time" className="form-control form-control-sm" value={form.checkin_time || ''} onChange={(e) => set('checkin_time', e.target.value)} />
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Orario check-out</label>
          <input type="time" className="form-control form-control-sm" value={form.checkout_time || ''} onChange={(e) => set('checkout_time', e.target.value)} />
        </div>

        <div className="col-12">
          <label className="form-label small mb-0">Nome ospite</label>
          <input className="form-control form-control-sm" value={form.guest_name || ''} onChange={(e) => set('guest_name', e.target.value)} />
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Telefono</label>
          <input className="form-control form-control-sm" value={form.guest_phone || ''} onChange={(e) => set('guest_phone', e.target.value)} />
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">N. ospiti</label>
          <input type="number" min="0" className="form-control form-control-sm" value={form.guests || ''} onChange={(e) => set('guests', e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label small mb-0">Email</label>
          <input type="email" className="form-control form-control-sm" value={form.guest_email || ''} onChange={(e) => set('guest_email', e.target.value)} />
        </div>

        <div className="col-6">
          <label className="form-label small mb-0">Pagamento</label>
          <select className="form-select form-select-sm" value={form.payment || ''} onChange={(e) => set('payment', e.target.value)}>
            <option value="">—</option>
            <option value="unpaid">🔴 Non pagato</option>
            <option value="deposit">🟡 Acconto</option>
            <option value="paid">🟢 Saldato</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Pulizia</label>
          <select className="form-select form-select-sm" value={form.cleaning || ''} onChange={(e) => set('cleaning', e.target.value)}>
            <option value="">—</option>
            <option value="todo">🧹 Da fare</option>
            <option value="done">✅ Fatta</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label small mb-0">Note interne</label>
          <textarea rows={2} className="form-control form-control-sm" value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} />
        </div>
      </div>

      {err && <div className="alert alert-danger py-2 small mt-3 mb-0">{err}</div>}

      <div className="d-flex gap-2 mt-3">
        {booking.deletable && <button className="btn btn-outline-danger btn-sm" onClick={remove} disabled={busy}>Libera date</button>}
        <button className="btn btn-light btn-sm ms-auto" onClick={onClose} disabled={busy}>Annulla</button>
        <button className="btn btn-dark btn-sm" onClick={save} disabled={busy}>{busy ? 'Salvo…' : 'Salva'}</button>
      </div>
    </Modal>
  );
}

/* ------------------------- Modale blocco -------------------------- */

function BlockModal({ onClose, onCreate, preset, filterUnit }) {
  const [unit, setUnit] = useState(filterUnit !== 'all' ? filterUnit : 'sternatia');
  const [checkin, setCheckin] = useState(preset || '');
  const [checkout, setCheckout] = useState(preset ? iso(addDays(parseISO(preset), 1)) : '');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr('');
    if (!checkin || !checkout) { setErr('Inserisci le date.'); return; }
    if (checkin >= checkout) { setErr('Il check-out deve essere dopo il check-in.'); return; }
    setBusy(true);
    try { await onCreate({ unit, checkin, checkout, guest_name: name, notes }); onClose(); }
    catch (e) { setErr(e.message || 'Errore.'); setBusy(false); }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="h5 mb-3">Blocca date</h2>
      <div className="row g-2">
        <div className="col-12">
          <label className="form-label small mb-0">Unità</label>
          <select className="form-select form-select-sm" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Dal</label>
          <input type="date" className="form-control form-control-sm" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
        </div>
        <div className="col-6">
          <label className="form-label small mb-0">Al</label>
          <input type="date" className="form-control form-control-sm" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label small mb-0">Motivo / nome (facoltativo)</label>
          <input className="form-control form-control-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Manutenzione, uso personale…" />
        </div>
        <div className="col-12">
          <label className="form-label small mb-0">Note</label>
          <textarea rows={2} className="form-control form-control-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="small text-muted mt-2">Il blocco rende le date occupate e viene inviato anche ad Airbnb/Booking.</div>
      {err && <div className="alert alert-danger py-2 small mt-3 mb-0">{err}</div>}
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-light btn-sm ms-auto" onClick={onClose} disabled={busy}>Annulla</button>
        <button className="btn btn-dark btn-sm" onClick={submit} disabled={busy}>{busy ? 'Blocco…' : 'Blocca date'}</button>
      </div>
    </Modal>
  );
}

/* ----------------------------- Modal ------------------------------ */

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1050, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 1rem', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-4 shadow p-4" style={{ maxWidth: 480, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
