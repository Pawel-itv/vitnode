import { Injectable } from '@nestjs/common';

import { ShowAdminGroups } from '../show/dto/show.obj';
import { CreateAdminGroupsArgs } from './dto/create.args';

import { InternalDatabaseService } from '@/utils/database/internal_database.service';
import { ParserTextLanguageCoreHelpersService } from '../../../helpers/text_language/parser/parser.service';
import { core_groups, core_groups_names } from '@/database/schema/groups';

@Injectable()
export class CreateAdminGroupsService {
  constructor(
    private readonly databaseService: InternalDatabaseService,
    private readonly parserTextLang: ParserTextLanguageCoreHelpersService,
  ) {}

  async create({
    content,
    name,
    color,
  }: CreateAdminGroupsArgs): Promise<ShowAdminGroups> {
    const group = await this.databaseService.db
      .insert(core_groups)
      .values({
        ...content,
        color: color ? color : null,
      })
      .returning();

    const groupNames = await this.parserTextLang.parse({
      item_id: group[0].id,
      database: core_groups_names,
      data: name,
    });

    return {
      ...group[0],
      name: groupNames,
      users_count: 0,
      content,
    };
  }
}
