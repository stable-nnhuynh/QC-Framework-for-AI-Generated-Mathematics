#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';
function log(msg) { console.error(msg); }
function main() {
  log('========================================'); log('Vercel Deploy'); log('========================================'); log('');
  log('Running production deploy...'); log('');
  const result = spawnSync('npx', ['vercel', '--prod', '--yes'], {
    cwd: process.cwd(), encoding:'utf8', stdio: ['inherit','pipe','pipe'],
    timeout: 300000, shell: isWindows
  });
  const output = (result.stdout||'') + (result.stderr||'');
  log(output);
  // Extract URLs
  const aliased = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const prod = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const url = aliased ? aliased[1] : prod ? prod[1] : null;
  if (result.status === 0) {
    log(''); log('========================================');
    if (url) log(`Live: ${url}`);
    log('========================================');
  } else {
    log('Deploy failed'); process.exit(1);
  }
}
main();
