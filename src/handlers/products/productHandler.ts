import express from 'express'
import Joi from 'joi'
import { Product, ProductStore } from '../../models/products'

const pSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9]+$')),
  name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9! -]{2,60}$')),
  price: Joi.number()
})
const store = new ProductStore()

const showAll = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const products = await store.index()
    if (!products) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showOne = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = pSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const product = await store.getByID(req.params.id)
    if (!product) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(product)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Create = async (req: express.Request, res: express.Response): Promise<void> => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price
  }
  //validate inputs
  const { error } = pSchema.validate(product)
  console.log(error)
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const newProduct = await store.create(product)
    res.status(200).send(newProduct)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const product: Product = {
    id: req.params.id,
    name: req.body.name,
    price: req.body.price
  }
  //validate inputs
  const { error } = pSchema.validate(product)
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const updated = await store.update(product)
    if (!updated) {
      res.status(404).json('No results found to be updated')
      return
    }
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Delete = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = pSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const deleted = await store.delete(req.params.id)
    if (!deleted) {
      res.status(404).json('No results found to be deleted')
      return
    }
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { showAll, showOne, Create, Update, Delete }
