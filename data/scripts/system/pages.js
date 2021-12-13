/** @returns {Promise<string>} */
export async function loadPageContent(/** @type {string} */ url) {
  return loadPageContentFetch(url);
}

/** @returns {Promise<string>} */
async function loadPageContentFetch(/** @type {string} */ url) {
  const res = await fetch(url);

  if (res.ok) {
    return res.text();
  }

  console.error({ status: res.status });

  return 'Page not loaded';
}
