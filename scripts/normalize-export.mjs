import { readdir, copyFile, access } from 'node:fs/promises';
import { resolve, relative, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

// Next's client requests dot-joined segment names; Windows exports may nest them.
const root = fileURLToPath(new URL('../out/', import.meta.url));
function inExport(path) {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}
let copied = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (!inExport(path)) throw new Error('Asset path escaped the export.');
    if (entry.isDirectory()) {
      if (entry.name !== '_next') await visit(path);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.txt')) continue;
    const parts = relative(root, path).split(sep);
    const index = parts.findIndex((part) => part.startsWith('__next.'));
    if (index < 0 || index === parts.length - 1) continue;
    const destination = resolve(root, ...parts.slice(0, index), parts.slice(index).join('.'));
    if (!inExport(destination)) throw new Error('Segment alias escaped the export.');
    try {
      await access(destination);
    } catch {
      await copyFile(path, destination);
      copied++;
    }
  }
}
await visit(root);
console.log(`Prepared ${copied} static segment aliases.`);
