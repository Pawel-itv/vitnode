#!/usr/bin/env node
/* eslint-disable no-console */

import { join } from 'path';
import * as fs from 'fs';

const init = () => {
  const initConsole = '\x1b[34m[VitNode]\x1b[0m \x1b[33m[Frontend]\x1b[0m';
  // Copy frontend files from app dir
  const frontendPackagePath = join(__dirname, '..', '..', 'folders_to_copy');
  const frontendAppPath = process.cwd();
  const pathsToFolders = [
    join('app', '[locale]', 'admin', '(vitnode)'),
    join('app', '[locale]', 'admin', '(auth)', '(vitnode)'),
  ];
  const pathsToFoldersOptional = [
    join('app', '[locale]', '(main)', '(vitnode)'),
  ];
  const pathsToFiles = [
    {
      folder: join('app', '[locale]', '(main)', '(vitnode)', '[...rest]'),
      file: 'page.tsx',
    },
    {
      folder: 'app',
      file: 'not-found.tsx',
    },
    {
      folder: join('app', `[locale]`),
      file: 'layout.tsx',
    },
    {
      folder: join('app', `[locale]`, 'admin'),
      file: 'layout.tsx',
    },
    {
      folder: join('app', `[locale]`, 'admin', '(auth)'),
      file: 'layout.tsx',
    },
    {
      folder: join('app', `[locale]`, '(main)'),
      file: 'page.tsx',
    },
    {
      folder: join('plugins', 'core', 'langs'),
      file: 'en.json',
    },
  ];

  if (!fs.existsSync(frontendPackagePath)) {
    console.log(
      `${initConsole} ⛔️ The frontend package does not have any files to copy. Please report this issue to the VitNode GitHub.`,
    );
    process.exit(1);
  }

  // Copy folders
  pathsToFolders.forEach(folder => {
    const appPath = join(frontendAppPath, folder);
    const packagePath = join(frontendPackagePath, folder);
    if (!fs.existsSync(packagePath)) {
      fs.mkdirSync(packagePath, { recursive: true });
    }

    fs.cpSync(packagePath, appPath, { recursive: true });
  });

  // Copy folders if don't exist
  pathsToFoldersOptional.forEach(folder => {
    const appPath = join(frontendAppPath, folder);

    if (!fs.existsSync(appPath)) {
      fs.mkdirSync(appPath, { recursive: true });
    }

    const files = fs.readdirSync(appPath, { recursive: true });

    // Check every file if it exists in the frontend package
    files
      .filter(el => typeof el === 'string')
      .forEach(file => {
        const appFilePath = join(appPath, file);
        const packageFilePath = join(frontendPackagePath, folder, file);

        if (!fs.existsSync(packageFilePath)) {
          fs.cpSync(appFilePath, packageFilePath, {
            recursive: true,
          });
        }
      });
  });

  pathsToFiles.forEach(file => {
    const appPath = join(frontendAppPath, file.folder, file.file);
    const packagePath = join(frontendPackagePath, file.folder, file.file);

    fs.cpSync(packagePath, appPath, {
      recursive: true,
    });
  });

  console.log(`${initConsole} ✅ Frontend files copied successfully.`);
  process.exit(0);
};

if (process.argv[2] === 'init') {
  init();
}
