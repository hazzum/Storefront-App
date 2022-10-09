import express from 'express'
import Joi from 'joi'
import { Item, OrderStore } from '../../../models/orders'
import { CartQueries } from '../../../services/cart'

const iSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9]+$')),
  quantity: Joi.number().integer(),
  order_id: Joi.string().pattern(new RegExp('^[0-9]+$')),
  product_id: Joi.string().pattern(new RegExp('^[0-9]+$'))
})
const store = new OrderStore()
const cart = new CartQueries()

const verifyUser = (verified_id: string, user_id: string): void => {
  if (verified_id != user_id) {
    throw new Error('Access denied, wrong user.')
  }
}

const showAll = async (req: express.Request, res: express.Response): Promise<void> => {
  const orderID = req.params.id
  //validate inputs
  const { error } = iSchema.validate({ order_id: orderID })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(orderID)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const items = await cart.getItems(orderID)
    if (!items) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(items)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const addItem = async (req: express.Request, res: express.Response): Promise<void> => {
  const item: Item = {
    quantity: req.body.quantity,
    order_id: req.params.id,
    product_id: req.body.product_id
  }
  //validate inputs
  const { error } = iSchema.validate({ order_id: req.params.id, ...item })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
    if (order.status.toLowerCase() == 'complete') {
      throw new Error('Cannot add an item to a complete order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const newOrder = await store.addItem(item)
    res.status(200).send(newOrder)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const updateItem = async (req: express.Request, res: express.Response): Promise<void> => {
  const item: Item = {
    id: req.params.item,
    quantity: req.body.quantity
  }
  //validate inputs
  const { error } = iSchema.validate({ order_id: req.params.id, ...item })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
    if (order.status.toLowerCase() == 'complete') {
      throw new Error('Cannot update an item in a complete order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const updated = await store.updateQuantity(item)
    if (!updated) {
      res.status(404).json('No results found to be updated')
      return
    }
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const deleteItem = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = iSchema.validate({ id: req.params.item, order_id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
    if (order.status.toLowerCase() == 'complete') {
      throw new Error('Cannot delete an item from a complete order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const deleted = await store.removeItem(req.params.item)
    if (!deleted) {
      res.status(404).json('No results found to be deleted')
      return
    }
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { showAll, addItem, updateItem, deleteItem }
