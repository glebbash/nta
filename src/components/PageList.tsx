import { useQuery } from 'react-query';
import { PageId, PageInfo } from '../models/pages';
import { listPages, ROOT_PATH } from '../utils/files';

export type PageListProps = {
  selectedPageId: PageId | undefined;
  onPageSelect: (pageInfo: PageInfo) => void;
};

export const PageListQuery = 'page-list';

export const PageList: React.FC<PageListProps> = ({
  selectedPageId,
  onPageSelect,
}) => {
  const { data: response, error } = useQuery(PageListQuery, () =>
    listPages(ROOT_PATH),
  );

  if (error) {
    console.error(error);
    return <>Unknown error</>;
  }

  if (response === undefined) {
    return <>Loading...</>;
  }

  if (!response.ok) {
    return <>Error: {response.type}</>;
  }

  const { pages } = response.data;

  return (
    <ul>
      {pages.map((pageInfo) => (
        <li key={pageInfo.id} onClick={() => onPageSelect(pageInfo)}>
          {pageInfo.id === selectedPageId ? (
            <b>{pageInfo.name}</b>
          ) : (
            pageInfo.name
          )}
        </li>
      ))}
    </ul>
  );
};
