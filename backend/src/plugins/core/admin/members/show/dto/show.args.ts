import { PaginationArgs } from "@/utils/types/database/pagination.type";
import { SortDirectionEnum } from "@/utils/types/database/sort-direction.type";
import { TransformString } from "@/utils/types/database/text-language.type";
import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType
} from "@nestjs/graphql";
import { Transform } from "class-transformer";

export enum ShowAdminMembersSortingColumnEnum {
  name = "name",
  joined = "joined",
  first_name = "first_name",
  last_name = "last_name",
  posts = "posts",
  followers = "followers",
  reactions = "reactions"
}

registerEnumType(ShowAdminMembersSortingColumnEnum, {
  name: "ShowAdminMembersSortingColumnEnum"
});

@InputType()
class ShowAdminMembersSortByArgs {
  @Field(() => ShowAdminMembersSortingColumnEnum)
  column: ShowAdminMembersSortingColumnEnum;

  @Field(() => SortDirectionEnum)
  direction: SortDirectionEnum;
}

@ArgsType()
export class ShowAdminMembersArgs extends PaginationArgs {
  @Field(() => ShowAdminMembersSortByArgs, { nullable: true })
  sortBy: ShowAdminMembersSortByArgs | null;

  @Transform(TransformString)
  @Field(() => String, { nullable: true })
  search: string | null;

  @Field(() => [Int], { nullable: true })
  groups: number[] | null;
}
