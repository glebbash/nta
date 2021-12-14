import { initScripts } from './init-scripts.js';

export async function setupPage({ src, container }) {
  await initScripts(container, src);
}
