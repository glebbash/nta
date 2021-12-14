import { getAbsoluteUrl } from '../utils/get-absolute-url.js';

export async function loadScripts(
  /** @type {ParentNode} */ container,
  /** @type {string} */ pageUrl,
) {
  const scripts = container.querySelectorAll('script');

  for (const script of Array.from(scripts)) {
    await loadScript(script, pageUrl);
  }
}

async function loadScript(
  /** @type {HTMLScriptElement} */ script,
  /** @type {string} */ pageUrl,
) {
  const scriptUrl = `/data/` + getAbsoluteScriptUrl(script, pageUrl);

  if (scriptUrl) {
    return import(scriptUrl);
  }

  loadInlineScript(script);
}

function loadInlineScript(/** @type {HTMLScriptElement} */ script) {
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

  return scriptUrl ? getAbsoluteUrl(scriptUrl, pageUrl) : undefined;
}
