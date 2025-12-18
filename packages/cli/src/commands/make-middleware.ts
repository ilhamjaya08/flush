import chalk from 'chalk';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export function makeMiddleware(name: string) {
  // Ensure middleware directory exists
  const middlewareDir = 'src/middleware';
  if (!existsSync(middlewareDir)) {
    mkdirSync(middlewareDir, { recursive: true });
  }
  
  const className = name.charAt(0).toUpperCase() + name.slice(1) + 'Middleware';
  const fileName = `${className}.ts`;
  const filePath = path.join(middlewareDir, fileName);
  
  if (existsSync(filePath)) {
    console.error(chalk.red(`❌ Middleware ${className} already exists!`));
    return;
  }
  
  const template = getMiddlewareTemplate(className);
  
  writeFileSync(filePath, template);
  
  console.log(chalk.green(`✅ Middleware created: ${filePath}`));
  console.log(chalk.blue('📝 Don\'t forget to register it in your app!'));
}

function getMiddlewareTemplate(className: string): string {
  return `import type { FlushRequest, FlushResponse, MiddlewareFunction } from 'flush-core';

export class ${className} {
  static handle(): MiddlewareFunction {
    return async (req: FlushRequest, res: FlushResponse, next: () => void) => {
      // Your middleware logic here
      console.log('${className} executed');
      
      // Call next() to continue to the next middleware or route handler
      next();
    };
  }
}

// Export as default function for easier usage
export default ${className}.handle();
`;
}