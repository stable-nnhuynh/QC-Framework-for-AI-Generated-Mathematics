#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';
const ALLOWED_COMMANDS = new Set(['node', 'npm', 'pnpm', 'yarn', 'vercel']);
function log(msg) { console.error(msg); }
function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) throw new Error(`Command not in whitelist: ${cmd}`);
  try {
    if (isWindows) return spawnSync('where', [cmd], { stdio: 'ignore' }).status === 0;
    return spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' }).status === 0;
  } catch { return false; }
}
function getCommandOutput(cmd, args) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe','pipe','ignore'], shell: isWindows });
    return r.status === 0 ? (r.stdout||'').trim() : null;
  } catch { return null; }
}
function checkNode() {
  if (!commandExists('node')) { log('Error: Node.js not installed'); process.exit(1); }
  log(`Detected Node.js: ${getCommandOutput('node',['-v'])}`);
}
function checkVercel() {
  if (commandExists('vercel')) { log(`Vercel CLI installed: ${getCommandOutput('vercel',['--version'])||'unknown'}`); return true; }
  return false;
}
function detectPackageManager() {
  if (commandExists('pnpm')) return 'pnpm';
  if (commandExists('yarn')) return 'yarn';
  if (commandExists('npm')) return 'npm';
  return null;
}
function installVercel(pkg) {
  log(`Installing Vercel CLI using ${pkg}...`);
  const cmds = { pnpm: ['pnpm',['add','-g','vercel']], yarn: ['yarn',['global','add','vercel']], npm: ['npm',['install','-g','vercel']] };
  const e = cmds[pkg];
  if (!e) { log('No package manager found'); process.exit(1); }
  const r = spawnSync(e[0], e[1], { stdio: 'inherit', shell: isWindows });
  if (r.status !== 0) throw new Error(`Exit code: ${r.status}`);
}
function main() {
  log('========================================'); log('Vercel CLI Installation'); log('========================================'); log('');
  checkNode();
  if (checkVercel()) { log('Already installed.'); process.exit(0); }
  const pkg = detectPackageManager();
  if (!pkg) { log('No package manager found'); process.exit(1); }
  log(`Package manager: ${pkg}`); log('');
  installVercel(pkg); log('');
  if (checkVercel()) { log('Vercel CLI installed successfully!'); }
  else { log('Error: Cannot find vercel after install'); process.exit(1); }
}
main();
