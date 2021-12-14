import 'https://unpkg.com/react@17/umd/react.development.js';
import 'https://unpkg.com/react-dom@17/umd/react-dom.development.js';
import 'https://unpkg.com/react-query@3.34.2/dist/react-query.development.js';
import { request, gql } from 'https://cdn.skypack.dev/graphql-request';

import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);
const { useQuery, QueryClient, QueryClientProvider } = ReactQuery;

/**
 * @typedef {{ src: string, name: string }} PageInfo
 */

const loadPagesQuery = gql`
  query loadPages($path: String) {
    pages(path: $path) {
      id
    }
  }
`;

const queryClient = new QueryClient();

function PagesListPage() {
  return html`
    <div
      className="h-100 p-1"
      style=${{ backgroundColor: 'var(--bs-gray-400)' }}
    >
      <${QueryClientProvider} client=${queryClient}>
        <${PagesList} />
      <//>
    </div>
  `;
}

function PagesList() {
  const { data, error } = useQuery('pages-list', () =>
    request('/graphql', loadPagesQuery, { path: 'pages' }),
  );

  if (error) {
    console.error(error);
    return 'Error';
  }

  if (!data) {
    return 'Loading...';
  }

  const pageList = data.pages.map(({ id }) => ({ src: id, name: id }));

  const pageItems = pageList.map((pageInfo) => PageItem(pageInfo));

  return html`
    <ul className="list-group">
      ${pageItems}
    </ul>
  `;
}

function PageItem(/** @type {PageInfo} */ pageInfo) {
  return html`
    <li className="list-group-item" key="${pageInfo.name}">
      <page-link src="/${pageInfo.src}"> ${pageInfo.name} <//>
    </li>
  `;
}

ReactDOM.render(
  html`<${PagesListPage} />`,
  document.getElementById('root').parentElement,
);
