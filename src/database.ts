import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB_TEST } =
  process.env

const client: Pool = new Pool({
  host: POSTGRES_HOST,
  database:
    process.env.ENV == 'dev' ? POSTGRES_DB : process.env.ENV == 'test' ? POSTGRES_DB_TEST : '',
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
})

export default client
