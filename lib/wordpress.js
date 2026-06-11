/**
 * WordPress REST API Client — Le Mura degli Angeli
 */

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
const CRM_URL = process.env.NEXT_PUBLIC_CRM_API_URL;

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`WP API [${res.status}]: ${endpoint}`);
      return null;
    }
    const data = await res.json();
    return {
      data,
      totalPages: parseInt(res.headers.get('X-WP-TotalPages')) || 0,
    };
  } catch (err) {
    console.error('WP API Error:', err);
    return null;
  }
}

// ── Pagine ──

export async function getPageBySlug(slug) {
  const result = await fetchAPI(`/pages?slug=${slug}&_embed&acf_format=standard`);
  if (!result?.data?.[0]) return null;
  const p = result.data[0];
  return {
    id: p.id,
    title: p.title.rendered,
    content: p.content.rendered,
    acf: p.acf || {},
    featuredImage: extractImage(p),
  };
}

// ── Camere (Custom Post Type) ──

export async function getCamere() {
  const result = await fetchAPI(`/alloggio?_embed&acf_format=standard&per_page=20`);
  if (!result) return [];
  return result.data.map((c) => ({
    id: c.id,
    title: c.title.rendered,
    slug: c.slug,
    content: c.content.rendered,
    excerpt: c.excerpt?.rendered || '',
    featuredImage: extractImage(c),
    prezzo: c.acf?.prezzo_notte || '',
    ospiti: c.acf?.ospiti_massimi || '',
    superficie: c.acf?.superficie || '',
    servizi: c.acf?.servizi || '',
    gallery: c.acf?.gallery || [],
  }));
}

export async function getCameraBySlug(slug) {
  const result = await fetchAPI(`/alloggio?slug=${slug}&_embed&acf_format=standard`);
  if (!result?.data?.[0]) return null;
  const c = result.data[0];
  return {
    id: c.id,
    title: c.title.rendered,
    slug: c.slug,
    content: c.content.rendered,
    featuredImage: extractImage(c),
    prezzo: c.acf?.prezzo_notte || '',
    ospiti: c.acf?.ospiti_massimi || '',
    superficie: c.acf?.superficie || '',
    servizi: c.acf?.servizi || '',
    checkin_time: c.acf?.checkin_time || '',
    checkout_time: c.acf?.checkout_time || '',
    gallery: c.acf?.gallery || [],
    bookingUrl: c.acf?.booking_url || '',
  };
}

// ── Galleria ──

export async function getGalleryImages() {
  const page = await getPageBySlug('galleria');
  return page?.acf?.gallery_images || [];
}

// ── Esperienze (Custom Post Type) ──

export async function getEsperienze() {
  const result = await fetchAPI(`/esperienza?_embed&acf_format=standard&per_page=20`);
  if (!result) return [];
  return result.data.map((e) => ({
    id: e.id,
    title: e.title.rendered,
    slug: e.slug,
    content: e.content.rendered,
    excerpt: e.excerpt?.rendered || '',
    featuredImage: extractImage(e),
    distanza: e.acf?.distanza || '',
    tipologia: e.acf?.tipologia || '',
  }));
}

// ── Recensioni (Custom Post Type) ──

export async function getRecensioni() {
  const result = await fetchAPI(`/recensione?acf_format=standard&per_page=100`);
  if (!result) return [];
  return result.data.map((r) => ({
    id: r.id,
    nome: r.acf?.nome_ospite || r.title.rendered,
    provenienza: r.acf?.provenienza || '',
    stelle: r.acf?.stelle || 5,
    testo: r.acf?.testo_recensione || '',
    data_soggiorno: r.acf?.data_soggiorno || '',
    piattaforma: r.acf?.piattaforma || '',
  }));
}

// ── Strutture: Sternatia e Corigliano ──

export async function getSternatia() {
  try {
    const res = await fetch(`${CRM_URL}/sternatia`, { next: { revalidate: 3600 } });
    if (!res.ok) { console.error(`CRM API [${res.status}]: /sternatia`); return null; }
    const raw = await res.json();
    return {
      ...raw,
      featured_image: extractImageUrl(raw.featured_image),
      gallery: normalizeGallery(raw.gallery),
    };
  } catch (err) {
    console.error('CRM API Error (sternatia):', err);
    return null;
  }
}

export async function getCorigliano() {
  try {
    const res = await fetch(`${CRM_URL}/corigliano`, { next: { revalidate: 3600 } });
    if (!res.ok) { console.error(`CRM API [${res.status}]: /corigliano`); return null; }
    const raw = await res.json();
    return {
      ...raw,
      rooms: (raw.rooms || []).map((r) => ({
        ...r,
        featured_image: extractImageUrl(r.featured_image),
        gallery: normalizeGallery(r.gallery),
      })),
      spa: raw.spa ? { ...raw.spa, featured_image: extractImageUrl(raw.spa.featured_image), gallery: normalizeGallery(raw.spa.gallery) } : null,
    };
  } catch (err) {
    console.error('CRM API Error (corigliano):', err);
    return null;
  }
}

export async function getStrutture() {
  try {
    const res = await fetch(`${CRM_URL}/strutture`, { next: { revalidate: 3600 } });
    if (!res.ok) { console.error(`CRM API [${res.status}]: /strutture`); return null; }
    const raw = await res.json();
    return {
      sternatia: raw.sternatia ? { ...raw.sternatia, featured_image: extractImageUrl(raw.sternatia.featured_image), gallery: normalizeGallery(raw.sternatia.gallery) } : null,
      corigliano: raw.corigliano ? { ...raw.corigliano, rooms: (raw.corigliano.rooms || []).map((r) => ({ ...r, featured_image: extractImageUrl(r.featured_image), gallery: normalizeGallery(r.gallery) })) } : null,
    };
  } catch (err) {
    console.error('CRM API Error (strutture):', err);
    return null;
  }
}

// ── CRM: Disponibilità e Prenotazioni ──

export async function checkAvailability({ check_in, check_out, guests = 1 }) {
  try {
    const params = new URLSearchParams({ check_in, check_out, guests });
    const res = await fetch(`${CRM_URL}/availability?${params}`);
    if (!res.ok) { console.error(`CRM API [${res.status}]: /availability`); return null; }
    return await res.json();
  } catch (err) {
    console.error('CRM API Error:', err);
    return null;
  }
}

export async function getAvailability(unit) {
  try {
    const res = await fetch(`${CRM_URL}/availability?unit=${encodeURIComponent(unit)}`);
    if (!res.ok) { console.error(`CRM API [${res.status}]: /availability`); return { unit, blocked: [] }; }
    return await res.json();
  } catch (err) {
    console.error('CRM API Error (availability):', err);
    return { unit, blocked: [] };
  }
}

export async function submitBooking(formData) {
  const res = await fetch(`${CRM_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Errore nell'invio della richiesta.");
  return data;
}

export async function getPricing({ unit, checkin, checkout, ospiti }) {
  try {
    const params = new URLSearchParams({ unit, checkin, checkout, ospiti });
    const res = await fetch(`${CRM_URL}/pricing?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('CRM API Error (pricing):', err);
    return null;
  }
}

export async function submitInquiry(formData) {
  const res = await fetch(`${CRM_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Errore nell'invio della richiesta");
  return data;
}

// ── Helpers ──

function extractImageUrl(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.url || null;
}

function normalizeGallery(gallery) {
  if (!Array.isArray(gallery)) return [];
  return gallery.map((item) => (typeof item === 'string' ? item : item?.url)).filter(Boolean);
}

function extractImage(item) {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return {
    url: media.source_url,
    alt: media.alt_text || item.title.rendered,
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}
