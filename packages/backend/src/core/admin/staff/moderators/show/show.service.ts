import { Injectable } from '@nestjs/common';
import { count } from 'drizzle-orm';

import { ShowAdminStaffModeratorsArgs } from './dto/show.args';
import { ShowAdminStaffModeratorsObj } from './dto/show.obj';

import { InternalDatabaseService } from '@/utils/database/internal_database.service';
import { inputPaginationCursor, outputPagination } from '@/functions';
import { core_moderators_permissions } from '@/database/schema/moderators';
import { SortDirectionEnum } from '@/utils';
import { NotFoundError } from '@/errors';

@Injectable()
export class ShowAdminStaffModeratorsService {
  constructor(private readonly databaseService: InternalDatabaseService) {}

  async show({
    cursor,
    first,
    last,
    sortBy,
  }: ShowAdminStaffModeratorsArgs): Promise<ShowAdminStaffModeratorsObj> {
    const pagination = await inputPaginationCursor({
      cursor,
      database: core_moderators_permissions,
      databaseService: this.databaseService,
      first,
      last,
      primaryCursor: {
        column: 'id',
        schema: core_moderators_permissions.id,
      },
      defaultSortBy: {
        direction: SortDirectionEnum.desc,
        column: 'updated',
      },
      sortBy,
    });

    const edges =
      await this.databaseService.db.query.core_moderators_permissions.findMany({
        ...pagination,
        with: {
          group: {
            with: {
              name: true,
            },
          },
          user: {
            with: {
              avatar: true,
              group: {
                with: {
                  name: true,
                },
              },
            },
          },
        },
      });

    const totalCount = await this.databaseService.db
      .select({ count: count() })
      .from(core_moderators_permissions);

    return outputPagination({
      edges: edges.map(edge => {
        if (edge.user) {
          return {
            ...edge,
            user_or_group: {
              ...edge.user,
            },
          };
        }

        if (!edge.group) {
          throw new NotFoundError('Group');
        }

        return {
          ...edge,
          user_or_group: {
            ...edge.group,
            group_name: edge.group.name,
          },
        };
      }),
      totalCount,
      first,
      cursor,
      last,
    });
  }
}
