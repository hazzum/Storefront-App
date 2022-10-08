import Client from '../database'
import { Product } from '../models/products'

export class DashboardQueries {
  // Get all products that have been included in orders
  async itemsInOrders(): Promise<{ name: string; price: number; order_id: string }[]> {
    try {
      const conn = await Client.connect()
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_items ON products.id = order_items.product_id'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    }
  }

  // Get 5 most expensive products
  async mostExpensive(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products ORDER BY price DESC LIMIT 5'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable get products: ${err}`)
    }
  }

  // Get 5 most popular products
  async mostPopular(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = `
        SELECT    products.id id, name, price, SUM(quantity) units_sold
        FROM      products INNER JOIN order_items
        ON        products.id = order_items.product_id
        GROUP BY  products.id
        ORDER BY  units_sold DESC LIMIT 5`
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable get products: ${err}`)
    }
  }

  // Get 5 most recent purchases
  async mostRecent(user_id: number): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = `
        SELECT    products.id id, name, price, quantity
        FROM      products INNER JOIN order_items
        ON        products.id = order_items.product_id INNER JOIN orders
        ON        order_items.order_id = orders.id
        AND       orders.user_id = ($1)
        ORDER BY  order_items.id DESC LIMIT 5`
      const result = await conn.query(sql, [user_id])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable get products: ${err}`)
    }
  }
}
