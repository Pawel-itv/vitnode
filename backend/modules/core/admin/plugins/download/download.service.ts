import { join } from "path";
import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import * as tar from "tar";
import { eq } from "drizzle-orm";

import { DownloadAdminPluginsArgs } from "./dto/download.args";

import { DatabaseService } from "@/modules/database/database.service";
import { NotFoundError } from "@/utils/errors/not-found-error";
import { User } from "@/utils/decorators/user.decorator";
import { generateRandomString } from "@/functions/generate-random-string";
import { currentDate } from "@/functions/date";
import { CustomError } from "@/utils/errors/CustomError";
import { removeSpecialCharacters } from "@/functions/remove-special-characters";
import {
  core_plugins,
  core_plugins_versions
} from "../../database/schema/plugins";

@Injectable()
export class DownloadAdminPluginsService {
  constructor(private databaseService: DatabaseService) {}
  protected tempPath = join(process.cwd(), "temp", "plugins");

  protected createFolders(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true
      });
    }
  }

  protected async prepareTgz({ code }: { code: string }): Promise<void> {
    // Create temp folder
    const tempPath = join(this.tempPath, code);
    this.createFolders(tempPath);

    // Create folders for backend and frontend
    const backendPath = join(tempPath, "backend");
    this.createFolders(backendPath);
    const frontendPath = join(tempPath, "frontend");
    this.createFolders(frontendPath);

    // Copy backend files
    const backendSource = join(process.cwd(), "modules", code);
    fs.cpSync(backendSource, backendPath, { recursive: true });
  }

  protected async createTgz({
    code,
    name
  }: {
    code: string;
    name: string;
  }): Promise<void> {
    this.prepareTgz({ code });

    const path = join(this.tempPath, code);
    try {
      tar
        .c({ gzip: true, file: join("temp", `${name}.tgz`), cwd: path }, ["."])
        .then(() => {
          // Remove temp folder
          fs.rmSync(path, { recursive: true });
        });
    } catch (error) {
      throw new CustomError({
        code: "CREATE_TGZ_ERROR",
        message: "Error creating tgz file"
      });
    }
  }

  async updateVersion({
    code,
    version,
    version_code
  }: DownloadAdminPluginsArgs): Promise<void> {
    if (!version || !version_code) return;

    const update = await this.databaseService.db
      .update(core_plugins)
      .set({
        version,
        version_code
      })
      .where(eq(core_plugins.code, code))
      .returning();

    const pathToVersions = join(
      process.cwd(),
      "modules",
      code,
      "versions.json"
    );
    if (!fs.existsSync(pathToVersions)) {
      throw new CustomError({
        code: "VERSIONS_FILE_NOT_FOUND",
        message: "Versions file not found"
      });
    }

    const versions = JSON.parse(fs.readFileSync(pathToVersions, "utf-8"));
    versions[version_code] = version;
    fs.writeFileSync(pathToVersions, JSON.stringify(versions, null, 2));

    const updateData = update[0];

    await this.databaseService.db.insert(core_plugins_versions).values({
      plugin_id: updateData.id,
      version,
      version_code,
      updated: currentDate()
    });
  }

  async download(
    { code, version, version_code }: DownloadAdminPluginsArgs,
    { id: userId }: User
  ): Promise<string> {
    const plugin = await this.databaseService.db.query.core_plugins.findFirst({
      where: (table, { eq }) => eq(table.code, code)
    });

    if (!plugin) {
      throw new NotFoundError("Plugin");
    }

    await this.updateVersion({ code, version, version_code });

    // Tgs
    const name = removeSpecialCharacters(
      `${code}${
        version && version_code ? version_code : plugin.version_code
      }--${userId}-${generateRandomString(5)}-${currentDate()}`
    );
    await this.createTgz({ code, name });

    return `${name}.tgz`;
  }
}
