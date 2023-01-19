import express from 'express'
import userHandler from '../../../handlers/users/userHandler'
import { verifyUserChain, verifyTokenChain } from '../../../utilities/auth'
import { validateCredentials, validateID, validateUser } from '../../../utilities/validation'

const users = express.Router()

users.post('/sign_up', validateUser, userHandler.Sign_up)
users.post('/sign_in', validateCredentials, userHandler.Sign_in)
users.get('/', verifyTokenChain, userHandler.showAll)
users.get('/:id', validateID, verifyUserChain, userHandler.showOne)
users.put('/:id', validateUser, validateID, verifyUserChain, userHandler.Update)
users.delete('/:id', validateID, verifyUserChain, userHandler.Delete)

export default users
