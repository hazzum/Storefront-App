import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import productHandler from '../../../handlers/products/productHandler'

const products = express.Router()

products.get('/', verifyTokenChain, productHandler.showAll)
products.get('/:id', verifyTokenChain, productHandler.showOne)
products.post('/', verifyTokenChain, productHandler.Create)
products.put('/:id', verifyTokenChain, productHandler.Update)
products.delete('/:id', verifyTokenChain, productHandler.Delete)

export default products
