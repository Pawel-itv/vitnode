import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PageInfo, TextLanguage } from '@/utils';

@ObjectType()
class ShowCoreNavItem {
  @Field(() => Int)
  id: number;

  @Field(() => [TextLanguage])
  name: TextLanguage[];

  @Field(() => [TextLanguage])
  description: TextLanguage[];

  @Field(() => String)
  href: string;

  @Field(() => Int)
  position: number;

  @Field(() => Boolean)
  external: boolean;

  @Field(() => String, { nullable: true })
  icon: string | null;
}

@ObjectType()
export class ShowCoreNav extends ShowCoreNavItem {
  @Field(() => [ShowCoreNavItem])
  children: ShowCoreNavItem[];
}

@ObjectType()
export class ShowCoreNavObj {
  @Field(() => [ShowCoreNav])
  edges: ShowCoreNav[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
