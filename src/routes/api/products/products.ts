import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import productHandler from '../../../handlers/products/productHandler'
import { validateID, validateProduct } from '../../../utilities/validation'

const products = express.Router()

products.get('/', productHandler.showAll)
products.get('/:id', validateID, productHandler.showOne)
products.post('/', validateProduct ,verifyTokenChain, productHandler.Create)
products.put('/:id', validateID, validateProduct, verifyTokenChain, productHandler.Update)
products.delete('/:id', validateID, verifyTokenChain, productHandler.Delete)

export default products
