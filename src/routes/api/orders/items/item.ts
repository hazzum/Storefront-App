import express from 'express'
import { verifyTokenChain } from '../../../../utilities/auth'
import itemsHandler from '../../../../handlers/orders/items/itemsHandler'
import { validateHabal, validateID, validateItem } from '../../../../utilities/validation'

const items = express.Router()

items.get('/:id/items/', validateID, verifyTokenChain, itemsHandler.showAll)
items.post('/:id/items/', validateItem, verifyTokenChain, itemsHandler.addItem)
items.put('/:id/items/:item', validateHabal, verifyTokenChain, itemsHandler.updateItem)
items.delete('/:id/items/:item', validateHabal, verifyTokenChain, itemsHandler.deleteItem)

export default items
