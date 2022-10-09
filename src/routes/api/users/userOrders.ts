import express from 'express'
import orderHandler from '../../../handlers/orders/orderHandler'
import { verifyUserChain } from '../../../utilities/auth'

const userOrders = express.Router()

userOrders.get('/:id/orders/completed', verifyUserChain, orderHandler.showAllCompleted)
userOrders.get('/:id/orders/active', verifyUserChain, orderHandler.showAllActive)

export default userOrders
