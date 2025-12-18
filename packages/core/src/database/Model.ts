export abstract class Model {
  static tableName: string;
  protected static query(sql: string, params?: any[]): Promise<any> {
    console.log('Executing query:', sql, params);
    return Promise.resolve([]);
  }
  

  static async all<T extends Model>(this: new () => T): Promise<T[]> {
    const tableName = (this as any).tableName;
    const sql = `SELECT * FROM ${tableName}`;
    const results = await (this as any).query(sql);
    return results.map((row: any) => Object.assign(new this(), row));
  }
  

  static async find<T extends Model>(this: new () => T, id: number): Promise<T | null> {
    const tableName = (this as any).tableName;
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const results = await (this as any).query(sql, [id]);
    
    if (results.length === 0) return null;
    return Object.assign(new this(), results[0]);
  }
  

  static async create<T extends Model>(this: new () => T, data: Partial<T>): Promise<T> {
    const tableName = (this as any).tableName;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    await (this as any).query(sql, values);
    
    return Object.assign(new this(), data);
  }
  

  async update(data: Partial<this>): Promise<this> {
    const tableName = (this.constructor as any).tableName;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    await (this.constructor as any).query(sql, [...values, (this as any).id]);
    
    Object.assign(this, data);
    return this;
  }
  

  async delete(): Promise<boolean> {
    const tableName = (this.constructor as any).tableName;
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    await (this.constructor as any).query(sql, [(this as any).id]);
    return true;
  }
  

  static where<T extends Model>(this: new () => T, column: string, value: any): Promise<T[]> {
    const tableName = (this as any).tableName;
    const sql = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
    return (this as any).query(sql, [value]);
  }
}