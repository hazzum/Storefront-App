import express from 'express'
import books from './api/books/books'
import users from './api/users/users'

const routes = express.Router()
routes.use('/books', books)
routes.use('/users', users)
routes.get('/', (_req: express.Request, res: express.Response): void => {
  res.send('visiting the main api route')
})
export default routes
