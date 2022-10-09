import express from 'express'
import { verifyTokenChain } from '../../../utilities/auth'
import dashboardHandler from '../../../handlers/dashboard/dashboardHandler'

const dashboardRouter = express.Router()

dashboardRouter.get('/most_expensive', dashboardHandler.mostExpensive)
dashboardRouter.get('/most_popular', dashboardHandler.mostPopular)
dashboardRouter.get('/most_recent', verifyTokenChain, dashboardHandler.mostRecent)

export default dashboardRouter
