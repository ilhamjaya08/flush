#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

const packages = [
  'packages/core/package.json',
  'packages/cli/package.json', 
  'packages/create-flush/package.json'
];

function bumpVersion(type = 'patch') {
  console.log(chalk.blue(`🔢 Bumping ${type} version...\n`));
  
  for (const pkgPath of packages) {
    try {
      const packageJson = JSON.parse(readFileSync(pkgPath, 'utf8'));
      const [major, minor, patch] = packageJson.version.split('.').map(Number);
      
      let newVersion;
      switch (type) {
        case 'major':
          newVersion = `${major + 1}.0.0`;
          break;
        case 'minor':
          newVersion = `${major}.${minor + 1}.0`;
          break;
        case 'patch':
        default:
          newVersion = `${major}.${minor}.${patch + 1}`;
          break;
      }
      
      packageJson.version = newVersion;
      
      // Update dependencies if they reference other flush packages
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
          if (dep.startsWith('flush-')) {
            packageJson.dependencies[dep] = `^${newVersion}`;
          }
        });
      }
      
      writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2));
      
      console.log(chalk.green(`✅ ${packageJson.name}: ${packageJson.version} → ${newVersion}`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to update ${pkgPath}:`), error.message);
    }
  }
  
  console.log(chalk.blue('\n📝 Don\'t forget to commit the version changes!'));
}

const versionType = process.argv[2] || 'patch';
bumpVersion(versionType);