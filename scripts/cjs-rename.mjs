import { readdir, rename } from 'fs/promises';
import { join, extname } from 'path';

async function renameJsToCjs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await renameJsToCjs(fullPath);
    } else if (extname(entry.name) === '.js') {
      await rename(fullPath, fullPath.replace(/\.js$/, '.cjs'));
    }
  }
}

await renameJsToCjs('./dist/cjs');
