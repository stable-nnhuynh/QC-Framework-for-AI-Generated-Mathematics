#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
const LOG_FILE = path.join(process.cwd(), '.vercel-tmp', 'login.log');
function log(msg) { console.error(msg); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const c = fs.readFileSync(LOG_FILE, 'utf8');
        const m = c.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+(?=\s|$)/);
        if (m) return m[0];
      }
    } catch {}
  }
  return null;
}
async function main() {
  log('========================================'); log('Vercel CLI Login'); log('========================================'); log('');
  // Check if already logged in
  const who = spawnSync('npx', ['vercel', 'whoami'], { encoding:'utf8', stdio:['pipe','pipe','ignore'] });
  const out = (who.stdout||'').trim();
  if (who.status === 0 && out && !out.includes('Error') && !out.includes('not logged')) {
    log(`Already logged in as: ${out}`); process.exit(0);
  }
  log('Starting login...'); log('');
  // Start login in background
  if (!fs.existsSync(path.dirname(LOG_FILE))) fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('npx', ['vercel', 'login'], { detached:true, stdio:['ignore',logStream,logStream], shell:isWindows });
  child.unref();
  log(`Login process started (PID: ${child.pid})`);
  log('Waiting for authorization URL...');
  const url = await waitForAuthUrl();
  if (url) {
    log(''); log('========================================'); log('Authorization URL:'); log(url); log('========================================'); log('');
    log('Please complete in your browser, then let me know.');
  } else {
    log('Failed to get auth URL. Check: ' + LOG_FILE);
    process.exit(1);
  }
}
main();
