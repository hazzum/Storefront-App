import express from 'express'
import Joi from 'joi'
import { Order, OrderStore } from '../../models/orders'
import { CartQueries, CartItem } from '../../services/cart'

const oSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9]+$')),
  status: Joi.any().valid('active', 'complete'),
  user_id: Joi.string().pattern(new RegExp('^[0-9]+$'))
})
const store: OrderStore = new OrderStore()
const cart: CartQueries = new CartQueries()

const verifyUser = (verified_id: string, user_id: string): void => {
  if (verified_id != user_id) {
    throw new Error('Access denied, wrong user.')
  }
}

//show a list of detailed completed orders made by the current user
const showAllCompleted = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = oSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const detailed_orders: Array<{
      order_id: string
      order_status: string
      order_details: CartItem[]
    }> = []
    const orders = await store.index(req.params.id)
    if (!orders.length) {
      res.status(404).json('No results found')
      return
    }
    for (const order of orders) {
      const response = await cart.getItems(order.id as string)
      detailed_orders.push({
        order_id: order.id as string,
        order_status: order.status,
        order_details: response
      })
    }
    res.status(200).send(detailed_orders)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

//show a list of detailed active orders that belong to the current user
const showAllActive = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = oSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const detailed_orders: Array<{
      order_id: string
      order_status: string
      order_details: CartItem[]
    }> = []
    const orders = await store.showCurrent(req.params.id)
    if (!orders) {
      res.status(404).json('No results found')
      return
    }
    for (const order of orders) {
      const response = await cart.getItems(order.id as string)
      detailed_orders.push({
        order_id: order.id as string,
        order_status: order.status,
        order_details: response
      })
    }
    res.status(200).send(detailed_orders)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showOne = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = oSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json('No results found')
      return
    }
    //validate user
    try {
      verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
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
  //validate inputs
  const { error } = oSchema.validate(order)
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //handle database operation
  try {
    const newOrder = await store.create(order)
    res.status(200).send(newOrder)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const update: Order = {
    id: req.params.id,
    status: req.body.status
  }
  //validate inputs
  const { error } = oSchema.validate(update)
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json('No results found to be updated')
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const updated = await store.update(update)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Delete = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = oSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  //validate user
  try {
    const order = await store.getByID(req.params.id)
    if (!order) {
      res.status(404).json('No results found to be deleted')
      return
    }
    verifyUser(res.locals.verified_user_id, order.user_id as unknown as string)
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
  //handle database operation
  try {
    const deleted = await store.delete(req.params.id)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { showAllCompleted, showAllActive, showOne, Create, Update, Delete }
