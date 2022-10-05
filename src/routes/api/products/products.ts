import express from 'express'
import { Product, ProductStore } from '../../../models/products'
import { verifyTokenChain } from '../../../utilities/auth'

const products = express.Router()
const store = new ProductStore()

const Index = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const products = await store.index()
    res.status(200).send(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const getByID = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const product = await store.getByID(req.params.id as unknown as number)
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
  try {
    const newProduct = await store.create(product)
    res.status(200).send(newProduct)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const product: Product = {
    id: req.params.id as unknown as number,
    name: req.body.name,
    price: req.body.price
  }
  try {
    const updated = await store.update(product)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Remove = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const deleted = await store.delete(req.params.id as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

products.get('/', Index)
products.get('/:id', getByID)
products.post('/', verifyTokenChain, Create)
products.put('/:id', verifyTokenChain, Update)
products.delete('/:id', verifyTokenChain, Remove)

export default products
