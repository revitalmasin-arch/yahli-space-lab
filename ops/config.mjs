// Fixed ports and paths shared by ops scripts. The production port must never change between
// releases: browser-local progress is tied to the origin (host + port).
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const PORTS = {
  dev: 5180, // vite dev server (hot reload)
  prod: 8090, // Yahli's stable release
  staging: 8091, // manual preview of a candidate
  smoke: 8095, // candidate smoke test (temporary)
  e2e: 5199, // automated browser tests (temporary)
  sandboxProd: 8097, // release/rollback tests in a throwaway releases dir
};
export const RELEASES_DIR = process.env.YSL_RELEASES_DIR ? resolve(process.env.YSL_RELEASES_DIR) : resolve(ROOT, 'releases');
export const PROD_PORT = Number(process.env.YSL_PROD_PORT ?? PORTS.prod);
