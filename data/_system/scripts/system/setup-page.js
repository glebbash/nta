import { loadScripts } from './load-scripts.js';

export async function setupPage({ src, container }) {
  loadScripts(container, src);
}
