export function getPageFolder(/** @type {string} */ pagePath) {
  return pagePath.endsWith('.html')
    ? pagePath.substring(0, pagePath.lastIndexOf('/'))
    : pagePath;
}
