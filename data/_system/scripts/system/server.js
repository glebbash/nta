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
