import { Module } from '@nestjs/common';

import { CoreAttachmentsModule } from './attachments/core_attachments.module';
import { CoreGroupsModule } from './groups/core_groups.module';
import { CoreSessionsModule } from './sessions/core_sessions.module';
import { CoreMembersModule } from './members/core_members.module';
import { CoreLanguagesModule } from './languages/core_languages.module';
import { CoreSetupModule } from './setup/core_setup.module';

@Module({
  imports: [
    CoreMembersModule,
    CoreSessionsModule,
    CoreGroupsModule,
    CoreAttachmentsModule,
    CoreLanguagesModule,
    CoreSetupModule
  ]
})
export class CoreModule {}
