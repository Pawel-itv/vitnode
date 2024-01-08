import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PageInfo } from '@/types/database/pagination.type';

@ObjectType()
export class ShowCoreLanguagesObj {
  @Field(() => [ShowCoreLanguages])
  edges: ShowCoreLanguages[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class ShowCoreLanguages {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  timezone: string;

  @Field(() => Boolean)
  protected: boolean;

  @Field(() => Boolean)
  default: boolean;

  @Field(() => Boolean)
  enabled: boolean;
}
