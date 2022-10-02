import Client from '../database'
import bcrypt from 'bcrypt'

const salt = process.env.BCRYPT_PASSWORD as unknown as string
const rounds = process.env.SALT_ROUNDS as unknown as string

export type User = {
  id?: number
  first_name: string
  last_name: string
  user_name: string
  password: string
}

export class UserStore {
  async Sign_up(user: User): Promise<User> {
    try {
      const connect = await Client.connect()
      const sql = 'INSERT INTO users (first_name, last_name, user_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING *'
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
      const sql = 'SELECT password_digest FROM users WHERE user_name=($1)'
      const result = await connect.query(sql, [user_name])
      const user = result.rows[0]
      connect.release()
      if (result.rows.length) {
        if (bcrypt.compareSync(password + salt, user.password_digest)) {
          return user.password_digest
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
