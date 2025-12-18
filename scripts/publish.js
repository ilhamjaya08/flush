#!/usr/bin/env bun

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import chalk from 'chalk';

const packages = [
  'packages/core',
  'packages/cli', 
  'packages/create-flush'
];

async function publishPackages() {
  console.log(chalk.blue('🚀 Publishing Flush Framework packages...\n'));
  
  // Build all packages first
  console.log(chalk.yellow('📦 Building packages...'));
  execSync('bun run build', { stdio: 'inherit' });
  
  for (const pkg of packages) {
    try {
      console.log(chalk.blue(`\n📤 Publishing ${pkg}...`));
      
      // Read package.json to get name and version
      const packageJson = JSON.parse(readFileSync(`${pkg}/package.json`, 'utf8'));
      console.log(chalk.gray(`   Package: ${packageJson.name}@${packageJson.version}`));
      
      // Publish to npm
      execSync('npm publish --access public', { 
        cwd: pkg, 
        stdio: 'inherit' 
      });
      
      console.log(chalk.green(`✅ Successfully published ${packageJson.name}`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to publish ${pkg}:`), error.message);
    }
  }
  
  console.log(chalk.green('\n🎉 Publishing complete!'));
  console.log(chalk.blue('\n📝 Users can now install with:'));
  console.log(chalk.gray('   bunx create-flush my-app'));
  console.log(chalk.gray('   # or'));
  console.log(chalk.gray('   bun add flush-core flush-cli'));
}

publishPackages().catch(console.error);