import { request, gql } from 'https://cdn.skypack.dev/graphql-request';

const loadPagesQuery = gql`
  query loadPages($path: String) {
    pages(path: $path) {
      id
    }
  }
`;

/**
 * @returns {Promise<{ id: string }[]>}
 */
export function listPages(/** @type {string} */ path) {
  return request('/graphql', loadPagesQuery, { path });
}

/** @returns {Promise<string>} */
export async function loadPageContent(/** @type {string} */ url) {
  const res = await fetch(url);

  if (res.ok) {
    return res.text();
  }

  console.error({ status: res.status });

  return 'Page not loaded';
}

/** @returns {Promise<unknown>} */
export async function loadScript(/** @type {string} */ url) {
  return import(url);
}
