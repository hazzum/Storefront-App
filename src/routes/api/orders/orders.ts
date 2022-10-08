import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import orderHandler from '../../../handlers/orders/orderHandler'
import items from './items/item'

const orders = express.Router()
orders.get('/', verifyTokenChain, orderHandler.showAll)
orders.get('/:id', verifyTokenChain, orderHandler.showOne)
orders.post('/', verifyTokenChain, orderHandler.Create)
orders.put('/:id', verifyTokenChain, orderHandler.Update)
orders.delete('/:id', verifyTokenChain, orderHandler.Delete)
orders.use('/', items)

export default orders
