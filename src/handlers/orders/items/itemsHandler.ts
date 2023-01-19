import express from 'express'
import Joi from 'joi'
import { OrderStore } from '../../../models/orders'
import { Item, ItemStore } from '../../../models/order_items'
import { CartQueries } from '../../../services/cart'

const store = new OrderStore()
const itemStore = new ItemStore()
const cart = new CartQueries()

const verifyUser = (verified_id: string, user_id: string): void => {
  if (verified_id != user_id) {
    throw new Error('Access denied, wrong user.')
  }
}

const showAll = async (req: express.Request, res: express.Response): Promise<void> => {
  const orderID = req.params.id
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
    if (!items.length) {
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
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
    if (order.status.toLowerCase() == 'complete') {
      res.status(400).json('Cannot add an item to a complete order.')
      return
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const newItem = await itemStore.addItem(item)
    res.status(200).send(newItem)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const updateItem = async (req: express.Request, res: express.Response): Promise<void> => {
  const item: Item = {
    id: req.params.item,
    quantity: req.body.quantity
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
      res.status(400).json('Cannot update an item in a complete order.')
      return
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const updated = await itemStore.updateQuantity(item)
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
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json("Order doesn't exsit")
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
    if (order.status.toLowerCase() == 'complete') {
      res.status(400).json('Cannot delete an item from a complete order.')
      return
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const deleted = await itemStore.removeItem(req.params.item)
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
