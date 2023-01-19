import Client from '../database'

export type Product = {
  id?: string
  name: string
  url?: string
  description?: string
  price: number
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM products'
      const result = await connect.query(sql)
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get products ${err}`)
    }
  }

  async getByID(id: string): Promise<Product> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot retrieve Product ${err}`)
    }
  }

  async create(Product: Product): Promise<Product> {
    try {
      const connect = await Client.connect()
      const sql = 'INSERT INTO products (name, url, description, price) VALUES ($1, $2, $3, $4) RETURNING *'
      const result = await connect.query(sql, [...Object.values(Product)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot create Product ${err}`)
    }
  }

  async update(Product: Product): Promise<Product> {
    try {
      const connect = await Client.connect()
      const sql = 'UPDATE products SET name=$2, url=$3, description=$4, price=$5 WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [...Object.values(Product)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot update Product ${err}`)
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const connect = await Client.connect()
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot delete Product ${err}`)
    }
  }
}
