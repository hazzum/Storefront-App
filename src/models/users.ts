import Client from '../database'
import bcrypt from 'bcrypt'

const salt = process.env.BCRYPT_PASSWORD as unknown as string
const rounds = process.env.SALT_ROUNDS as unknown as string

export type User = {
  id?: string
  first_name: string
  last_name: string
  user_name: string
  password?: string
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM users'
      const result = await connect.query(sql)
      connect.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get users ${err}`)
    }
  }

  async getByID(id: string): Promise<User> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot retrieve user ${err}`)
    }
  }

  async update(user: User): Promise<User> {
    try {
      const connect = await Client.connect()
      const sql =
        'UPDATE users SET first_name=$2, last_name=$3, user_name=$4 WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [...Object.values(user)])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot update user ${err}`)
    }
  }

  async destroy(id: string): Promise<User> {
    try {
      const connect = await Client.connect()
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
      const result = await connect.query(sql, [id])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot delete user ${err}`)
    }
  }

  async Sign_up(user: User): Promise<User> {
    try {
      const connect = await Client.connect()
      const sql =
        'INSERT INTO users (first_name, last_name, user_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING *'
      const password_digest = bcrypt.hashSync(user.password + salt, parseInt(rounds))
      const result = await connect.query(sql, [
        user.first_name,
        user.last_name,
        user.user_name,
        password_digest
      ])
      connect.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Cannot create a new user ${err}`)
    }
  }

  async Authenticate(user_name: string, password: string): Promise<User | null> {
    try {
      const connect = await Client.connect()
      const sql = 'SELECT id, user_name, password_digest FROM users WHERE user_name=($1)'
      const result = await connect.query(sql, [user_name])
      const user = result.rows[0]
      connect.release()
      if (result.rows.length) {
        if (bcrypt.compareSync(password + salt, user.password_digest)) {
          return user
        } else {
          return null
        }
      } else {
        return null
      }
    } catch (err) {
      throw new Error(`Cannot authenticate user ${err}`)
    }
  }
}
