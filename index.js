const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const startpairing = require('./pair');

async function main() {
  console.log(chalk.green('TEAM 810 WhatsApp Bot starting...'));
  require('./web');
  const pairingRoot = path.join(__dirname, 'kingbadboitimewisher', 'pairing');
  if (fs.existsSync(pairingRoot)) {
    const numbers = fs.readdirSync(pairingRoot, { withFileTypes: true })
      .filter(x => x.isDirectory() && fs.existsSync(path.join(pairingRoot, x.name, 'creds.json')))
      .map(x => x.name);
    for (const number of numbers) {
      try {
        console.log(chalk.cyan(`[TEAM 810] Restoring session ${number}`));
        await startpairing(number);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (err) {
        console.error('[TEAM 810] Session restore failed:', err.message);
      }
    }
  }
}
process.on('unhandledRejection', reason => console.error('[TEAM 810] Unhandled rejection:', reason));
process.on('uncaughtException', error => console.error('[TEAM 810] Uncaught exception:', error));
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
main().catch(err => { console.error('[TEAM 810] Startup failed:', err); process.exit(1); });
