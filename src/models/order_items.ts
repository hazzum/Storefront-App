import Client from '../database'

export type Item = {
  id?: string
  quantity: number
  order_id?: string
  product_id?: string
}

export class ItemStore {
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
