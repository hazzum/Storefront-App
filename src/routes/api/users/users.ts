import express from 'express'
import userHandler from '../../../handlers/users/userHandler'
import { verifyUserChain, verifyTokenChain } from '../../../utilities/auth'

const users = express.Router()

users.post('/sign_up', userHandler.Sign_up)
users.post('/sign_in', userHandler.Sign_in)
users.get('/', verifyTokenChain, userHandler.showAll)
users.get('/:id', verifyUserChain, userHandler.showOne)
users.put('/:id', verifyUserChain, userHandler.Update)
users.delete('/:id', verifyUserChain, userHandler.Delete)

export default users
