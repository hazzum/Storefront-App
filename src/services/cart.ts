import Client from '../database'

export class CartQueries {
  //get all items that belongs to a single order
  async getItems(order_id: string): Promise<
    {
      item_id: string
      product_id: string
      name: string
      price: number
      quantity: number
    }[]
  > {
    try {
      const connect = await Client.connect()
      const sql = `
      SELECT  order_items.id item_id, products.id product_id , name, price, quantity
      FROM    products INNER JOIN order_items 
      ON      order_items.product_id = products.id 
      AND     order_items.order_id = ($1)`
      const result = await connect.query(sql, [order_id])
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get items ${err}`)
    }
  }
}
