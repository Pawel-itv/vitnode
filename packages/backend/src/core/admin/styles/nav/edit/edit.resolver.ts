import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { EditAdminNavStylesService } from './edit.service';
import { EditAdminNavStylesArgs } from './dto/edit.args';

import { AdminAuthGuards } from '@/utils';
import { ShowCoreNav } from '@/core/nav/show/dto/show.obj';

@Resolver()
export class EditAdminNavStylesResolver {
  constructor(private readonly service: EditAdminNavStylesService) {}

  @Mutation(() => ShowCoreNav)
  @UseGuards(AdminAuthGuards)
  async admin__core_styles__nav__edit(
    @Args() args: EditAdminNavStylesArgs,
  ): Promise<ShowCoreNav> {
    return this.service.edit(args);
  }
}
