import chalk from 'chalk';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export function makeController(name: string, options: { resource?: boolean }) {
  const { resource } = options;
  
  // Ensure controllers directory exists
  const controllersDir = 'src/controllers';
  if (!existsSync(controllersDir)) {
    mkdirSync(controllersDir, { recursive: true });
  }
  
  const className = name.charAt(0).toUpperCase() + name.slice(1) + 'Controller';
  const fileName = `${className}.ts`;
  const filePath = path.join(controllersDir, fileName);
  
  if (existsSync(filePath)) {
    console.error(chalk.red(`❌ Controller ${className} already exists!`));
    return;
  }
  
  const template = resource ? getResourceControllerTemplate(className) : getBasicControllerTemplate(className);
  
  writeFileSync(filePath, template);
  
  console.log(chalk.green(`✅ Controller created: ${filePath}`));
  
  if (resource) {
    console.log(chalk.blue('📝 Resource controller methods created:'));
    console.log(chalk.gray('   - index()   - List all resources'));
    console.log(chalk.gray('   - show()    - Show single resource'));
    console.log(chalk.gray('   - store()   - Create new resource'));
    console.log(chalk.gray('   - update()  - Update existing resource'));
    console.log(chalk.gray('   - destroy() - Delete resource'));
  }
}

function getBasicControllerTemplate(className: string): string {
  return `import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class ${className} extends Controller {
  async index(req: FlushRequest, res: FlushResponse) {
    return res.json({
      message: 'Hello from ${className}!'
    });
  }
}
`;
}

function getResourceControllerTemplate(className: string): string {
  const resourceName = className.replace('Controller', '').toLowerCase();
  
  return `import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class ${className} extends Controller {
  // GET /${resourceName}
  async index(req: FlushRequest, res: FlushResponse) {
    // List all ${resourceName}s
    const ${resourceName}s = []; // TODO: Fetch from database
    
    return res.json(this.success(${resourceName}s));
  }

  // GET /${resourceName}/:id
  async show(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    
    // TODO: Find ${resourceName} by id
    const ${resourceName} = { id, name: 'Sample ${resourceName}' };
    
    if (!${resourceName}) {
      return res.status(404).json(this.error('${resourceName} not found', 404));
    }
    
    return res.json(this.success(${resourceName}));
  }

  // POST /${resourceName}
  async store(req: FlushRequest, res: FlushResponse) {
    const data = req.body;
    
    // TODO: Validate and create ${resourceName}
    const ${resourceName} = { id: Date.now(), ...data };
    
    return res.status(201).json(this.success(${resourceName}, '${resourceName} created successfully'));
  }

  // PUT /${resourceName}/:id
  async update(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    const data = req.body;
    
    // TODO: Find and update ${resourceName}
    const ${resourceName} = { id, ...data };
    
    return res.json(this.success(${resourceName}, '${resourceName} updated successfully'));
  }

  // DELETE /${resourceName}/:id
  async destroy(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    
    // TODO: Delete ${resourceName}
    
    return res.json(this.success(null, '${resourceName} deleted successfully'));
  }
}
`;
}