import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';
import { PageInfo } from './types/page-info';

@Resolver(() => Page)
export class PagesResolver {
  constructor(private readonly service: PagesService) {}

  @Query(() => [Page])
  async pages(
    @Args('path', { type: () => String, nullable: true }) path = '',
  ): Promise<PageInfo[]> {
    return this.service.loadPages(path);
  }

  @Query(() => Page)
  async page(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PageInfo> {
    return this.service.loadPage(id);
  }

  @ResolveField()
  async content(@Parent() { id }: PageInfo): Promise<Page['content']> {
    return this.service.loadPageContent(id);
  }
}
