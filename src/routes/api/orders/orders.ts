import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import orderHandler from '../../../handlers/orders/orderHandler'
import items from './items/item'
import { validateID, validateOrder } from '../../../utilities/validation'

const orders = express.Router()
orders.get('/:id', validateID, verifyTokenChain, orderHandler.showOne)
orders.post('/', validateOrder, verifyTokenChain, orderHandler.Create)
orders.put('/:id', validateID, verifyTokenChain, orderHandler.Update)
orders.delete('/:id', validateID, verifyTokenChain, orderHandler.Delete)
orders.use('/', items)

export default orders
