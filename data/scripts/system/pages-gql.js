import { request, gql } from 'https://cdn.skypack.dev/graphql-request';

const SERVER_URL = '/graphql';

const loadPageQuery = gql`
  query loadPage($pageId: String!) {
    page(id: $pageId) {
      content
    }
  }
`;

/** @returns {Promise<string>} */
export async function loadPageContentGraphQL(/** @type {string} */ pageId) {
  try {
    const { page } = await request(SERVER_URL, loadPageQuery, {
      pageId: pageId.slice('/data/pages'.length),
    });

    return page.content;
  } catch (e) {
    console.error(e);

    return 'Page not loaded';
  }
}
