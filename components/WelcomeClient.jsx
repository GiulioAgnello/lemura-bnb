'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

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

const T = {
  it: { greet: 'Benvenuti', thanks: 'Grazie per averci scelto', casa: 'La Casa', exp: 'Esperienze & Salento', write: 'Scrivimi', checkin: 'Check-in', checkout: 'Check-out', access: 'Come arrivare', wifi: 'WiFi', network: 'Rete', password: 'Password', copy: 'Copia', copied: 'Copiato!', weather: 'Meteo & spiaggia', windNow: 'Vento ora', advised: 'Spiaggia consigliata', rules: 'Regole della casa', waste: 'Calendario differenziata', wasteHint: 'Il sacchetto va messo fuori la sera prima, davanti alla porta.', discover: 'Scopri il Salento', beaches: 'Spiagge', towns: 'Borghi e città', nature: 'Natura', restaurants: 'Dove mangiare', supermarkets: 'Supermercati', pharmacies: 'Farmacie', experiences: 'Esperienze', expCta: 'Scopri le esperienze', openMap: 'Apri mappa', changeLang: 'Lingua', min: 'min', loading: 'Caricamento…' },
  en: { greet: 'Welcome', thanks: 'Thank you for choosing us', casa: 'The House', exp: 'Experiences & Salento', write: 'Message me', checkin: 'Check-in', checkout: 'Check-out', access: 'Getting here', wifi: 'WiFi', network: 'Network', password: 'Password', copy: 'Copy', copied: 'Copied!', weather: 'Weather & beach', windNow: 'Wind now', advised: 'Recommended beach', rules: 'House rules', waste: 'Waste calendar', wasteHint: 'Put the bag out the evening before, by the door.', discover: 'Discover Salento', beaches: 'Beaches', towns: 'Towns & villages', nature: 'Nature', restaurants: 'Where to eat', supermarkets: 'Supermarkets', pharmacies: 'Pharmacies', experiences: 'Experiences', expCta: 'Discover the experiences', openMap: 'Open map', changeLang: 'Language', min: 'min', loading: 'Loading…' },
  fr: { greet: 'Bienvenue', thanks: 'Merci de nous avoir choisis', casa: 'La Maison', exp: 'Expériences & Salento', write: 'Écrivez-moi', checkin: 'Arrivée', checkout: 'Départ', access: 'Comment venir', wifi: 'WiFi', network: 'Réseau', password: 'Mot de passe', copy: 'Copier', copied: 'Copié !', weather: 'Météo & plage', windNow: 'Vent', advised: 'Plage conseillée', rules: 'Règles de la maison', waste: 'Calendrier des déchets', wasteHint: 'Sortez le sac la veille au soir, devant la porte.', discover: 'Découvrir le Salento', beaches: 'Plages', towns: 'Villes et villages', nature: 'Nature', restaurants: 'Où manger', supermarkets: 'Supermarchés', pharmacies: 'Pharmacies', experiences: 'Expériences', expCta: 'Découvrir les expériences', openMap: 'Ouvrir la carte', changeLang: 'Langue', min: 'min', loading: 'Chargement…' },
  de: { greet: 'Willkommen', thanks: 'Danke, dass Sie uns gewählt haben', casa: 'Das Haus', exp: 'Erlebnisse & Salento', write: 'Schreiben Sie mir', checkin: 'Check-in', checkout: 'Check-out', access: 'Anreise', wifi: 'WLAN', network: 'Netzwerk', password: 'Passwort', copy: 'Kopieren', copied: 'Kopiert!', weather: 'Wetter & Strand', windNow: 'Wind jetzt', advised: 'Empfohlener Strand', rules: 'Hausregeln', waste: 'Müllkalender', wasteHint: 'Den Beutel am Vorabend vor die Tür stellen.', discover: 'Salento entdecken', beaches: 'Strände', towns: 'Städte & Dörfer', nature: 'Natur', restaurants: 'Wo essen', supermarkets: 'Supermärkte', pharmacies: 'Apotheken', experiences: 'Erlebnisse', expCta: 'Erlebnisse entdecken', openMap: 'Karte öffnen', changeLang: 'Sprache', min: 'Min', loading: 'Laden…' },
  es: { greet: 'Bienvenidos', thanks: 'Gracias por elegirnos', casa: 'La Casa', exp: 'Experiencias & Salento', write: 'Escríbeme', checkin: 'Entrada', checkout: 'Salida', access: 'Cómo llegar', wifi: 'WiFi', network: 'Red', password: 'Contraseña', copy: 'Copiar', copied: '¡Copiado!', weather: 'Clima y playa', windNow: 'Viento', advised: 'Playa recomendada', rules: 'Normas de la casa', waste: 'Calendario de reciclaje', wasteHint: 'Saca la bolsa la noche anterior, frente a la puerta.', discover: 'Descubre el Salento', beaches: 'Playas', towns: 'Pueblos y ciudades', nature: 'Naturaleza', restaurants: 'Dónde comer', supermarkets: 'Supermercados', pharmacies: 'Farmacias', experiences: 'Experiencias', expCta: 'Descubre las experiencias', openMap: 'Abrir mapa', changeLang: 'Idioma', min: 'min', loading: 'Cargando…' },
};

