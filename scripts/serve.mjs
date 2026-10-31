import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../out');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.webmanifest': 'application/manifest+json',
};

function withinRoot(path) {
  const pathFromRoot = relative(root, path);
  return pathFromRoot !== '..' && !pathFromRoot.startsWith(`..${sep}`) && !isAbsolute(pathFromRoot);
}

async function findFile(path) {
  if (!withinRoot(path)) return null;
  try {
    const info = await stat(path);
    if (info.isDirectory()) return findFile(resolve(path, 'index.html'));
    if (!info.isFile()) return null;
    // Symlinks must also stay inside the export directory.
    if (!withinRoot(await realpath(path))) return null;
    return { path, size: info.size };
  } catch {
    return null;
  }
}

async function sendFile(request, response, file, status, pathname) {
  const immutable = pathname.startsWith('/_next/static/');
  response.writeHead(status, {
    'Content-Type': mime[extname(file.path).toLowerCase()] || 'application/octet-stream',
    'Content-Length': file.size,
    'Cache-Control':
      status !== 200 || extname(file.path) === '.html'
        ? 'no-cache'
        : immutable
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  const stream = createReadStream(file.path);
  stream.on('error', () => response.destroy());
  stream.pipe(response);
}

try {
  await stat(resolve(root, 'index.html'));
} catch {
  console.error('No static export found. Run npm run build before npm start.');
  process.exit(1);
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method not allowed');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Invalid request path');
    return;
  }
  const candidate = resolve(root, `.${pathname}`);
  if (!withinRoot(candidate)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Path outside static export');
    return;
  }
  const file =
    (await findFile(candidate)) ||
    (!extname(candidate) ? await findFile(`${candidate}.html`) : null);
  if (file) {
    await sendFile(request, response, file, 200, pathname);
    return;
  }
  const notFound =
    (await findFile(resolve(root, '404.html'))) ||
    (await findFile(resolve(root, '404/index.html')));
  if (notFound) {
    await sendFile(request, response, notFound, 404, pathname);
    return;
  }
  response.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  });
  response.end('Signal lost — 404');
});

server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`System 369 static export: http://${host}:${port}`));
