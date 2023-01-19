import express from 'express'
import orderHandler from '../../../handlers/orders/orderHandler'
import { verifyUserChain } from '../../../utilities/auth'
import { validateID } from '../../../utilities/validation'

const userOrders = express.Router()

userOrders.get('/:id/orders/completed', validateID, verifyUserChain, orderHandler.showAllCompleted)
userOrders.get('/:id/orders/active', validateID, verifyUserChain, orderHandler.showAllActive)

export default userOrders
