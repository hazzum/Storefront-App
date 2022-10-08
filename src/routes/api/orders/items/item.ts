import express from 'express'
import { verifyTokenChain } from '../../../../utilities/auth'
import itemsHandler from '../../../../handlers/orders/items/itemsHandler'

const items = express.Router()

items.get('/:id/items/', verifyTokenChain, itemsHandler.showAll)
items.post('/:id/items/', verifyTokenChain, itemsHandler.addItem)
items.put('/:id/items/:item', verifyTokenChain, itemsHandler.updateItem)
items.delete('/:id/items/:item', verifyTokenChain, itemsHandler.deleteItem)

export default items
