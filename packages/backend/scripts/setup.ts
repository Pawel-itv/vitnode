#!/usr/bin/env node
/* eslint-disable no-console */

import * as fs from 'fs';
import { join } from 'path';

import { copyDatabaseSchema } from './copy-database-core';
import { generateManifest } from './generate-manifest';
import { generateMigrations } from './generate-migrations';
import { updatePlugins } from './update-plugins';
import { DATABASE_ENVS, createClientDatabase } from '../src/database/client';
import coreSchemaDatabase from '../src/templates/core/admin/database';
import { generateDatabaseMigrations } from './generate-database-migrations';
import { generateConfig } from './generate-config';

const init = async () => {
  const pluginsPath = join(process.cwd(), 'src', 'plugins');
  const corePluginPath = join(pluginsPath, 'core');
  if (!fs.existsSync(pluginsPath)) {
    console.log(
      `⛔️ Plugins not found in 'src/plugins' directory. "${pluginsPath}"`,
    );
    process.exit(1);
  }

  const database = createClientDatabase({
    config: DATABASE_ENVS,
    schemaDatabase: coreSchemaDatabase,
  });

  console.log(
    '\x1b[34m%s\x1b[0m',
    '[VitNode]',
    '[1/6] Setup the project. Generating the config file...',
  );
  generateConfig({ pluginsPath });

  console.log(
    '\x1b[34m%s\x1b[0m',
    '[VitNode]',
    '[2/6] Copying the database core schema...',
  );
  copyDatabaseSchema({ corePluginPath });

  console.log(
    '\x1b[34m%s\x1b[0m',
    '[VitNode]',
    '[3/6] Generating database migrations...',
  );
  await generateDatabaseMigrations({ pluginsPath });

  console.log(
    '\x1b[34m%s\x1b[0m',
    '[VitNode]',
    '[4/6] Generating the manifest files...',
  );
  generateManifest();

  console.log(
    '\x1b[34m%s\x1b[0m',
    '[VitNode]',
    '[5/6] Generating migrations...',
  );
  await generateMigrations({ pluginsPath, db: database.db });

  console.log('\x1b[34m%s\x1b[0m', '[VitNode]', '[6/6] Updating plugins...');
  await updatePlugins({ pluginsPath, db: database.db });

  await database.poolDB.end();
  console.log('\x1b[34m%s\x1b[0m', '[VitNode]', '✅ Project setup complete.');
  process.exit(0);
};

if (process.argv[2] === 'init') {
  init();
}
