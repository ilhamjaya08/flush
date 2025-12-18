#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import { makeController } from './commands/make-controller';
import { makeModel } from './commands/make-model';
import { makeMiddleware } from './commands/make-middleware';
import { serve } from './commands/serve';
import { migrate } from './commands/migrate';
import { newProject } from './commands/new';

const program = new Command();

program
  .name('flush')
  .description('Flush Framework CLI - Laravel-inspired commands for Bun')
  .version('0.1.0');


program
  .command('serve')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-h, --host <host>', 'Host to run the server on', 'localhost')
  .action(serve);

program
  .command('new <name>')
  .description('Create a new Flush project')
  .option('-t, --template <template>', 'Project template', 'basic')
  .action(newProject);


const makeCommand = program
  .command('make')
  .description('Generate application components');

makeCommand
  .command('controller <name>')
  .description('Create a new controller')
  .option('-r, --resource', 'Generate a resource controller')
  .action(makeController);

makeCommand
  .command('model <name>')
  .description('Create a new model')
  .option('-m, --migration', 'Also create a migration')
  .action(makeModel);

makeCommand
  .command('middleware <name>')
  .description('Create a new middleware')
  .action(makeMiddleware);

makeCommand
  .command('migration <name>')
  .description('Create a new migration')
  .action((name) => {
    console.log(chalk.green(`Creating migration: ${name}`));
  });


const dbCommand = program
  .command('db')
  .description('Database operations');

dbCommand
  .command('migrate')
  .description('Run database migrations')
  .action(migrate);

dbCommand
  .command('seed')
  .description('Seed the database')
  .action(() => {
    console.log(chalk.green('Seeding database...'));
  });


program
  .command('route:list')
  .description('List all registered routes')
  .action(() => {
    console.log(chalk.green('Listing routes...'));
  });


program
  .command('clear')
  .description('Clear application cache')
  .action(() => {
    console.log(chalk.green('Cache cleared!'));
  });


if (process.argv.length <= 2) {
  program.help();
}

program.parse();