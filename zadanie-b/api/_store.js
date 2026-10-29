// Uloženie udalostí a leadov.
// Lokálne: JSONL súbory v server-data/. Na Verceli je disk read-only, preto
// sa dáta posielajú na webhook (LEAD_WEBHOOK_URL / EVENTS_WEBHOOK_URL), napr.
// do Make/Zapier → Google Sheet alebo priamo do e-mailingu (Ecomail, Brevo).
import { appendFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'server-data');

export async function store(kind, record) {
  const webhook = process.env[kind === 'lead' ? 'LEAD_WEBHOOK_URL' : 'EVENTS_WEBHOOK_URL'];
  if (webhook) {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(record),
    });
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(join(DATA_DIR, `${kind}s.jsonl`), JSON.stringify(record) + '\n');
}

export function readBody(req) {
  if (req.body !== undefined) return req.body;
  return {};
}
