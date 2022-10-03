import express from 'express'
import { User, UserStore } from '../../../models/users'
import { verifyUserChain, encodeAuthToken } from '../../../utilities/auth'

const users = express.Router()
const store = new UserStore()

const Sign_up = async (req: express.Request, res: express.Response): Promise<void> => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    password: req.body.password
  }
  try {
    const newUser = await store.Sign_up(user)
    let token = encodeAuthToken(newUser.id as unknown as number, newUser.user_name)
    res.status(200).send({ user_id: newUser.id, authToken: token })
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Authenticate = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await store.Authenticate(req.body.user_name, req.body.password)
    if (result) {
      let token = encodeAuthToken(result.id as unknown as number, result.user_name)
      res.status(200).send({ user_id: result.id, authToken: token })
    } else {
      res.status(400).send('Error 400: user name or password is wrong')
    }
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const user: User = {
    id: req.params.id as unknown as number,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name
  }
  try {
    const updated = await store.update(user)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Destroy = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const deleted = await store.destroy(req.params.id as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

users.post('/', Sign_up)
users.post('/authenticate', Authenticate)
users.put('/:id', verifyUserChain, Update)
users.delete('/:id', verifyUserChain, Destroy)

export default users
