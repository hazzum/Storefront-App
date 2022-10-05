import express from 'express'
import { Order, Item, OrderStore } from '../../../models/orders'
import { verifyTokenChain } from '../../../utilities/auth'

const orders = express.Router()
const store = new OrderStore()

const getByID = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const order = await store.getByID(req.params.id as unknown as number)
    try {
      if (res.locals.verified_user_id != order.user_id) {
        throw new Error('Access denied, invalid user.')
      }
    } catch (err) {
      res.status(401).json((err as Error).message)
      return
    }
    res.status(200).send(order)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Create = async (req: express.Request, res: express.Response): Promise<void> => {
  const order: Order = {
    status: req.body.status,
    user_id: res.locals.verified_user_id
  }
  try {
    const newOrder = await store.create(order)
    res.status(200).send(newOrder)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { user_id } = await store.getByID(req.params.id as unknown as number)
    if (res.locals.verified_user_id != user_id) {
      throw new Error('Access denied, invalid user.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  const order: Order = {
    id: req.params.id as unknown as number,
    status: req.body.status
  }
  try {
    const updated = await store.update(order)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Remove = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { user_id } = await store.getByID(req.params.id as unknown as number)
    if (res.locals.verified_user_id != user_id) {
      throw new Error('Access denied, invalid user.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  try {
    const deleted = await store.delete(req.params.id as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const addItem = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { user_id, status } = await store.getByID(req.params.id as unknown as number)
    if (res.locals.verified_user_id != user_id) {
      throw new Error('Access denied, invalid user.')
    }
    if (status.toLowerCase() != 'closed') {
      throw new Error('Cannot add an item to a closed order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  const item: Item = {
    quantity: req.body.quantity,
    order_id: req.params.id as unknown as number,
    product_id: req.body.product_id
  }
  try {
    const newOrder = await store.addItem(item)
    res.status(200).send(newOrder)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const updateItem = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { user_id, status } = await store.getByID(req.params.id as unknown as number)
    if (res.locals.verified_user_id != user_id) {
      throw new Error('Access denied, invalid user.')
    }
    if (status.toLowerCase() != 'closed') {
      throw new Error('Cannot update an item in a closed order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  const item: Item = {
    id: req.params.ItemID as unknown as number,
    quantity: req.body.quantity
  }
  try {
    const updated = await store.updateQuantity(item)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const deleteItem = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { user_id, status } = await store.getByID(req.params.id as unknown as number)
    if (res.locals.verified_user_id != user_id) {
      throw new Error('Access denied, invalid user.')
    }
    if (status.toLowerCase() != 'closed') {
      throw new Error('Cannot delete an item from a closed order.')
    }
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  try {
    const deleted = await store.removeItem(req.params.ItemID as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

orders.get('/:id', verifyTokenChain, getByID)
orders.post('/', verifyTokenChain, Create)
orders.put('/:id', verifyTokenChain, Update)
orders.delete('/:id', verifyTokenChain, Remove)
orders.post('/:id/items', verifyTokenChain, addItem)
orders.put('/:id/items/:ItemID', verifyTokenChain, updateItem)
orders.delete('/:id/items/:ItemID', verifyTokenChain, deleteItem)

export default orders
