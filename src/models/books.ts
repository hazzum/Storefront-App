import Client from '../database'

export type Book = {
  id?: number
  title: string
  author: string
  total_pages: number
  type: string
  summary: string
}

export class BookStore {
  async index(): Promise<Book[]> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM books'
      const result = await connect.query(sql)
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get books ${err}`)
    }
  }

  async getByID(id: number): Promise<Book> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM books WHERE id=($1)'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot retrieve book ${err}`)
    }
  }

  async create(book: Book): Promise<Book> {
    try {
      const connect = await Client.connect()
      const sql =
        'INSERT INTO books (title, author, total_pages, type, summary) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      const result = await connect.query(sql, [...Object.values(book)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot create book ${err}`)
    }
  }

  async update(book: Book): Promise<Book> {
    try {
      const connect = await Client.connect()
      const sql =
        'UPDATE books SET title=$2, author=$3, total_pages=$4, type=$5, summary=$6 WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [...Object.values(book)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot update book ${err}`)
    }
  }

  async delete(id: number): Promise<Book> {
    try {
      const connect = await Client.connect()
      const sql = 'DELETE FROM books WHERE id=($1)'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot delete book ${err}`)
    }
  }
}
