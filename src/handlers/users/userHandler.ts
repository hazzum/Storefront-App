import express from 'express'
import Joi from 'joi'
import { User, UserStore } from '../../models/users'
import { encodeAuthToken } from '../../utilities/auth'

const uSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9]+$')),
  first_name: Joi.string().pattern(new RegExp('^[a-zA-Z -]{2,50}$')),
  last_name: Joi.string().pattern(new RegExp('^[a-zA-Z -]{2,50}$')),
  user_name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{3,30}$')),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_@!?#&*^%$]{3,30}$'))
})
const store = new UserStore()

const Sign_up = async (req: express.Request, res: express.Response): Promise<void> => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    password: req.body.password
  }
  //validate inputs
  const { error } = uSchema.validate(user)
  if (error) {
    res.status(400).send(error.message)
    return
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
  //validate inputs
  const { error } = uSchema.validate({ user_name: req.body.user_name, password: req.body.password })
  if (error) {
    res.status(400).send(error.message)
    return
  }
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
    if (!users) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).send(users)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const showOne = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = uSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
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
    user_name: req.body.user_name
  }
  //validate inputs
  const { error } = uSchema.validate(user)
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const updated = await store.update(user)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Delete = async (req: express.Request, res: express.Response): Promise<void> => {
  //validate inputs
  const { error } = uSchema.validate({ id: req.params.id })
  if (error) {
    res.status(400).send(error.message)
    return
  }
  try {
    const deleted = await store.destroy(req.params.id)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { Sign_up, Sign_in, showAll, showOne, Update, Delete }
