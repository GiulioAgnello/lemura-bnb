'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Coordinate Sternatia (per il meteo Open-Meteo)
const LAT = 40.2208;
const LON = 18.2270;

const LANGS = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

// Etichette d'interfaccia (le UI, non i contenuti che arrivano tradotti dal backend)
const T = {
  it: { choose: 'Scegli la lingua', stay: 'Il tuo soggiorno', checkin: 'Check-in', checkout: 'Check-out', access: 'Come arrivare', wifi: 'WiFi', network: 'Rete', password: 'Password', copy: 'Copia', copied: 'Copiato!', weather: 'Meteo & spiaggia', windNow: 'Vento ora', advised: 'Spiaggia consigliata', rules: 'Regole della casa', discover: 'Scopri il Salento', beaches: 'Spiagge', towns: 'Borghi e città', nature: 'Natura', restaurants: 'Dove mangiare', experiences: 'Esperienze', expCta: 'Scopri le esperienze', openMap: 'Apri mappa', changeLang: 'Lingua', min: 'min', loading: 'Caricamento…' },
  en: { choose: 'Choose your language', stay: 'Your stay', checkin: 'Check-in', checkout: 'Check-out', access: 'Getting here', wifi: 'WiFi', network: 'Network', password: 'Password', copy: 'Copy', copied: 'Copied!', weather: 'Weather & beach', windNow: 'Wind now', advised: 'Recommended beach', rules: 'House rules', discover: 'Discover Salento', beaches: 'Beaches', towns: 'Towns & villages', nature: 'Nature', restaurants: 'Where to eat', experiences: 'Experiences', expCta: 'Discover the experiences', openMap: 'Open map', changeLang: 'Language', min: 'min', loading: 'Loading…' },
  fr: { choose: 'Choisissez la langue', stay: 'Votre séjour', checkin: 'Arrivée', checkout: 'Départ', access: 'Comment venir', wifi: 'WiFi', network: 'Réseau', password: 'Mot de passe', copy: 'Copier', copied: 'Copié !', weather: 'Météo & plage', windNow: 'Vent', advised: 'Plage conseillée', rules: 'Règles de la maison', discover: 'Découvrir le Salento', beaches: 'Plages', towns: 'Villes et villages', nature: 'Nature', restaurants: 'Où manger', experiences: 'Expériences', expCta: 'Découvrir les expériences', openMap: 'Ouvrir la carte', changeLang: 'Langue', min: 'min', loading: 'Chargement…' },
  de: { choose: 'Sprache wählen', stay: 'Ihr Aufenthalt', checkin: 'Check-in', checkout: 'Check-out', access: 'Anreise', wifi: 'WLAN', network: 'Netzwerk', password: 'Passwort', copy: 'Kopieren', copied: 'Kopiert!', weather: 'Wetter & Strand', windNow: 'Wind jetzt', advised: 'Empfohlener Strand', rules: 'Hausregeln', discover: 'Salento entdecken', beaches: 'Strände', towns: 'Städte & Dörfer', nature: 'Natur', restaurants: 'Wo essen', experiences: 'Erlebnisse', expCta: 'Erlebnisse entdecken', openMap: 'Karte öffnen', changeLang: 'Sprache', min: 'Min', loading: 'Laden…' },
  es: { choose: 'Elige el idioma', stay: 'Tu estancia', checkin: 'Entrada', checkout: 'Salida', access: 'Cómo llegar', wifi: 'WiFi', network: 'Red', password: 'Contraseña', copy: 'Copiar', copied: '¡Copiado!', weather: 'Clima y playa', windNow: 'Viento', advised: 'Playa recomendada', rules: 'Normas de la casa', discover: 'Descubre el Salento', beaches: 'Playas', towns: 'Pueblos y ciudades', nature: 'Naturaleza', restaurants: 'Dónde comer', experiences: 'Experiencias', expCta: 'Descubre las experiencias', openMap: 'Abrir mapa', changeLang: 'Idioma', min: 'min', loading: 'Cargando…' },
};