const NOTE_CAT = {
  dimora:    { it: 'Dimora antica — accortezze', en: 'Historic home — good to know', fr: 'Demeure ancienne — à savoir', de: 'Historisches Haus — gut zu wissen', es: 'Casa antigua — a tener en cuenta', icon: '🗝️' },
  casa:      { it: 'Come funziona la casa', en: 'How the house works', fr: 'Fonctionnement de la maison', de: 'So funktioniert das Haus', es: 'Cómo funciona la casa', icon: '🏠' },
  colazione: { it: 'Colazione', en: 'Breakfast', fr: 'Petit-déjeuner', de: 'Frühstück', es: 'Desayuno', icon: '☕' },
  emergenza: { it: 'Numeri utili', en: 'Useful numbers', fr: 'Numéros utiles', de: 'Nützliche Nummern', es: 'Números útiles', icon: '📞' },
};
const NOTE_ORDER = ['dimora', 'casa', 'colazione', 'emergenza'];

const ZONE = {
  sternatia: { it: 'A Sternatia', en: 'In Sternatia', fr: 'À Sternatia', de: 'In Sternatia', es: 'En Sternatia' },
  lecce:     { it: 'A Lecce', en: 'In Lecce', fr: 'In Lecce', de: 'In Lecce', es: 'En Lecce' },
  salento:   { it: 'Nel Salento', en: 'Around Salento', fr: 'Dans le Salento', de: 'Im Salento', es: 'Por el Salento' },
};
const ZONE_ORDER = ['sternatia', 'lecce', 'salento'];

