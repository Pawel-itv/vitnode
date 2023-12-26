import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ShowAdminStaffModeratorsService } from './show.service';
import { ShowAdminStaffModeratorsObj } from './dto/show.obj';
import { ShowAdminStaffModeratorsArgs } from './dto/show.args';

import { AdminAuthGuards } from '@/utils/guards/admin-auth.guards';

@Resolver()
export class ShowAdminStaffModeratorsResolver {
  constructor(private readonly service: ShowAdminStaffModeratorsService) {}

  @Query(() => ShowAdminStaffModeratorsObj)
  @UseGuards(AdminAuthGuards)
  async core_staff_moderators__admin__show(
    @Args() args: ShowAdminStaffModeratorsArgs
  ): Promise<ShowAdminStaffModeratorsObj> {
    return await this.service.show(args);
  }
}
