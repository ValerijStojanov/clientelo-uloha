// POST /api/e — first-party analytika bez cookies.
// Prijíma dávku udalostí z prehliadača (sendBeacon) a ukladá ich.
import { store, readBody } from './_store.js';

const ALLOWED = new Set([
  'page_view', 'engaged_10s', 'scroll_depth', 'section_view',
  'calc_interact', 'calc_change', 'hero_cta', 'sticky_cta', 'sort_change',
  'etf_open', 'locked_click', 'form_view', 'form_start', 'form_error',
  'lead', 'newsletter_optin', 'post_survey', 'phone_offer_view',
  'phone_submit', 'tahak_open', 'faq_open', 'consent', 'page_exit',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  let body = readBody(req);
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }
  const events = Array.isArray(body?.events) ? body.events.slice(0, 50) : [];
  const ts = new Date().toISOString();
  for (const ev of events) {
    if (!ALLOWED.has(ev?.name) || typeof ev.sid !== 'string') continue;
    await store('event', {
      ts,
      sid: ev.sid.slice(0, 40),
      name: ev.name,
      t: Number(ev.t) || 0,
      variant: String(ev.variant || '').slice(0, 10),
      props: ev.props && typeof ev.props === 'object' ? ev.props : {},
    });
  }
  res.status(204).end();
}
