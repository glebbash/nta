import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PagesModule } from './pages/pages.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    DataModule.forRoot({
      dataPath: join(process.cwd(), 'data'),
      apiRoute: '/data',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PagesModule,
  ],
})
export class AppModule {}
