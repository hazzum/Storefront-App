import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import routes from './routes/index'

const PORT = 3000
const corsOptions = {
  cors: true,
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}
// create an instance server
const app: express.Application = express()
//Middlewares
//Security middleware
app.use(helmet())
//CORS middleware
app.use(cors(corsOptions))
//Json bodyparser
app.use(bodyParser.json())
//Logger middleware
app.use(morgan('short'))
//Top-level Routes
app.use('/api', routes)
// add routing for / path
app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    message: 'Welcome to my Storefront App 🌍'
  })
})

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port:${PORT}`)
})

export default app
