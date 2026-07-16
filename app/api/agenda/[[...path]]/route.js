// Proxy same-origin verso l'API WordPress dell'agenda.
// Il browser chiama /api/agenda (stesso dominio Vercel); qui la
// richiesta viene inoltrata lato server a WordPress, evitando la
// chiamata cross-origin che SiteGround blocca con 503.

const CRM = process.env.NEXT_PUBLIC_CRM_API_URL;

export const dynamic = 'force-dynamic';

async function proxy(req, ctx) {
  if (!CRM) {
    return Response.json({ message: 'CRM API URL non configurata.' }, { status: 500 });
  }
  const params = await ctx.params;
  const sub = (params?.path || []).join('/');
  const search = req.nextUrl.search || '';
  const target = `${CRM}/agenda${sub ? '/' + sub : ''}${search}`;

  const init = { method: req.method, headers: {}, cache: 'no-store' };
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    init.headers['Content-Type'] = 'application/json';
    init.body = await req.text();
  }

  try {
    const res = await fetch(target, init);
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return Response.json({ message: 'Errore nel contattare il server.' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
