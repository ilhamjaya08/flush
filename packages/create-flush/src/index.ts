#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const program = new Command();

program
  .name('create-flush')
  .description('Create a new Flush framework application')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Project template', 'basic')
  .action(async (projectName, options) => {
    let name = projectName;
    
    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          validate: (input) => input.length > 0 || 'Project name is required'
        }
      ]);
      name = answers.projectName;
    }
    
    await createProject(name, options.template);
  });

async function createProject(name: string, template: string) {
  if (existsSync(name)) {
    console.error(chalk.red(`❌ Directory ${name} already exists!`));
    return;
  }
  
  console.log(chalk.blue(`🚀 Creating Flush project: ${name}`));
  console.log(chalk.gray(`📦 Using template: ${template}`));
  
  // Create project directory
  mkdirSync(name, { recursive: true });
  
  // Create project structure
  createProjectStructure(name, template);
  
  console.log(chalk.green(`✅ Project ${name} created successfully!`));
  console.log(chalk.blue('\n📝 Next steps:'));
  console.log(chalk.gray(`   cd ${name}`));
  console.log(chalk.gray('   bun install'));
  console.log(chalk.gray('   bun run dev'));
  console.log(chalk.blue('\n🔧 Available commands:'));
  console.log(chalk.gray('   bun run dev     - Start development server'));
  console.log(chalk.gray('   flush --help    - Show CLI commands'));
}

function createProjectStructure(projectName: string, template: string) {
  const projectPath = path.resolve(projectName);
  
  // Create directories
  const dirs = [
    'src/controllers',
    'src/models',
    'src/middleware',
    'src/routes',
    'src/views',
    'database/migrations',
    'database/seeds',
    'public',
    'tests'
  ];
  
  dirs.forEach(dir => {
    mkdirSync(path.join(projectPath, dir), { recursive: true });
  });
  
  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: 'A Flush framework application',
    type: 'module',
    scripts: {
      dev: 'flush serve',
      build: 'bun build src/index.ts --outdir dist --target bun',
      start: 'bun run dist/index.js',
      test: 'bun test'
    },
    dependencies: {
      'flush-core': '^0.1.0',
      'flush-cli': '^0.1.0'
    },
    devDependencies: {
      '@types/bun': 'latest',
      typescript: '^5.0.0'
    }
  };
  
  writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create other files (same as before)
  createAppFiles(projectPath);
}

function createAppFiles(projectPath: string) {
  // Main app file
  const appTemplate = `import { FlushApp, Middleware } from 'flush-core';
import { routes } from './routes';

const app = new FlushApp({
  port: 3000,
  host: 'localhost'
});

// Register middleware
app.use(Middleware.logger());
app.use(Middleware.cors());
app.use(Middleware.json());

// Register routes
routes(app);

// Start server
app.listen().catch(console.error);
`;
  
  writeFileSync(path.join(projectPath, 'src/index.ts'), appTemplate);
  
  // Routes file
  const routesTemplate = `import type { FlushApp } from 'flush-core';
import { HomeController } from './controllers/HomeController';

export function routes(app: FlushApp) {
  // Home routes
  app.get('/', HomeController.index);
  
  // API routes
  app.group('/api', (router) => {
    router.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });
}
`;
  
  writeFileSync(path.join(projectPath, 'src/routes/index.ts'), routesTemplate);
  
  // HomeController
  const homeControllerTemplate = `import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class HomeController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    res.json({
      message: 'Welcome to Flush Framework! 🚀',
      version: '1.0.0',
      docs: 'https://flush-framework.dev'
    });
  }
}
`;
  
  writeFileSync(path.join(projectPath, 'src/controllers/HomeController.ts'), homeControllerTemplate);
  
  // Other config files
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      jsx: 'react-jsx',
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };
  
  writeFileSync(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
  
  // .gitignore
  const gitignore = `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
`;
  
  writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
  
  // README.md
  const readme = `# ${path.basename(projectPath)}

A Flush framework application.

## Getting Started

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
\`\`\`

## Available Commands

\`\`\`bash
flush make controller UserController --resource
flush make model User --migration
flush make middleware AuthMiddleware
flush db:migrate
flush route:list
\`\`\`
`;
  
  writeFileSync(path.join(projectPath, 'README.md'), readme);
}

program.parse();