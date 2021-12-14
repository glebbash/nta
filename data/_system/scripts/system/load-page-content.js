/** @returns {Promise<string>} */
export async function loadPageContent(/** @type {string} */ url) {
  const res = await fetch(url);

  if (res.ok) {
    return res.text();
  }

  console.error({ status: res.status });

  return 'Page not loaded';
}
