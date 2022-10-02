import express from 'express'
import { User, UserStore } from '../../../models/users'
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
    res.status(200).send(newUser)
  } catch (err) {
    res.status(400).json(err)
  }
}

const Authenticate = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await store.Authenticate(req.body.user_name, req.body.password)
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(400).send('Error 400: user name or password is wrong')
    }
  } catch (err) {
    res.status(400).json(err)
  }
}

users.post('/', Sign_up)
users.post('/authenticate', Authenticate)

export default users
