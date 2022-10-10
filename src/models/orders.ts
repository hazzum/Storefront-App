import Client from '../database'

export type Order = {
  id?: string
  status: string
  user_id?: string
}

export class OrderStore {
  //show all completed orders that belongs to the current logged in user
  async index(user_id: string): Promise<Order[]> {
    try {
      const connect = await Client.connect()
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='complete'"
      const result = await connect.query(sql, [user_id])
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get orders ${err}`)
    }
  }

  async showCurrent(user_id: string): Promise<Order[]> {
    try {
      const connect = await Client.connect()
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'"
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
}
