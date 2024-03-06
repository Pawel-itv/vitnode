import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DeleteAdminStaffModeratorsArgs } from "./dto/delete.args";

import { CustomError } from "@/utils/errors/CustomError";
import { DatabaseService } from "@/modules/database/database.service";
import { core_moderators_permissions } from "@/modules/admin/core/database/schema/moderators";

@Injectable()
export class DeleteAdminStaffModeratorsService {
  constructor(private databaseService: DatabaseService) {}
  async delete({ id }: DeleteAdminStaffModeratorsArgs): Promise<string> {
    const permission =
      await this.databaseService.db.query.core_moderators_permissions.findFirst(
        {
          where: (table, { eq }) => eq(table.id, id)
        }
      );

    if (permission.protected) {
      throw new CustomError({
        code: "BAD_REQUEST",
        message: "You cannot delete this permission with protected flag."
      });
    }

    await this.databaseService.db
      .delete(core_moderators_permissions)
      .where(eq(core_moderators_permissions.id, id));

    return "Success!";
  }
}
