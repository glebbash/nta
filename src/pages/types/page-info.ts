import { Page } from '../entities/page.entity';

export type PageInfo = Omit<Page, 'content'>;
