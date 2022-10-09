import express from 'express'
import users from './api/users/users'
import userOrders from './api/users/userOrders'
import products from './api/products/products'
import orders from './api/orders/orders'
import dashboardRouter from './api/dashboard/dashboard'

const routes = express.Router()
routes.use('/users', users)
routes.use('/users', userOrders)
routes.use('/products', products)
routes.use('/orders', orders)
routes.use('/dashboard', dashboardRouter)
routes.get('/', (_req: express.Request, res: express.Response): void => {
  res.send('visiting the main api route')
})
export default routes
