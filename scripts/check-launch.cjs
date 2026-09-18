// Local readiness check only; never prints environment variable values.
const fs = require('node:fs');
const major = Number(process.versions.node.split('.')[0]);
if (major < 22) { console.error('Use Node.js 24 LTS (tested) or Node.js 22.'); process.exit(1); }
if (!fs.existsSync('.env.local')) { console.error('Copy your existing working .env.local into this folder first.'); process.exit(1); }
const text = fs.readFileSync('.env.local', 'utf8');
const configured = key => process.env[key] || text.match(new RegExp('^\\s*' + key + '\\s*=\\s*(.+)$', 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '');
for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
  if (!configured(key)) { console.error('Missing ' + key + '. Use the settings from your existing working version.'); process.exit(1); }
}
console.log('Local configuration found. Ready to install and build.');
