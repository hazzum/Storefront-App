import express from 'express'
import users from './api/users/users'
import products from './api/products/products'
import orders from './api/orders/orders'

const routes = express.Router()
routes.use('/users', users)
routes.use('/products', products)
routes.use('/orders', orders)
routes.get('/', (_req: express.Request, res: express.Response): void => {
  res.send('visiting the main api route')
})
export default routes
