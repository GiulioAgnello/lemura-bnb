// Proxy same-origin verso l'endpoint WordPress /welcome.
// Come per l'agenda, evita la chiamata cross-origin che SiteGround
// blocca con 503: il browser chiama /api/welcome (dominio Vercel),
// qui la richiesta viene inoltrata lato server a WordPress.

const CRM = process.env.NEXT_PUBLIC_CRM_API_URL;

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!CRM) {
    return Response.json({ message: 'CRM API URL non configurata.' }, { status: 500 });
  }
  const lang = req.nextUrl.searchParams.get('lang') || 'it';
  try {
    const res = await fetch(`${CRM}/welcome?lang=${encodeURIComponent(lang)}`, { cache: 'no-store' });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return Response.json({ message: 'Errore nel contattare il server.' }, { status: 502 });
  }
}
