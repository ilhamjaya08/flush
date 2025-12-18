import chalk from 'chalk';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export async function newProject(name: string, options: { template: string }) {
  const { template } = options;
  
  if (existsSync(name)) {
    console.error(chalk.red(`❌ Directory ${name} already exists!`));
    return;
  }
  
  console.log(chalk.blue(`🚀 Creating new Flush project: ${name}`));
  
  // Create project directory
  mkdirSync(name, { recursive: true });
  
  // Create project structure
  createProjectStructure(name, template);
  
  console.log(chalk.green(`✅ Project ${name} created successfully!`));
  console.log(chalk.blue('📝 Next steps:'));
  console.log(chalk.gray(`   cd ${name}`));
  console.log(chalk.gray('   bun install'));
  console.log(chalk.gray('   flush serve'));
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
      '@flush/core': 'latest',
      '@flush/cli': 'latest'
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
  
  // Create tsconfig.json
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
  
  // Create main application file
  const appTemplate = `import { FlushApp, Middleware } from '@flush/core';
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
  
  // Create routes file
  const routesTemplate = `import type { FlushApp } from '@flush/core';
import { HomeController } from './controllers/HomeController';

export function routes(app: FlushApp) {
  // Home routes
  app.get('/', HomeController.index);
  
  // API routes
  app.group('/api', (router) => {
    router.get('/health', (req, res) => {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });
}
`;
  
  writeFileSync(path.join(projectPath, 'src/routes/index.ts'), routesTemplate);
  
  // Create HomeController
  const homeControllerTemplate = `import { Controller } from '@flush/core';
import type { FlushRequest, FlushResponse } from '@flush/core';

export class HomeController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    return res.json({
      message: 'Welcome to Flush Framework!',
      version: '0.1.0',
      docs: 'https://flush-framework.dev'
    });
  }
}
`;
  
  writeFileSync(path.join(projectPath, 'src/controllers/HomeController.ts'), homeControllerTemplate);
  
  // Create .gitignore
  const gitignore = `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
`;
  
  writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
  
  // Create README.md
  const readme = `# ${projectName}

A Flush framework application.

## Getting Started

\`\`\`bash
# Install dependencies
bun install

# Start development server
flush serve

# Build for production
bun run build

# Start production server
bun start
\`\`\`

## Available Commands

\`\`\`bash
# Generate controller
flush make controller UserController --resource

# Generate model
flush make model User --migration

# Generate middleware
flush make middleware AuthMiddleware

# Run migrations
flush db:migrate

# List routes
flush route:list
\`\`\`

## Project Structure

\`\`\`
src/
├── controllers/     # Request handlers
├── models/         # Data models
├── middleware/     # Custom middleware
├── routes/         # Route definitions
└── views/          # View templates

database/
├── migrations/     # Database migrations
└── seeds/          # Database seeders
\`\`\`
`;
  
  writeFileSync(path.join(projectPath, 'README.md'), readme);
}