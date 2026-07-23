import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.resolve(testsDir, '..', 'worker', 'index.mjs');

assert.ok(
  fs.existsSync(workerPath),
  'Expected the old site to provide a Wire Runner redirect worker.'
);

const { default: worker } = await import(pathToFileURL(workerPath));
const response = await worker.fetch(
  new Request('https://integrity-kutz.example/wire-runner/?from=phone'),
  {
    ASSETS: {
      fetch() {
        throw new Error('The stale Wire Runner route must redirect before static assets are consulted.');
      }
    }
  }
);

assert.equal(response.status, 308);
assert.equal(
  response.headers.get('location'),
  'https://wire-runner.jabach0811.chatgpt.site/?from=phone'
);

console.log('Wire Runner redirect validation passed.');
