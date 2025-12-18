export abstract class Migration {
  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
  
  protected async execute(sql: string): Promise<void> {
    console.log('Executing migration SQL:', sql);
  }
  

  protected createTable(tableName: string, callback: (table: TableBuilder) => void): Promise<void> {
    const table = new TableBuilder(tableName);
    callback(table);
    return this.execute(table.toSQL());
  }
  
  protected dropTable(tableName: string): Promise<void> {
    return this.execute(`DROP TABLE IF EXISTS ${tableName}`);
  }
  
  protected addColumn(tableName: string, columnName: string, type: string): Promise<void> {
    return this.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${type}`);
  }
  
  protected dropColumn(tableName: string, columnName: string): Promise<void> {
    return this.execute(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  }
}

class TableBuilder {
  private columns: string[] = [];
  
  constructor(private tableName: string) {}
  
  id(): this {
    this.columns.push('id INTEGER PRIMARY KEY AUTOINCREMENT');
    return this;
  }
  
  string(name: string, length = 255): this {
    this.columns.push(`${name} VARCHAR(${length})`);
    return this;
  }
  
  text(name: string): this {
    this.columns.push(`${name} TEXT`);
    return this;
  }
  
  integer(name: string): this {
    this.columns.push(`${name} INTEGER`);
    return this;
  }
  
  boolean(name: string): this {
    this.columns.push(`${name} BOOLEAN DEFAULT FALSE`);
    return this;
  }
  
  timestamp(name: string): this {
    this.columns.push(`${name} TIMESTAMP`);
    return this;
  }
  
  timestamps(): this {
    this.columns.push('created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    this.columns.push('updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    return this;
  }
  
  toSQL(): string {
    return `CREATE TABLE ${this.tableName} (${this.columns.join(', ')})`;
  }
}