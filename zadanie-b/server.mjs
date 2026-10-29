// Lokálny server: statické súbory zo site/ + rovnaké /api/* handlery ako na Verceli.
// Spustenie: node server.mjs  →  http://localhost:4321
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = join(ROOT, 'site');
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};

const handlers = {
  '/api/e': (await import('./api/e.js')).default,
  '/api/lead': (await import('./api/lead.js')).default,
};

// Minimálna náhrada Vercel response API (status().json()/end()).
function wrap(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); };
  return res;
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const api = handlers[url.pathname];
  if (api) {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
    return api(req, wrap(res));
  }
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^([\\/])+/, '');
  if (path === '' || path.endsWith('\\') || path.endsWith('/')) path += 'index.html';
  const file = join(SITE, path);
  if (!file.startsWith(SITE)) { res.statusCode = 403; return res.end(); }
  try {
    const body = await readFile(file);
    res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