const NOTE_CAT = {
  dimora:     { it: 'Dimora antica — accortezze', en: 'Historic home — good to know', fr: 'Demeure ancienne — à savoir', de: 'Historisches Haus — gut zu wissen', es: 'Casa antigua — a tener en cuenta', icon: '🗝️' },
  casa:       { it: 'Come funziona la casa', en: 'How the house works', fr: 'Fonctionnement de la maison', de: 'So funktioniert das Haus', es: 'Cómo funciona la casa', icon: '🏠' },
  colazione:  { it: 'Colazione', en: 'Breakfast', fr: 'Petit-déjeuner', de: 'Frühstück', es: 'Desayuno', icon: '☕' },
  spazzatura: { it: 'Raccolta differenziata', en: 'Waste sorting', fr: 'Tri des déchets', de: 'Mülltrennung', es: 'Reciclaje', icon: '♻️' },
  servizio:   { it: 'Servizi utili vicino', en: 'Useful services nearby', fr: 'Services utiles à proximité', de: 'Nützliche Dienste in der Nähe', es: 'Servicios útiles cerca', icon: '🛒' },
  emergenza:  { it: 'Numeri utili', en: 'Useful numbers', fr: 'Numéros utiles', de: 'Nützliche Nummern', es: 'Números útiles', icon: '📞' },
};
const NOTE_ORDER = ['dimora', 'casa', 'colazione', 'spazzatura', 'servizio', 'emergenza'];

const ZONE = {
  sternatia: { it: 'A Sternatia', en: 'In Sternatia', fr: 'À Sternatia', de: 'In Sternatia', es: 'En Sternatia' },
  lecce:     { it: 'A Lecce', en: 'In Lecce', fr: 'À Lecce', de: 'In Lecce', es: 'En Lecce' },
  salento:   { it: 'Nel Salento', en: 'Around Salento', fr: 'Dans le Salento', de: 'Im Salento', es: 'Por el Salento' },
};

