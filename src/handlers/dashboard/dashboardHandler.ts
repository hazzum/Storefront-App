import express from 'express'
import { DashboardQueries } from '../../services/dashboard'

const dashboard = new DashboardQueries()

const mostExpensive = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await dashboard.mostExpensive()
    if (!products.length) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const mostPopular = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await dashboard.mostPopular()
    if (!products.length) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const mostRecent = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await dashboard.mostRecent(res.locals.verified_user_id)
    if (!products.length) {
      res.status(404).json('No results found')
      return
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

export default { mostExpensive, mostPopular, mostRecent }
