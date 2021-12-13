import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';

@Module({
  providers: [PagesResolver, PagesService],
})
export class PagesModule {}
