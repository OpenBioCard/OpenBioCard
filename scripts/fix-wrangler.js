import fs from 'fs';
import path from 'path';

const wranglerPath = path.join(process.cwd(), 'dist/openbiocard/openbiocard/wrangler.json');
const clientSrc = path.join(process.cwd(), 'dist/client');
const clientDest = path.join(process.cwd(), 'dist/openbiocard/client');

if (fs.existsSync(wranglerPath)) {
  let content = fs.readFileSync(wranglerPath, 'utf8');
  // Copy client assets back to dist/client for deployment
  const clientSrc = path.join(process.cwd(), 'dist/openbiocard/client');
  const clientDest = path.join(process.cwd(), 'dist/client');
  if (fs.existsSync(clientSrc)) {
    fs.cpSync(clientSrc, clientDest, { recursive: true });
    console.log('Copied assets from', clientSrc, 'to', clientDest);
  } else {
    console.log('Client source not found:', clientSrc);
  }
  // Update assets directory to ../client
  content = content.replace(/"assets":{"directory":"[^"]*"}/, '"assets":{"directory":"../client"}');
  fs.writeFileSync(wranglerPath, content);
  console.log('Fixed wrangler.json: processed assets');
}