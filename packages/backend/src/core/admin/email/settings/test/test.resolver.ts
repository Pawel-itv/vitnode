import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { TestAdminEmailSettingsService } from './test.service';
import { TestAdminEmailSettingsServiceArgs } from './dto/test.args';

import { AdminAuthGuards } from '@/utils';
import { CurrentUser, User } from '@/decorators';

@Resolver()
export class TestAdminEmailSettingsResolver {
  constructor(private readonly service: TestAdminEmailSettingsService) {}

  @Mutation(() => String)
  @UseGuards(AdminAuthGuards)
  async admin__core_email_settings__test(
    @Args() args: TestAdminEmailSettingsServiceArgs,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.service.test(args, user);
  }
}
