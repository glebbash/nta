import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Page {
  @Field(() => String)
  id: string;

  @Field(() => String)
  content: string;
}
