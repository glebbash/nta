import { getPageFolder } from './get-page-folder.js';
import { resolvePath } from './resolve-path.js';

/**@returns {string | undefined} */
export function getAbsoluteUrl(
  /** @type {string | undefined} */ url,
  /** @type {string} */ pageUrl,
) {
  const pageFolder = getPageFolder(pageUrl);
  return resolvePath(pageFolder, url);
}
