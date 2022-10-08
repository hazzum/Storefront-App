import express from 'express'
import jwt, { UserIDJwtPayload } from 'jsonwebtoken'
const secret = process.env.TOKEN_SECRET as unknown as string

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    id: string
  }
}

export const encodeAuthToken = (user_id: string, user_name: string): string => {
  return jwt.sign({ id: user_id, name: user_name }, secret, { expiresIn: '24h' })
}

const getAuthToken = (req: express.Request, res: express.Response, next: () => void): void => {
  try {
    const authHeader = req.headers.authorization as unknown as string
    if (!authHeader) {
      throw new Error('Authorization header is expected.')
    }
    const parts = authHeader.split(' ')
    if (parts[0].toLowerCase() != 'bearer') {
      throw new Error('Authorization header must start with "Bearer".')
    }
    res.locals.token = parts[1]
    next()
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
}

const verifyAuthToken = (_req: express.Request, res: express.Response, next: () => void): void => {
  try {
    const { id } = <UserIDJwtPayload>jwt.verify(res.locals.token, secret)
    res.locals.verified_user_id = id
    next()
  } catch (err) {
    res.status(401).json('Access denied, invalid token')
    return
  }
}

const verifyUser = (req: express.Request, res: express.Response, next: () => void): void => {
  try {
    if (res.locals.verified_user_id != (req.params.id as unknown as string)) {
      throw new Error('Access denied, wrong user.')
    }
    next()
  } catch (err) {
    res.status(401).json((err as Error).message)
    return
  }
}

export const verifyTokenChain = [getAuthToken, verifyAuthToken]
export const verifyUserChain = [getAuthToken, verifyAuthToken, verifyUser]
