import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import dashboardHandler from '../../../handlers/dashboard/dashboardHandler'

const dashboardRouter = express.Router()

dashboardRouter.get('/most_expensive', verifyTokenChain, dashboardHandler.mostExpensive)
dashboardRouter.get('/most_popular', verifyTokenChain, dashboardHandler.mostPopular)
dashboardRouter.get('/most_recent', verifyTokenChain, dashboardHandler.mostRecent)

export default dashboardRouter
