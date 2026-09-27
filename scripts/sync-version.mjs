// Copies the package.json version into src/manifest.json. Runs automatically from `npm version <bump>`.
import { readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const manifestUrl = new URL('../src/manifest.json', import.meta.url);
const manifest = readFileSync(manifestUrl, 'utf8');
writeFileSync(manifestUrl, manifest.replace(/("version":\s*")[^"]*(")/, `$1${version}$2`));
console.log(`src/manifest.json version set to ${version}`);
