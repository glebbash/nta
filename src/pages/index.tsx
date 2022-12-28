import type { NextPage } from 'next';
import Head from 'next/head';
import { PageList, PageListQuery } from '../components/PageList';
import { PageView, pageQueryFor } from '../components/PageView';
import { useState } from 'react';
import { Page } from '../models/pages';
import { useMutation, useQueryClient } from 'react-query';
import { savePage } from '../utils/files';

const Home: NextPage = () => {
  const queryClient = useQueryClient();
  const [selectedPageId, setSelectedPageId] = useState<string>();
  const savePageMutation = useMutation('save-page', savePage);

  const onPageChange = async (page: Page) => {
    await savePageMutation.mutateAsync(page);
    await queryClient.invalidateQueries(PageListQuery);
    await queryClient.invalidateQueries(pageQueryFor(page.id));
  };

  return (
    <div className="h-screen">
      <Head>
        <title>NTA</title>
      </Head>

      <main className="flex h-full">
        <div className="w-1/4 h-full bg-gray-700">
          <PageList
            selectedPageId={selectedPageId}
            onPageSelect={(p) => setSelectedPageId(p.id)}
          />
        </div>
        <div className="w-full h-full bg-gray-500">
          {selectedPageId ? (
            <PageView pageId={selectedPageId} onPageChange={onPageChange} />
          ) : (
            <>No page selected</>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
