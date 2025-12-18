import chalk from 'chalk';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export function makeModel(name: string, options: { migration?: boolean }) {
  const { migration } = options;
  
  // Ensure models directory exists
  const modelsDir = 'src/models';
  if (!existsSync(modelsDir)) {
    mkdirSync(modelsDir, { recursive: true });
  }
  
  const className = name.charAt(0).toUpperCase() + name.slice(1);
  const fileName = `${className}.ts`;
  const filePath = path.join(modelsDir, fileName);
  
  if (existsSync(filePath)) {
    console.error(chalk.red(`❌ Model ${className} already exists!`));
    return;
  }
  
  const template = getModelTemplate(className);
  
  writeFileSync(filePath, template);
  
  console.log(chalk.green(`✅ Model created: ${filePath}`));
  
  if (migration) {
    // TODO: Create migration file
    console.log(chalk.blue('📝 Migration will be created...'));
  }
}

function getModelTemplate(className: string): string {
  const tableName = className.toLowerCase() + 's';
  
  return `import { Model } from 'flush-core';

export class ${className} extends Model {
  static tableName = '${tableName}';
  
  // Define your model properties here
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Example: Find all records
  static async all(): Promise<${className}[]> {
    // TODO: Implement database query
    return [];
  }
  
  // Example: Find by ID
  static async find(id: number): Promise<${className} | null> {
    // TODO: Implement database query
    return null;
  }
  
  // Example: Create new record
  static async create(data: Partial<${className}>): Promise<${className}> {
    // TODO: Implement database insert
    return new ${className}();
  }
  
  // Example: Update record
  async update(data: Partial<${className}>): Promise<${className}> {
    // TODO: Implement database update
    return this;
  }
  
  // Example: Delete record
  async delete(): Promise<boolean> {
    // TODO: Implement database delete
    return true;
  }
}
`;
}