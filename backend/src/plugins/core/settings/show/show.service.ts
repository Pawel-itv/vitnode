import { join } from "path";
import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ShowSettingsObj } from "./dto/show.obj";
import { ManifestWithLang } from "../settings.module";

import { core_languages } from "../../admin/database/schema/languages";
import { DatabaseService } from "@/database/database.service";
import { Ctx } from "@/utils/types/context.type";
import { getConfigFile } from "@/utils/DELETE/config_test";

@Injectable()
export class ShowSettingsService {
  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService
  ) {}

  protected async getThemeId({
    req
  }: Pick<Ctx, "req">): Promise<number | null> {
    const cookie_theme_id: string | null =
      req.cookies[this.configService.getOrThrow("cookies.theme_id.name")];

    if (cookie_theme_id) {
      const theme = await this.databaseService.db.query.core_themes.findFirst({
        where: (table, { eq }) => eq(table.id, parseInt(cookie_theme_id))
      });

      if (theme) {
        return theme.id;
      }
    }

    return null;
  }

  protected getManifest({
    langCodes
  }: {
    langCodes: string[];
  }): ManifestWithLang[] {
    return langCodes.map(lang => {
      const path = join(
        process.cwd(),
        "public",
        "assets",
        lang,
        "manifest.webmanifest"
      );
      const data = fs.readFileSync(path, "utf8");
      const manifest: ManifestWithLang = JSON.parse(data);

      return manifest;
    });
  }

  async show({ req }: Ctx): Promise<ShowSettingsObj> {
    const config = await getConfigFile();

    const languages = await this.databaseService.db
      .select({
        code: core_languages.code,
        enabled: core_languages.enabled,
        site_copyright: core_languages.site_copyright
      })
      .from(core_languages);
    const enabledLanguages = languages.filter(item => item.enabled);
    const manifest = this.getManifest({
      langCodes: enabledLanguages.map(item => item.code)
    });

    return {
      ...config.settings.general,
      site_description: manifest.map(item => ({
        language_code: item.lang,
        value: item.description
      })),
      site_copyright: enabledLanguages.map(item => ({
        language_code: item.code,
        value: item.site_copyright
      })),
      theme_id: await this.getThemeId({ req })
    };
  }
}
