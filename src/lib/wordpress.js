/**
 * WordPress REST API Client — Le Mura degli Angeli
 */

const API_URL = import.meta.env.VITE_WP_API_URL;

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      console.error(`WP API [${res.status}]: ${endpoint}`);
      return null;
    }
    const data = await res.json();
    return {
      data,
      totalPages: parseInt(res.headers.get("X-WP-TotalPages")) || 0,
    };
  } catch (err) {
    console.error("WP API Error:", err);
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
  const result = await fetchAPI(`/camera?_embed&acf_format=standard&per_page=20`);
  if (!result) return [];
  return result.data.map((c) => ({
    id: c.id,
    title: c.title.rendered,
    slug: c.slug,
    content: c.content.rendered,
    excerpt: c.excerpt?.rendered || "",
    featuredImage: extractImage(c),
    prezzo: c.acf?.prezzo_notte || "",
    ospiti: c.acf?.ospiti_max || "",
    superficie: c.acf?.superficie || "",
    servizi: c.acf?.servizi || "",
    gallery: c.acf?.gallery || [],
  }));
}

export async function getCameraBySlug(slug) {
  const result = await fetchAPI(`/camera?slug=${slug}&_embed&acf_format=standard`);
  if (!result?.data?.[0]) return null;
  const c = result.data[0];
  return {
    id: c.id,
    title: c.title.rendered,
    slug: c.slug,
    content: c.content.rendered,
    featuredImage: extractImage(c),
    prezzo: c.acf?.prezzo_notte || "",
    ospiti: c.acf?.ospiti_max || "",
    superficie: c.acf?.superficie || "",
    servizi: c.acf?.servizi || "",
    gallery: c.acf?.gallery || [],
    bookingUrl: c.acf?.booking_url || "",
  };
}

// ── Galleria ──

export async function getGalleryImages() {
  const page = await getPageBySlug("galleria");
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
    excerpt: e.excerpt?.rendered || "",
    featuredImage: extractImage(e),
    distanza: e.acf?.distanza || "",
    tipologia: e.acf?.tipologia || "",
  }));
}

// ── Recensioni (Custom Post Type) ──

export async function getRecensioni() {
  const result = await fetchAPI(`/recensione?acf_format=standard&per_page=100`);
  if (!result) return [];
  return result.data.map((r) => ({
    id: r.id,
    nome: r.acf?.nome_ospite || r.title.rendered,
    provenienza: r.acf?.provenienza || "",
    stelle: r.acf?.stelle || 5,
    testo: r.acf?.testo_recensione || "",
    data_soggiorno: r.acf?.data_soggiorno || "",
    piattaforma: r.acf?.piattaforma || "",
  }));
}

// ── Helper ──

function extractImage(item) {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return {
    url: media.source_url,
    alt: media.alt_text || item.title.rendered,
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}