const WASTE = {
  organico:        { color: '#8b5e34', icon: '🥬', it: 'Organico', en: 'Organic', fr: 'Organique', de: 'Bioabfall', es: 'Orgánico' },
  plastica:        { color: '#eab308', icon: '♻️', it: 'Plastica e lattine', en: 'Plastic & cans', fr: 'Plastique & canettes', de: 'Plastik & Dosen', es: 'Plástico y latas' },
  carta:           { color: '#2563eb', icon: '📦', it: 'Carta e cartone', en: 'Paper & card', fr: 'Papier & carton', de: 'Papier & Karton', es: 'Papel y cartón' },
  vetro:           { color: '#16a34a', icon: '🍾', it: 'Vetro', en: 'Glass', fr: 'Verre', de: 'Glas', es: 'Vidrio' },
  indifferenziato: { color: '#6b7280', icon: '🗑️', it: 'Indifferenziato', en: 'General waste', fr: 'Déchets divers', de: 'Restmüll', es: 'Resto' },
};
const DAYS = {
  mon: { it: 'Lunedì', en: 'Monday', fr: 'Lundi', de: 'Montag', es: 'Lunes' },
  tue: { it: 'Martedì', en: 'Tuesday', fr: 'Mardi', de: 'Dienstag', es: 'Martes' },
  wed: { it: 'Mercoledì', en: 'Wednesday', fr: 'Mercredi', de: 'Mittwoch', es: 'Miércoles' },
  thu: { it: 'Giovedì', en: 'Thursday', fr: 'Jeudi', de: 'Donnerstag', es: 'Jueves' },
  fri: { it: 'Venerdì', en: 'Friday', fr: 'Vendredi', de: 'Freitag', es: 'Viernes' },
  sat: { it: 'Sabato', en: 'Saturday', fr: 'Samedi', de: 'Samstag', es: 'Sábado' },
  sun: { it: 'Domenica', en: 'Sunday', fr: 'Dimanche', de: 'Sonntag', es: 'Domingo' },
};
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const degToCard = (d) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(d / 45) % 8];
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function WelcomeClient() {
  const [lang, setLang] = useState(null);
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [splash, setSplash] = useState(false);
  const [tab, setTab] = useState('casa');
  const splashShown = useRef(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lemura_welcome_lang') : null;
    if (saved && LANGS.some((l) => l.code === saved)) setLang(saved);
  }, []);

  useEffect(() => {
    if (lang && !splashShown.current) {
      splashShown.current = true;
      setSplash(true);
      const tmr = setTimeout(() => setSplash(false), 2200);
      return () => clearTimeout(tmr);
    }
  }, [lang]);

  const load = useCallback(async (lg) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/welcome?lang=${lg}`, { cache: 'no-store' });
      setData(await res.json());
    } catch (e) { setData({ error: true }); } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (lang) load(lang); }, [lang, load]);

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

  const windAdvice = useMemo(() => {
    if (!weather || !data?.wind_beach_rules) return null;
    const card = degToCard(weather.wind_direction_10m);
    const rule = data.wind_beach_rules.find((r) => r.wind.includes(card));
    if (!rule) return null;
    const fromLuoghi = (data.luoghi || [])
      .filter((l) => l.categoria === 'beach' && l.coast === rule.coast)
      .map((b) => ({ nome: b.nome, maps: b.maps_query || b.nome }));
    const beaches = fromLuoghi.length ? fromLuoghi : (rule.beaches || []).map((b) => ({ nome: b.name, maps: b.maps }));
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
  const byTypeZone = (tp) => luoghi.filter((l) => l.tipo === tp);

  const waHref = info.host?.whatsapp
    ? `https://wa.me/${info.host.whatsapp.replace(/\D/g, '')}`
    : info.host?.phone ? `tel:${info.host.phone.replace(/\s/g, '')}` : undefined;

  /* ---------------- Sezione CASA ---------------- */
  const renderCasa = () => (
    <>
      <div className="wl-cards">
        {info.checkin && <InfoCard icon="🕒" title={t.checkin} text={info.checkin} />}
        {info.checkout && <InfoCard icon="🧳" title={t.checkout} text={info.checkout} />}
        {info.access && <InfoCard icon="🚗" title={t.access} text={info.access} />}
      </div>

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

      <WasteCalendar waste={info.waste} t={t} lang={lang} />

      {info.rules && (
        <section className="wl-section">
          <h2 className="wl-sec-title">📋 {t.rules}</h2>
          <div className="wl-note"><div className="wl-note-text" style={{ whiteSpace: 'pre-line' }}>{info.rules}</div></div>
        </section>
      )}
    </>
  );

  /* ---------------- Sezione ESPERIENZE ---------------- */
  const renderEsperienze = () => (
    <>
      {windAdvice && (
        <div className="wl-weather">
          <div className="wl-weather-head">
            <span className="wl-weather-icn">🌬️</span>
            <div>
              <div className="wl-sec-title mb-0" style={{ color: '#fff' }}>{t.weather}</div>
              {weather && <div className="wl-weather-now">{Math.round(weather.temperature_2m)}°C · {t.windNow}: {windAdvice.rule.wind_label} · {Math.round(weather.wind_speed_10m)} km/h</div>}
            </div>
          </div>
          <div className="wl-weather-advice">
            <div className="wl-advised">{t.advised}</div>
            <div className="wl-coast">{windAdvice.rule.coast_label}</div>
            {windAdvice.beaches.length > 0 && (
              <div className="wl-beachchips">
                {windAdvice.beaches.map((b) => (
                  <a key={b.nome} className="wl-beachchip" href={mapsUrl(b.maps)} target="_blank" rel="noopener noreferrer">📍 {b.nome}</a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {luoghi.some((l) => l.tipo === 'poi') && (
        <section className="wl-section">
          <h2 className="wl-sec-title wl-discover">🌊 {t.discover}</h2>
          {[['beach', t.beaches], ['town', t.towns], ['nature', t.nature]].map(([cat, label]) => {
            const items = poiByCat(cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="mb-3">
                <h3 className="wl-subcat">{label}</h3>
                <div className="wl-poi-grid">{items.map((p) => <PoiCard key={p.nome} p={p} t={t} />)}</div>
              </div>
            );
          })}
        </section>
      )}

      <ZoneList tipo="ristorante" title={`🍽️ ${t.restaurants}`} luoghi={byTypeZone('ristorante')} lang={lang} t={t} />
      <ZoneList tipo="supermercato" title={`🛒 ${t.supermarkets}`} luoghi={byTypeZone('supermercato')} lang={lang} t={t} />
      <ZoneList tipo="farmacia" title={`💊 ${t.pharmacies}`} luoghi={byTypeZone('farmacia')} lang={lang} t={t} />

      <section className="wl-section">
        <h2 className="wl-sec-title">✨ {t.experiences}</h2>
        <a className="wl-exp" href="/esperienze">{t.expCta} →</a>
      </section>
    </>
  );

  return (
    <div className="wl">
      <style>{wlCss}</style>

      <div className={`wl-splash${splash ? '' : ' wl-splash--hide'}`} aria-hidden={!splash}>
        <img className="wl-splash-logo" src="/logo_no_background.png" alt="Le Mura degli Angeli" />
        <div className="wl-splash-brand">Le Mura degli Angeli</div>
        <div className="wl-splash-text">{t.thanks}</div>
      </div>

      <div className="wl-topbar">
        <div className="wl-hdr-brand">
          <img className="wl-hdr-logo" src="/logo_no_background.png" alt="Le Mura degli Angeli" />
          <span className="wl-hdr-greet">{t.greet}</span>
        </div>
        <select className="wl-langsel" value={lang} onChange={(e) => pick(e.target.value)} aria-label={t.changeLang}>
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
        </select>
      </div>

      {info.welcome && info.welcome.trim().length > 12 && <p className="wl-welcome-msg">{info.welcome}</p>}

      {/* Tab desktop */}
      <div className="wl-tabs">
        <button className={`wl-tab${tab === 'casa' ? ' wl-tab--active' : ''}`} onClick={() => setTab('casa')}>🏠 {t.casa}</button>
        <button className={`wl-tab${tab === 'exp' ? ' wl-tab--active' : ''}`} onClick={() => setTab('exp')}>🌊 {t.exp}</button>
      </div>

      {loading && <p className="text-center text-muted py-4">{t.loading}</p>}

      <div className="wl-body">
        {tab === 'casa' ? renderCasa() : renderEsperienze()}
      </div>

      {/* Console mobile */}
      <div className="wl-console">
        <button className={`wl-console-item${tab === 'casa' ? ' wl-console-item--active' : ''}`} onClick={() => setTab('casa')}>
          <IcoHome />{t.casa}
        </button>
        <button className={`wl-console-item${tab === 'exp' ? ' wl-console-item--active' : ''}`} onClick={() => setTab('exp')}>
          <IcoCompass />{t.exp}
        </button>
        <a className="wl-console-item wl-console-wa" href={waHref || '#'} target="_blank" rel="noopener noreferrer">
          <IcoWhatsApp />{t.write}
        </a>
      </div>
    </div>
  );
}

/* Icone outline monocromatiche (ereditano il colore dal testo) */
function IcoHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
    </svg>
  );
}
function IcoCompass() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><polygon points="15.6 8.4 10.8 10.8 8.4 15.6 13.2 13.2" />
    </svg>
  );
}
function IcoWhatsApp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.005c6.582 0 11.941-5.359 11.944-11.893a11.821 11.821 0 00-3.48-8.464z" />
    </svg>
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
    <div className="wl-poi">
      {p.immagine ? <div className="wl-poi-img" style={{ backgroundImage: `url(${p.immagine})` }} /> : <div className="wl-poi-img wl-poi-noimg">📍</div>}
      <div className="wl-poi-body">
        <div className="wl-poi-name">{p.nome}</div>
        <div className="wl-poi-actions">
          {p.link && <a className="wl-poi-link" href={p.link} target="_blank" rel="noopener noreferrer">🔗 Link</a>}
          <a className="wl-poi-maps" href={mapsUrl(p.maps_query || p.nome)} target="_blank" rel="noopener noreferrer">📍 {t.openMap}</a>
        </div>
      </div>
    </div>
  );
}

// Lista luoghi (ristoranti / supermercati / farmacie) raggruppati per zona, Sternatia prima.
function ZoneList({ title, luoghi, lang, t }) {
  if (!luoghi || luoghi.length === 0) return null;
  return (
    <section className="wl-section">
      <h2 className="wl-sec-title">{title}</h2>
      {ZONE_ORDER.map((z) => {
        const items = luoghi.filter((l) => l.zona === z);
        if (items.length === 0) return null;
        return (
          <div key={z} className="mb-3">
            <h3 className="wl-subcat">{ZONE[z][lang] || ZONE[z].it}</h3>
            <div className="wl-poi-grid">
              {items.map((r) => <PoiCard key={r.nome} p={r} t={t} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// Calendario differenziata: righe giorno → tipo rifiuto, + nota.
function WasteCalendar({ waste, t, lang }) {
  if (!waste) return null;
  const sched = waste.schedule || {};
  const typesOf = (d) => {
    const v = sched[d];
    const arr = Array.isArray(v) ? v : v ? [v] : [];
    return arr.filter((k) => WASTE[k]);
  };
  const days = DAY_ORDER.filter((d) => typesOf(d).length > 0);
  if (days.length === 0 && !waste.note) return null;
  return (
    <section className="wl-section">
      <h2 className="wl-sec-title">♻️ {t.waste}</h2>
      {days.length > 0 && (
        <div className="wl-waste">
          {days.map((d) => (
            <div key={d} className="wl-waste-row">
              <span className="wl-waste-day">{DAYS[d][lang] || DAYS[d].it}</span>
              <span className="wl-waste-types">
                {typesOf(d).map((k) => {
                  const w = WASTE[k];
                  return <span key={k} className="wl-waste-type"><span className="wl-waste-dot" style={{ background: w.color }} />{w.icon} {w[lang] || w.it}</span>;
                })}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="wl-waste-note">🌙 {waste.note || t.wasteHint}</div>
    </section>
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
  .wl-splash{position:fixed;inset:0;z-index:3000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;background:linear-gradient(135deg,#0d9488,#111827);color:#fff;transition:opacity .7s ease;opacity:1;}
  .wl-splash--hide{opacity:0;pointer-events:none;}
  .wl-splash-logo{height:104px;width:104px;border-radius:50%;background:#fff;padding:14px;object-fit:contain;box-shadow:0 10px 34px rgba(0,0,0,.3);animation:wlPop .6s ease;}
  .wl-splash-brand{font-family:var(--font-display,serif);font-size:1.5rem;font-weight:700;}
  .wl-splash-text{font-size:1.1rem;opacity:.92;text-align:center;padding:0 1.5rem;}
  @keyframes wlPop{from{transform:scale(.8);opacity:0;}to{transform:scale(1);opacity:1;}}
  .wl-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem 1rem;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border-bottom:1px solid #eee;}
  .wl-hdr-brand{display:flex;align-items:center;gap:.6rem;}
  .wl-hdr-logo{height:38px;width:auto;}
  .wl-hdr-greet{font-family:var(--font-display,serif);font-weight:700;font-size:1.35rem;color:#111827;}
  .wl-langsel{border:1px solid #e5e7eb;border-radius:10px;padding:.35rem .5rem;font-size:.95rem;}
  .wl-welcome-msg{max-width:640px;margin:1.2rem auto .2rem;padding:0 1.2rem;text-align:center;font-size:1.05rem;line-height:1.6;color:#374151;}
  .wl-tabs{display:flex;gap:.8rem;max-width:640px;margin:1rem auto 0;padding:0 1rem;}
  .wl-tab{flex:1;padding:1rem;border:1px solid #e5e7eb;border-radius:16px;background:#fff;font-size:1.1rem;font-weight:700;color:#374151;cursor:pointer;transition:.15s;}
  .wl-tab--active{background:#0d9488;border-color:#0d9488;color:#fff;box-shadow:0 6px 18px rgba(13,148,136,.3);}
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
  .wl-beachchip{background:#fff;color:#0369a1;border-radius:20px;padding:.4rem .85rem;font-weight:600;font-size:.92rem;text-decoration:none;}
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
  .wl-waste{background:#fff;border:1px solid #eef0f2;border-radius:14px;overflow:hidden;margin-bottom:.6rem;}
  .wl-waste-row{display:flex;align-items:center;justify-content:space-between;padding:.7rem 1rem;border-bottom:1px solid #f3f4f6;}
  .wl-waste-row:last-child{border-bottom:none;}
  .wl-waste-day{font-weight:600;}
  .wl-waste-types{display:flex;flex-wrap:wrap;gap:.4rem .8rem;justify-content:flex-end;}
  .wl-waste-type{display:flex;align-items:center;gap:.4rem;font-weight:600;}
  .wl-waste-dot{width:12px;height:12px;border-radius:50%;display:inline-block;}
  .wl-waste-note{background:#fef9c3;border-radius:12px;padding:.7rem .9rem;font-size:.95rem;color:#713f12;}
  .wl-poi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem;}
  .wl-poi{background:#fff;border:1px solid #eef0f2;border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;}
  .wl-poi-img{height:120px;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;font-size:2rem;}
  .wl-poi-noimg{background:#f0fdfa;}
  .wl-poi-body{padding:.8rem;}
  .wl-poi-name{font-weight:700;font-size:1.05rem;}
  .wl-poi-dist{font-size:.85rem;color:#6b7280;margin:.15rem 0;}
  .wl-poi-desc{font-size:.92rem;line-height:1.5;color:#374151;margin:.3rem 0;}
  .wl-poi-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem;}
  .wl-poi-maps{background:#0d9488;color:#fff;border-radius:10px;padding:.45rem .8rem;font-size:.9rem;font-weight:600;text-decoration:none;}
  .wl-poi-link{border:1px solid #e5e7eb;border-radius:10px;padding:.45rem .8rem;font-size:.9rem;font-weight:600;color:#374151;text-decoration:none;}
  .wl-exp{display:inline-block;background:#111827;color:#fff;border-radius:12px;padding:.8rem 1.2rem;font-weight:600;text-decoration:none;}
  .wl-console{display:none;}
  @media (max-width:576px){
    .wl-tabs{display:none;}
    .wl-body{padding-bottom:5.5rem;}
    .wl-sec-title{font-size:1.2rem;}
    .wl-cards{grid-template-columns:1fr;}
    .wl-poi-grid{grid-template-columns:1fr;}
    .wl-console{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;background:#fff;border-top:1px solid #e5e7eb;box-shadow:0 -4px 16px rgba(0,0,0,.08);}
    .wl-console-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:.55rem 0 .7rem;border:none;background:none;font-size:.72rem;font-weight:600;color:#6b7280;text-decoration:none;cursor:pointer;}
    .wl-console-icn{font-size:1.35rem;line-height:1;}
    .wl-console-item--active{color:#0d9488;}
    .wl-console-wa{color:#15803d;}
  }
`;
