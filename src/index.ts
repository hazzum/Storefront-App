import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const PORT = 3000
// create an instance server
const app: express.Application = express()
app.use(bodyParser.json())
// HTTP request logger middleware
app.use(morgan('short'))

// add routing for / path
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Hello World 🌍'
  })
})

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at prot:${PORT}`)
})

export default app
