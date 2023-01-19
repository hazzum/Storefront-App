import express from 'express'
import { User, UserStore } from '../../models/users'
import { encodeAuthToken } from '../../utilities/auth'

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
    const token = encodeAuthToken(newUser.id as unknown as string, newUser.user_name)
    res.status(200).send({ user_id: newUser.id as unknown as string, authToken: token })
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Sign_in = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await store.Authenticate(req.body.user_name, req.body.password)
    if (result) {
      const token = encodeAuthToken(result.id as unknown as string, result.user_name)
      res.status(200).send({ user_id: result.id as unknown as string, authToken: token })
    } else {
      res.status(400).send('user name or password is wrong')
    }
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showAll = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const users = await store.index()
    if (!users.length) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(users)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showOne = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const user = await store.getByID(req.params.id)
    if (!user) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(user)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const user: User = {
    id: req.params.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
  }
  req.body.password = "121"
  try {
    const updated = await store.update(user)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Delete = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const deleted = await store.destroy(req.params.id)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { Sign_up, Sign_in, showAll, showOne, Update, Delete }
