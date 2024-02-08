import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { ShowAdminGroups } from "../show/dto/show.obj";
import { EditAdminGroupsService } from "./edit.service";
import { EditAdminGroupsArgs } from "./dto/edit.args";

import { AdminAuthGuards } from "@/utils/guards/admin-auth.guards";

@Resolver()
export class EditAdminGroupsResolver {
  constructor(private readonly service: EditAdminGroupsService) {}

  @Mutation(() => ShowAdminGroups)
  @UseGuards(AdminAuthGuards)
  async admin__core_groups__edit(
    @Args() args: EditAdminGroupsArgs
  ): Promise<ShowAdminGroups> {
    return await this.service.edit(args);
  }
}
