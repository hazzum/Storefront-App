import Client from '../database'

export type Order = {
  id?: string
  status: string
  user_id?: string
}

export type Item = {
  id?: string
  quantity: number
  order_id?: string
  product_id?: string
}

export class OrderStore {
  //show all orders that belongs to the current logged in user
  async index(user_id: string): Promise<Order[]> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id=($1)'
      const result = await connect.query(sql, [user_id])
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get orders ${err}`)
    }
  }

  async getByID(id: string): Promise<Order> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot retrieve order ${err}`)
    }
  }

  async create(Order: Order): Promise<Order> {
    try {
      const connect = await Client.connect()
      const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *'
      const result = await connect.query(sql, [...Object.values(Order)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot create order ${err}`)
    }
  }

  async update(Order: Order): Promise<Order> {
    try {
      const connect = await Client.connect()
      const sql = 'UPDATE orders SET status=$2 WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [...Object.values(Order)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot update order ${err}`)
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const connect = await Client.connect()
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot delete order ${err}`)
    }
  }

  async addItem(item: Item): Promise<Item> {
    try {
      const connect = await Client.connect()
      const sql =
        'INSERT INTO order_items (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *'
      const result = await connect.query(sql, [...Object.values(item)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot add item ${err}`)
    }
  }

  async removeItem(id: string): Promise<Item> {
    try {
      const connect = await Client.connect()
      const sql = 'DELETE FROM order_items WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot remove item ${err}`)
    }
  }

  async updateQuantity(item: Item): Promise<Item> {
    try {
      const connect = await Client.connect()
      const sql = 'UPDATE order_items SET quantity=($2) WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [...Object.values(item)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot update quantity ${err}`)
    }
  }
}