const degToCard = (d) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(d / 45) % 8];
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function WelcomeClient() {
  const [lang, setLang] = useState(null);
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lingua salvata
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lemura_welcome_lang') : null;
    if (saved && LANGS.some((l) => l.code === saved)) setLang(saved);
  }, []);

  const load = useCallback(async (lg) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/welcome?lang=${lg}`, { cache: 'no-store' });
      setData(await res.json());
    } catch (e) { setData({ error: true }); } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (lang) load(lang); }, [lang, load]);

  // Meteo (una volta)
  useEffect(() => {
    if (!lang) return;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=Europe/Rome`)
      .then((r) => r.json())
      .then((w) => setWeather(w.current || null))
      .catch(() => setWeather(null));
  }, [lang]);

  const pick = (lg) => { window.localStorage.setItem('lemura_welcome_lang', lg); setLang(lg); };
  const t = T[lang] || T.it;

  const copyWifi = (pw) => {
    navigator.clipboard?.writeText(pw).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  // Consiglio spiaggia da vento
  const windAdvice = useMemo(() => {
    if (!weather || !data?.wind_beach_rules) return null;
    const card = degToCard(weather.wind_direction_10m);
    const rule = data.wind_beach_rules.find((r) => r.wind.includes(card));
    if (!rule) return null;
    const beaches = (data.luoghi || []).filter((l) => l.categoria === 'beach' && l.coast === rule.coast);
    return { card, rule, beaches };
  }, [weather, data]);

  /* ---------------- Gate lingua ---------------- */
  if (!lang) {
    return (
      <div className="wl-gate">
        <style>{gateCss}</style>
        <div className="wl-gate-box">
          <div className="wl-gate-title">Le Mura degli Angeli</div>
          <p className="wl-gate-sub">Choose your language · Scegli la lingua</p>
          <div className="wl-lang-grid">
            {LANGS.map((l) => (
              <button key={l.code} className="wl-lang-btn" onClick={() => pick(l.code)}>
                <span className="wl-flag">{l.flag}</span>{l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const info = data?.info || {};
  const note = data?.note || [];
  const luoghi = data?.luoghi || [];
  const notesByCat = (c) => note.filter((n) => n.categoria === c);
  const poiByCat = (c) => luoghi.filter((l) => l.tipo === 'poi' && l.categoria === c);
  const restByZone = (z) => luoghi.filter((l) => l.tipo === 'ristorante' && l.zona === z);

  return (
    <div className="wl">
      <style>{wlCss}</style>

      {/* Barra lingua */}
      <div className="wl-topbar">
        <span className="wl-brand">Le Mura degli Angeli</span>
        <select className="wl-langsel" value={lang} onChange={(e) => pick(e.target.value)} aria-label={t.changeLang}>
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
        </select>
      </div>

      {loading && <p className="text-center text-muted py-5">{t.loading}</p>}

      {/* Benvenuto */}
      {info.welcome && (
        <section className="wl-hero">
          <h1>{t.stay}</h1>
          <p>{info.welcome}</p>
        </section>
      )}

      <div className="wl-body">
        {/* Info soggiorno */}
        <div className="wl-cards">
          {info.checkin && <InfoCard icon="🕒" title={t.checkin} text={info.checkin} />}
          {info.checkout && <InfoCard icon="🧳" title={t.checkout} text={info.checkout} />}
          {info.access && <InfoCard icon="🚗" title={t.access} text={info.access} />}
        </div>

        {/* WiFi */}
        {info.wifi?.network && (
          <div className="wl-wifi">
            <div className="wl-wifi-icn">📶</div>
            <div className="flex-grow-1">
              <div className="wl-wifi-lab">{t.wifi}</div>
              <div className="wl-wifi-net">{t.network}: <b>{info.wifi.network}</b></div>
              <div className="wl-wifi-net">{t.password}: <b>{info.wifi.password}</b></div>
            </div>
            {info.wifi.password && (
              <button className="wl-copy" onClick={() => copyWifi(info.wifi.password)}>{copied ? t.copied : t.copy}</button>
            )}
          </div>
        )}

        {/* Meteo & spiaggia */}
        {windAdvice && (
          <div className="wl-weather">
            <div className="wl-weather-head">
              <span className="wl-weather-icn">🌬️</span>
              <div>
                <div className="wl-sec-title mb-0">{t.weather}</div>
                {weather && <div className="wl-weather-now">{Math.round(weather.temperature_2m)}°C · {t.windNow}: {windAdvice.rule.wind_label} · {Math.round(weather.wind_speed_10m)} km/h</div>}
              </div>
            </div>
            <div className="wl-weather-advice">
              <div className="wl-advised">{t.advised}</div>
              <div className="wl-coast">{windAdvice.rule.coast_label}</div>
              {windAdvice.beaches.length > 0 && (
                <div className="wl-beachchips">
                  {windAdvice.beaches.map((b) => (
                    <a key={b.nome} className="wl-beachchip" href={mapsUrl(b.maps_query || b.nome)} target="_blank" rel="noopener noreferrer">{b.nome}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Note per categoria */}
        {NOTE_ORDER.map((cat) => {
          const items = notesByCat(cat);
          if (items.length === 0) return null;
          const meta = NOTE_CAT[cat];
          return (
            <section key={cat} className="wl-section">
              <h2 className="wl-sec-title">{meta.icon} {meta[lang] || meta.it}</h2>
              <div className="wl-notes">
                {items.map((n, i) => (
                  <div key={i} className="wl-note">
                    <div className="wl-note-title">{n.icona ? n.icona + ' ' : ''}{n.titolo}</div>
                    {n.testo && <div className="wl-note-text">{n.testo}</div>}
                    {n.valore && (cat === 'emergenza'
                      ? <a className="wl-note-link" href={`tel:${n.valore.replace(/\s/g, '')}`}>{n.valore}</a>
                      : <a className="wl-note-link" href={mapsUrl(n.valore)} target="_blank" rel="noopener noreferrer">{t.openMap}</a>)}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Regole */}
        {info.rules && (
          <section className="wl-section">
            <h2 className="wl-sec-title">📋 {t.rules}</h2>
            <div className="wl-note"><div className="wl-note-text" style={{ whiteSpace: 'pre-line' }}>{info.rules}</div></div>
          </section>
        )}

        {/* Scopri il Salento */}
        {luoghi.some((l) => l.tipo === 'poi') && (
          <section className="wl-section">
            <h2 className="wl-sec-title wl-discover">🌊 {t.discover}</h2>
            {[['beach', t.beaches], ['town', t.towns], ['nature', t.nature]].map(([cat, label]) => {
              const items = poiByCat(cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="mb-3">
                  <h3 className="wl-subcat">{label}</h3>
                  <div className="wl-poi-grid">
                    {items.map((p) => <PoiCard key={p.nome} p={p} t={t} />)}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Ristoranti */}
        {luoghi.some((l) => l.tipo === 'ristorante') && (
          <section className="wl-section">
            <h2 className="wl-sec-title">🍽️ {t.restaurants}</h2>
            {['sternatia', 'lecce', 'salento'].map((z) => {
              const items = restByZone(z);
              if (items.length === 0) return null;
              return (
                <div key={z} className="mb-3">
                  <h3 className="wl-subcat">{ZONE[z][lang] || ZONE[z].it}</h3>
                  <div className="wl-notes">
                    {items.map((r) => (
                      <a key={r.nome} className="wl-note wl-rest" href={mapsUrl(r.maps_query || r.nome)} target="_blank" rel="noopener noreferrer">
                        <div className="wl-note-title">{r.nome} {r.cucina ? <span className="wl-rtag">{r.cucina}</span> : null}</div>
                        {r.descrizione && <div className="wl-note-text">{r.descrizione}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Esperienze */}
        <section className="wl-section">
          <h2 className="wl-sec-title">✨ {t.experiences}</h2>
          <a className="wl-exp" href="/esperienze">{t.expCta} →</a>
        </section>

        {/* Contatto host */}
        {info.host?.phone && (
          <div className="wl-host">
            {info.host.whatsapp
              ? <a className="wl-host-btn" href={`https://wa.me/${info.host.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">💬 {info.host.name || 'Host'} · WhatsApp</a>
              : <a className="wl-host-btn" href={`tel:${info.host.phone.replace(/\s/g, '')}`}>📞 {info.host.name || 'Host'}</a>}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="wl-card">
      <div className="wl-card-icn">{icon}</div>
      <div className="wl-card-title">{title}</div>
      <div className="wl-card-text" style={{ whiteSpace: 'pre-line' }}>{text}</div>
    </div>
  );
}

function PoiCard({ p, t }) {
  return (
    <a className="wl-poi" href={mapsUrl(p.maps_query || p.nome)} target="_blank" rel="noopener noreferrer">
      {p.immagine ? <div className="wl-poi-img" style={{ backgroundImage: `url(${p.immagine})` }} /> : <div className="wl-poi-img wl-poi-noimg">🏞️</div>}
      <div className="wl-poi-body">
        <div className="wl-poi-name">{p.nome}</div>
        {p.distanza_min ? <div className="wl-poi-dist">🚗 {p.distanza_min} {t.min}</div> : null}
        {p.descrizione && <div className="wl-poi-desc">{p.descrizione}</div>}
        <div className="wl-poi-map">📍 {t.openMap}</div>
      </div>
    </a>
  );
}

/* ------------------------------ CSS ------------------------------ */

const gateCss = `
  .wl-gate{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:linear-gradient(135deg,#0d9488,#111827);}
  .wl-gate-box{background:#fff;border-radius:22px;padding:2rem 1.5rem;max-width:420px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.25);}
  .wl-gate-title{font-family:var(--font-display,serif);font-size:1.7rem;font-weight:700;color:#111827;}
  .wl-gate-sub{color:#6b7280;margin:.4rem 0 1.4rem;}
  .wl-lang-grid{display:grid;gap:.6rem;}
  .wl-lang-btn{display:flex;align-items:center;gap:.7rem;width:100%;padding:.9rem 1.1rem;border:1px solid #e5e7eb;border-radius:14px;background:#fff;font-size:1.1rem;font-weight:600;color:#111827;cursor:pointer;transition:.15s;}
  .wl-lang-btn:hover{background:#f0fdfa;border-color:#0d9488;}
  .wl-flag{font-size:1.5rem;}
`;

const wlCss = `
  .wl{max-width:760px;margin:0 auto;color:#1f2937;}
  .wl-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.7rem 1rem;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid #eee;}
  .wl-brand{font-family:var(--font-display,serif);font-weight:700;font-size:1.05rem;}
  .wl-langsel{border:1px solid #e5e7eb;border-radius:10px;padding:.35rem .5rem;font-size:.95rem;}
  .wl-hero{background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:2rem 1.2rem;text-align:center;}
  .wl-hero h1{font-family:var(--font-display,serif);font-size:1.6rem;margin:0 0 .5rem;}
  .wl-hero p{font-size:1.05rem;line-height:1.6;margin:0;opacity:.95;}
  .wl-body{padding:1.2rem 1rem 3rem;}
  .wl-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.7rem;margin-bottom:1rem;}
  .wl-card{background:#fff;border:1px solid #eef0f2;border-radius:16px;padding:1rem;}
  .wl-card-icn{font-size:1.5rem;}
  .wl-card-title{font-weight:700;margin:.3rem 0;font-size:1.05rem;}
  .wl-card-text{font-size:.98rem;line-height:1.5;color:#374151;}
  .wl-wifi{display:flex;align-items:center;gap:.9rem;background:#111827;color:#fff;border-radius:16px;padding:1rem 1.1rem;margin-bottom:1rem;}
  .wl-wifi-icn{font-size:1.8rem;}
  .wl-wifi-lab{text-transform:uppercase;letter-spacing:.06em;font-size:.8rem;opacity:.7;}
  .wl-wifi-net{font-size:1.05rem;}
  .wl-copy{background:#0d9488;color:#fff;border:none;border-radius:10px;padding:.6rem .9rem;font-weight:600;white-space:nowrap;cursor:pointer;}
  .wl-weather{background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#fff;border-radius:16px;padding:1.1rem;margin-bottom:1.2rem;}
  .wl-weather-head{display:flex;align-items:center;gap:.7rem;margin-bottom:.7rem;}
  .wl-weather-icn{font-size:1.8rem;}
  .wl-weather-now{font-size:.92rem;opacity:.95;}
  .wl-weather-advice{background:rgba(255,255,255,.15);border-radius:12px;padding:.8rem;}
  .wl-advised{text-transform:uppercase;letter-spacing:.05em;font-size:.78rem;opacity:.85;}
  .wl-coast{font-size:1.15rem;font-weight:700;margin:.15rem 0 .5rem;}
  .wl-beachchips{display:flex;flex-wrap:wrap;gap:.4rem;}
  .wl-beachchip{background:#fff;color:#0369a1;border-radius:20px;padding:.35rem .8rem;font-weight:600;font-size:.9rem;text-decoration:none;}
  .wl-section{margin-bottom:1.6rem;}
  .wl-sec-title{font-family:var(--font-display,serif);font-size:1.3rem;font-weight:700;margin-bottom:.7rem;}
  .wl-discover{border-top:1px solid #eee;padding-top:1.2rem;}
  .wl-subcat{font-size:1rem;font-weight:700;color:#0d9488;margin:.6rem 0 .5rem;text-transform:uppercase;letter-spacing:.03em;}
  .wl-notes{display:flex;flex-direction:column;gap:.6rem;}
  .wl-note{background:#fff;border:1px solid #eef0f2;border-radius:14px;padding:.9rem 1rem;text-decoration:none;color:inherit;display:block;}
  .wl-note-title{font-weight:700;font-size:1.02rem;}
  .wl-note-text{font-size:.98rem;line-height:1.55;color:#374151;margin-top:.2rem;}
  .wl-note-link{display:inline-block;margin-top:.4rem;color:#0d9488;font-weight:600;text-decoration:none;}
  .wl-rest .wl-rtag{background:#f0fdfa;color:#0d9488;border-radius:10px;padding:.1rem .5rem;font-size:.78rem;font-weight:600;margin-left:.4rem;}
  .wl-poi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem;}
  .wl-poi{background:#fff;border:1px solid #eef0f2;border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;}
  .wl-poi-img{height:120px;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;font-size:2rem;}
  .wl-poi-noimg{background:#f0fdfa;}
  .wl-poi-body{padding:.8rem;}
  .wl-poi-name{font-weight:700;font-size:1.05rem;}
  .wl-poi-dist{font-size:.85rem;color:#6b7280;margin:.15rem 0;}
  .wl-poi-desc{font-size:.92rem;line-height:1.5;color:#374151;margin:.3rem 0;}
  .wl-poi-map{font-size:.88rem;color:#0d9488;font-weight:600;}
  .wl-exp{display:inline-block;background:#111827;color:#fff;border-radius:12px;padding:.8rem 1.2rem;font-weight:600;text-decoration:none;}
  .wl-host{position:sticky;bottom:1rem;text-align:center;margin-top:1rem;}
  .wl-host-btn{display:inline-block;background:#25d366;color:#fff;border-radius:30px;padding:.8rem 1.5rem;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.2);}
  @media (max-width:576px){
    .wl-hero h1{font-size:1.4rem;}
    .wl-sec-title{font-size:1.2rem;}
    .wl-poi-grid{grid-template-columns:1fr;}
  }
`;
