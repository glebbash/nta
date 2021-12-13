export function setupPage({ src, container }) {
  loadScripts(container, src);
}

function loadScripts(
  /** @type {ParentNode} */ container,
  /** @type {string} */ src,
) {
  const scripts = container.querySelectorAll('script');

  for (const script of Array.from(scripts)) {
    const scriptCopy = document.createElement('script');
    for (const attribute of Array.from(script.attributes)) {
      scriptCopy.setAttribute(attribute.name, attribute.value);
    }
    scriptCopy.text = script.text;

    enableRelativeSrc(scriptCopy, src);

    script.parentNode.replaceChild(scriptCopy, script);
  }
}

function enableRelativeSrc(
  /** @type {HTMLScriptElement} */ script,
  /** @type {string} */ pageSrc,
) {
  const src = script.getAttribute('src');

  if (!src) {
    return;
  }

  const absoluteSrc = getAbsoluteUrl(src, pageSrc);
  script.src = absoluteSrc;
}

/**@returns {string | undefined} */
function getAbsoluteUrl(
  /** @type {string | undefined} */ url,
  /** @type {string} */ pageUrl,
) {
  const fullPageUrl =
    window.location.protocol + '//' + window.location.host + '/data/' + pageUrl;

  const pagePath = new URL(fullPageUrl).pathname;
  const pageFolder = pagePath.substring(0, pagePath.lastIndexOf('/'));
  return url?.startsWith('.') ? pageFolder + url.slice(1) : url;
}
