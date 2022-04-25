import { Injectable } from '@nestjs/common';
import { Page } from './entities/page.entity';
import { PageInfo } from './types/page-info';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

@Injectable()
export class PagesService {
  async loadPages(path: string): Promise<PageInfo[]> {
    const files = await readdir(`data/${path}`);

    return files.map((file) => ({ id: `${path}/${file}` }));
  }

  async loadPage(id: string): Promise<PageInfo> {
    return { id };
  }

  async savePage(id: string, content: string): Promise<PageInfo> {
    const pagePath = `data/${id}`;

    if ((await stat(pagePath)).isDirectory()) {
      throw new Error('Cannot save a directory');
    }

    await writeFile(pagePath, content);

    return { id };
  }

  async loadPageContent(id: string): Promise<Page['content']> {
    const pagePath = `data/${id}`;

    if ((await stat(pagePath)).isDirectory()) {
      return '__directory';
    }

    return readFile(pagePath, { encoding: 'utf-8' });
  }
}
