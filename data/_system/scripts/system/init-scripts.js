import { loadScript } from './server.js';
import { getAbsoluteUrl } from '../utils/get-absolute-url.js';

export async function initScripts(
  /** @type {ParentNode} */ container,
  /** @type {string} */ pageUrl,
) {
  const scripts = container.querySelectorAll('script');

  for (const script of Array.from(scripts)) {
    await initScriptElement(container, script, pageUrl);
  }
}

async function initScriptElement(
  /** @type {ParentNode} */ container,
  /** @type {HTMLScriptElement} */ script,
  /** @type {string} */ pageUrl,
) {
  const scriptUrl = getAbsoluteScriptUrl(script, pageUrl);

  if (scriptUrl) {
    const script = await loadScript(scriptUrl);

    if ('main' in script) {
      await script.main(container);
    }

    return;
  }

  initInlineScriptElement(script);
}

function initInlineScriptElement(/** @type {HTMLScriptElement} */ script) {
  const scriptCopy = document.createElement('script');
  for (const attribute of Array.from(script.attributes)) {
    scriptCopy.setAttribute(attribute.name, attribute.value);
  }
  scriptCopy.text = script.text;
  script.parentNode.replaceChild(scriptCopy, script);
}

function getAbsoluteScriptUrl(
  /** @type {HTMLScriptElement} */ script,
  /** @type {string} */ pageUrl,
) {
  const scriptUrl = script.getAttribute('src');

  if (!scriptUrl) {
    return undefined;
  }

  if (!scriptUrl.startsWith('/') && !scriptUrl.startsWith('.')) {
    return scriptUrl;
  }

  return `/data/` + getAbsoluteUrl(scriptUrl, pageUrl);
}
