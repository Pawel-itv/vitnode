import { join } from 'path';

import { ShowAdminEmailSettingsServiceObj } from './settings/show/dto/show.obj';

import { ABSOLUTE_PATHS_BACKEND } from '@/index';

export interface ShowAdminEmailSettingsServiceObjWithPassword
  extends ShowAdminEmailSettingsServiceObj {
  smtp_password: string;
}

export class HelpersAdminEmailSettingsService {
  protected readonly path: string = join(
    ABSOLUTE_PATHS_BACKEND.plugin({ code: 'core' }).root,
    'utils',
    'email.config.json',
  );
}
