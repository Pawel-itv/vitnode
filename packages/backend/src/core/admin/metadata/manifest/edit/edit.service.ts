import * as fs from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EditAdminManifestMetadataObj } from './dto/edit.args';
import { ShowAdminManifestMetadataObj } from '../show/dto/show.obj';
import { getManifest } from '../functions';

import { InternalDatabaseService } from '@/utils/database/internal_database.service';
import { ABSOLUTE_PATHS_BACKEND } from '@/index';
import { core_languages } from '@/database/schema/languages';

@Injectable()
export class EditAdminManifestMetadataService {
  constructor(
    private readonly databaseService: InternalDatabaseService,
    private readonly configService: ConfigService,
  ) {}

  protected updateManifest({
    data,
    lang_code,
  }: {
    data: EditAdminManifestMetadataObj;
    lang_code: string;
  }): ShowAdminManifestMetadataObj {
    const frontendUrl: string = this.configService.getOrThrow('frontend_url');
    const manifest = getManifest({ lang_code });
    const newManifest: ShowAdminManifestMetadataObj = {
      ...manifest,
      ...data,
      theme_color: data.theme_color ? `#${data.theme_color}` : '',
      background_color: data.background_color
        ? `#${data.background_color}`
        : '',
      start_url: `${frontendUrl}/${lang_code}${data.start_url}`,
      id: `${frontendUrl}/${lang_code}${data.start_url}`,
    };

    fs.writeFileSync(
      join(
        ABSOLUTE_PATHS_BACKEND.uploads.public,
        'assets',
        lang_code,
        'manifest.webmanifest',
      ),
      JSON.stringify(newManifest, null, 2),
    );

    return newManifest;
  }

  async edit(
    data: EditAdminManifestMetadataObj,
  ): Promise<ShowAdminManifestMetadataObj> {
    const languages = await this.databaseService.db
      .select({
        code: core_languages.code,
      })
      .from(core_languages);

    const manifests = languages.map(lang =>
      this.updateManifest({
        data,
        lang_code: lang.code,
      }),
    );
    const enManifest = manifests.find(manifest => manifest.lang === 'en');

    return enManifest ? enManifest : manifests[0];
  }
}
