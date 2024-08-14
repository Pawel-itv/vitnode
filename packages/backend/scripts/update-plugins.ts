/* eslint-disable no-console */
import * as fs from 'fs';
import { join } from 'path';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { ConfigPlugin } from '../src/providers/plugins.type';
import coreSchemaDatabase from '../src/database';
import { core_plugins } from '../src/database/schema/plugins';

export const updatePlugins = async ({
  pluginsPath,
  db,
}: {
  db: NodePgDatabase<typeof coreSchemaDatabase>;
  pluginsPath: string;
}) => {
  let isDefaultIndex: number | null = null;
  const defaultPlugin = await db.query.core_plugins.findFirst({
    where: (table, { eq }) => eq(table.default, true),
  });
  const plugins = fs
    .readdirSync(pluginsPath)
    .filter(plugin => !['core', 'plugins.module.ts'].includes(plugin));

  await db.transaction(async tx => {
    await Promise.all(
      plugins.map(async (code, index) => {
        const pluginPath = join(pluginsPath, code);
        const config: ConfigPlugin = JSON.parse(
          fs.readFileSync(join(pluginPath, 'config.json'), 'utf8'),
        );

        if (config.allow_default) {
          isDefaultIndex = index;
        }

        const plugin = await tx.query.core_plugins.findFirst({
          where: (table, { eq }) => eq(table.code, code),
        });

        console.log(`Updating plugin ${config.name}`);

        if (plugin) {
          await tx
            .update(core_plugins)
            .set({
              name: config.name,
              description: config.description,
              support_url: config.support_url,
              author: config.author,
              author_url: config.author_url,
              allow_default: config.allow_default,
              version: config.version,
              version_code: config.version_code,
            })
            .where(eq(core_plugins.id, plugin.id));

          return;
        }

        console.log(`Inserting plugin ${config.name}`);

        await tx.insert(core_plugins).values([
          {
            name: config.name,
            description: config.description,
            code: config.code,
            support_url: config.support_url,
            author: config.author,
            author_url: config.author_url,
            allow_default: config.allow_default,
            version: config.version,
            version_code: config.version_code,
            default: isDefaultIndex === index && !defaultPlugin,
          },
        ]);
      }),
    );
  });
};
