const fs = require('fs');
const path = require('path');
const root = process.cwd();
const out = path.join(root, 'www');
const files = ['index.html','styles.css','app.js','auth.js','supabase-config.js','enhancements.js','balance-utils.js','register-layout.css','reference-layout.css','register-layout.js','manifest.webmanifest','sw.js'];
const dirs = ['assets','supabase'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of files) {
  if (!fs.existsSync(path.join(root,file))) throw new Error('Missing required app file: '+file);
  fs.copyFileSync(path.join(root,file), path.join(out,file));
}
for (const dir of dirs) if (fs.existsSync(path.join(root,dir))) fs.cpSync(path.join(root,dir), path.join(out,dir), { recursive: true });
console.log('Prepared Capacitor web assets in www');
