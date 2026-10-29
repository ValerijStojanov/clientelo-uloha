// POST /api/lead — uloženie kontaktu.
// Jediné povinné pole je e-mail; zvyšok (súhlas s tipmi, odpoveď z ankety,
// telefón) sa dopĺňa postupne po odoslaní, aby nebrzdil hlavnú konverziu.
import { store, readBody } from './_store.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ]{9,16}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  let body = readBody(req);
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'bad_json' }); }
  }
  // Honeypot: pole, ktoré človek nevidí a bot vyplní.
  if (body.company) return res.status(200).json({ ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return res.status(400).json({ error: 'email' });
  }
  const phone = body.phone ? String(body.phone).trim() : null;
  if (phone && !PHONE_RE.test(phone)) return res.status(400).json({ error: 'phone' });

  await store('lead', {
    ts: new Date().toISOString(),
    step: body.step === 'update' ? 'update' : 'signup',
    email,
    newsletter: body.newsletter === true,
    survey: body.survey ? String(body.survey).slice(0, 30) : null,
    phone,
    sid: String(body.sid || '').slice(0, 40),
    variant: String(body.variant || '').slice(0, 10),
    utm: body.utm && typeof body.utm === 'object' ? body.utm : {},
    monthly: Number(body.monthly) || null,
  });
  res.status(200).json({ ok: true });
}
