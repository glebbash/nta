import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { static as useStatic, type Express } from 'express';

export const DataModuleOptions = Symbol('DataModuleOptions');
export type DataModuleOptions = {
  apiRoute: string;
  dataPath: string;
};

@Module({})
export class DataModule implements OnModuleInit {
  constructor(
    @Inject(DataModuleOptions)
    private options: DataModuleOptions,
    private httpAdapterHost: HttpAdapterHost,
  ) {}

  static forRoot(options: DataModuleOptions): DynamicModule {
    return {
      module: DataModule,
      providers: [{ provide: DataModuleOptions, useValue: options }],
    };
  }

  async onModuleInit() {
    const app: Express = this.httpAdapterHost.httpAdapter.getInstance();

    app.use(this.options.apiRoute, useStatic(this.options.dataPath));
  }
}
