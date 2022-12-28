import { useQuery } from 'react-query';
import { Page, PageId } from '../models/pages';
import { loadPage } from '../utils/files';

export type PageEditorProps = {
  pageId: PageId;
  onPageChange: (page: Page) => void;
};

export const pageQueryFor = (pageId: string) => {
  return `pages/${pageId}`;
};

export const PageView = ({ pageId }: PageEditorProps) => {
  const { data: response, error } = useQuery(pageQueryFor(pageId), () =>
    loadPage(pageId),
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

  const page = response.data;

  return (
    <div>
      <p>Path: {'Root' + page.path.join('/') + '/' + page.name}</p>
      <p>Meta: {JSON.stringify(page.meta)}</p>
      <p>Content: {page.content}</p>
    </div>
  );
};
