import supertest from 'supertest'
import { User } from '../../models/users'
import { Product } from '../../models/products'
import app from '../../index'

// create a request object
const request = supertest(app)

describe('Test /api/products endpoints response', () => {
  let pID1: string
  let pID2: string
  let pID3: string
  let authHeader: { Authorization: string }
  const user: User = {
    first_name: 'Adam',
    last_name: 'Addams',
    user_name: 'aaaaa',
    password: 'spicegirls'
  }
  const product1: Product = {
    name: 'Cabinet',
    url: '',
    description: 'Place to store your stuff!',
    price: 400,
    stock:20
  }

  const product2: Product = {
    name: 'Computer Desk',
    url: '',
    description: 'Look no where for a desktop',
    price: 300,
    stock:35
  }

  const product3: Product = {
    name: 'Swivel Chair',
    url: '',
    description: 'Invented by Thomas Jefferson!',
    price: 150,
    stock:15
  }
  beforeAll(async () => {
    const { authToken } = (await request.post('/api/users/sign_up').send(user)).body
    authHeader = { Authorization: `Bearer ${authToken}` }
  })

  it('Create product endpoint #1', async () => {
    const response = await request.post('/api/products').set(authHeader).send(product1)    
    const { id } = response.body
    pID1 = id.toString()
    expect(response.status).toBe(200)
  })

  it('Create product endpoint #2', async () => {
    const response = await request.post('/api/products').set(authHeader).send(product2)
    const { id } = response.body
    pID2 = id.toString()
    expect(response.status).toBe(200)
  })

  it('Create product endpoint #3', async () => {
    const response = await request.post('/api/products').set(authHeader).send(product3)
    const { id } = response.body
    pID3 = id.toString()
    expect(response.status).toBe(200)
  })

  it('Trying to add a product with bad values returns a 400 error', async () => {
    const response = await request
      .post('/api/products')
      .set(authHeader)
      .send({ name: 'kite', price: '2a' })
    expect(response.status).toBe(400)
  })

  it('Get a list of all products', async () => {
    const response = await request.get('/api/products')
    expect(response.status).toBe(200)
  })

  it('Show a certain product', async () => {
    const response = await request.get(`/api/products/${pID2}`)
    expect(response.status).toBe(200)
  })

  it(`Updating a product's info`, async () => {
    const newProduct: Product = {
      name: 'Ergonomic Swivel Chair',
      url: '',
      description: 'Thank you, Thomas Jefferson!',
      price: 120,
      stock: 44
    }
    const response = await request.put(`/api/products/${pID3}`).set(authHeader).send(newProduct)
    expect(response.status).toBe(200)
  })

  it(`Trying to edit products data with no auth token returns a 401 error`, async () => {
    const response = await request.delete(`/api/products/${pID1}`)
    expect(response.status).toBe(401)
  })

  it(`Deleting a product`, async () => {
    await request.delete(`/api/products/${pID1}`).set(authHeader)
    const response = await request.get(`/api/products/${pID1}`).set(authHeader)
    expect(response.status).toBe(404)
  })
})
