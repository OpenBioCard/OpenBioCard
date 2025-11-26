import fs from 'fs';
import path from 'path';

const wranglerPath = path.join(process.cwd(), 'dist/openbiocard/wrangler.json');

if (fs.existsSync(wranglerPath)) {
  let content = fs.readFileSync(wranglerPath, 'utf8');
  // Remove the assets field
  content = content.replace(/"assets":{"directory":"[^"]*"},/, '');
  fs.writeFileSync(wranglerPath, content);
  console.log('Fixed wrangler.json: removed assets field');
}