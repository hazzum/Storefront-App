import express from 'express'
import { Product, ProductStore } from '../../models/products'

const store = new ProductStore()

const showAll = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const products = await store.index()
    if (!products.length) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showOne = async (req: express.Request, res: express.Response): Promise<void> => {
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
    url: req.body.url,
    description: req.body.description,
    price: req.body.price
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
    url: req.body.url,
    description: req.body.description,
    price: req.body.price
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
