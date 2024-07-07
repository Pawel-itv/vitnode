import { Module } from '@nestjs/common';

import {
  AdminSessionsModule,
  GlobalAdminSessionsModule,
} from './sessions/sessions.module';
import { AdminPluginsModule } from './plugins/plugins.module';
import { AdminStaffModule } from './staff/staff.module';
import { AdminLanguagesModule } from './languages/languages.module';
import { AdminFilesModule } from './files/files.module';
import { AdminMembersModule } from './members/members.module';
import { AdminGroupsModule } from './groups/groups.module';
import { AdminMetadataModule } from './metadata/metadata.module';
import { AdminSettingsModule } from './settings/settings.module';
import { AdminThemeEditorModule } from './theme_editor/theme_editor.module';
import { AdminInstallModule } from './install/install.module';
import { AdminEmailModule, GlobalAdminEmailModule } from './email/email.module';
import { AdminStylesModule } from './styles/styles.module';
import { AdminSecurityModule } from './security/security.module';

@Module({
  imports: [
    GlobalAdminSessionsModule,
    GlobalAdminEmailModule,
    AdminSessionsModule,
    AdminPluginsModule,
    AdminStylesModule,
    AdminStaffModule,
    AdminLanguagesModule,
    AdminFilesModule,
    AdminMembersModule,
    AdminGroupsModule,
    AdminMetadataModule,
    AdminSettingsModule,
    AdminThemeEditorModule,
    AdminInstallModule,
    AdminEmailModule,
    AdminSecurityModule,
  ],
})
export class AdminModule {}
