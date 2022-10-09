import supertest from 'supertest'
import { User } from '../../models/users'
import { Product } from '../../models/products'
import { Order, Item } from '../../models/orders'
import app from '../../index'

// create a request object
const request = supertest(app)

describe('Test orders endpoints response', () => {
  let userID1: string
  let userID2: string
  let pID1: string
  let pID2: string
  let pID3: string
  let orderID1: string
  let orderID2: string
  let orderID3: string
  let orderID4: string
  let itemID3: string
  let itemID4: string
  let authHeader: { Authorization: string }
  let authHeader2: { Authorization: string }
  const user: User = {
    first_name: 'Monica',
    last_name: 'Bellucci',
    user_name: 'bellucci',
    password: 'spicegirls'
  }
  const user2: User = {
    first_name: 'Andrea',
    last_name: 'Bocelli',
    user_name: 'bocelli',
    password: 'spicegirls'
  }
  const product1: Product = {
    name: 'Cabinet',
    price: 400
  }
  const product2: Product = {
    name: 'Computer Desk',
    price: 300
  }
  const product3: Product = {
    name: 'Swivel Chair',
    price: 150
  }
  const order1: Order = {
    status: 'active'
  }
  const order2: Order = {
    status: 'complete'
  }
  const order3: Order = {
    status: 'active'
  }
  const order4: Order = {
    status: 'complete'
  }
  const item1: Item = {
    quantity: 3
  }
  const item2: Item = {
    quantity: 5
  }
  const item3: Item = {
    quantity: 5
  }
  const item4: Item = {
    quantity: 5
  }
  beforeAll(async () => {
    {
      const { user_id, authToken } = (await request.post('/api/users/sign_up').send(user)).body
      userID1 = user_id
      authHeader = { Authorization: `Bearer ${authToken}` }
    }
    {
      const { user_id, authToken } = (await request.post('/api/users/sign_up').send(user2)).body
      userID2 = user_id
      authHeader2 = { Authorization: `Bearer ${authToken}` }
    }
    const res1 = (await request.post('/api/products').set(authHeader).send(product1)).body
    pID1 = res1.id.toString()
    item1.product_id = pID1
    const res2 = (await request.post('/api/products').set(authHeader).send(product2)).body
    pID2 = res2.id.toString()
    item2.product_id = pID2
    item3.product_id = pID2
    const res3 = (await request.post('/api/products').set(authHeader).send(product3)).body
    pID3 = res3.id.toString()
    item4.product_id = pID3
  })
  describe('Test /api/orders endpoints response', () => {
    it('Create order that belongs to user 1 #1', async () => {
      const response = await request.post('/api/orders').set(authHeader).send(order1)
      const { id } = response.body
      orderID1 = id.toString()
      expect(response.status).toBe(200)
    })

    it('Create order that belongs to user 1 #2', async () => {
      const response = await request.post('/api/orders').set(authHeader).send(order2)
      const { id } = response.body
      orderID2 = id.toString()
      expect(response.status).toBe(200)
    })

    it('Create order that belongs to user 2 #1', async () => {
      const response = await request.post('/api/orders').set(authHeader2).send(order3)
      const { id } = response.body
      orderID3 = id.toString()
      expect(response.status).toBe(200)
    })

    it('Create order that belongs to user 2 #2', async () => {
      const response = await request.post('/api/orders').set(authHeader2).send(order4)
      const { id } = response.body
      orderID4 = id.toString()
      expect(response.status).toBe(200)
    })

    it('get order that belongs to user 1', async () => {
      const response = await request.get(`/api/orders/${orderID1}`).set(authHeader)
      expect(response.status).toBe(200)
    })

    it('get order that belongs to user 2', async () => {
      const response = await request.get(`/api/orders/${orderID3}`).set(authHeader2)
      expect(response.status).toBe(200)
    })

    it(`trying to access other users' orders returns 401 error`, async () => {
      const response = await request.get(`/api/orders/${orderID4}`).set(authHeader)
      expect(response.status).toBe(401)
    })

    it('update order status', async () => {
      const response = await request
        .put(`/api/orders/${orderID4}`)
        .set(authHeader2)
        .send({ status: 'active' })
      expect(response.status).toBe(200)
    })

    it('delete an order', async () => {
      await request.delete(`/api/orders/${orderID4}`).set(authHeader2)
      const response = await request.get(`/api/orders/${orderID4}`).set(authHeader2)
      expect(response.status).toBe(404)
    })
  })

  describe('Test /api/orders/:id/items endpoints response', () => {
    it('Add an Item to order 1 #1', async () => {
      const response = await request
        .post(`/api/orders/${orderID1}/items`)
        .set(authHeader)
        .send(item1)
      expect(response.status).toBe(200)
    })
    it('Trying to add a duplicate item returns a 500 error', async () => {
      const response = await request
        .post(`/api/orders/${orderID1}/items`)
        .set(authHeader)
        .send(item1)
      expect(response.status).toBe(500)
    })
    it('Add an Item to order 1 #2', async () => {
      const response = await request
        .post(`/api/orders/${orderID1}/items`)
        .set(authHeader)
        .send(item2)
      expect(response.status).toBe(200)
    })
    it('Trying to add an Item to order 2 (completed) returns a 400 error', async () => {
      const response = await request
        .post(`/api/orders/${orderID2}/items`)
        .set(authHeader)
        .send(item2)
      expect(response.status).toBe(400)
    })
    it('Add an Item to order 3 #1', async () => {
      const response = await request
        .post(`/api/orders/${orderID3}/items`)
        .set(authHeader2)
        .send(item3)
      const { id } = response.body
      itemID3 = id.toString()
      expect(response.status).toBe(200)
    })
    it('Add an Item to order 3 #2', async () => {
      const response = await request
        .post(`/api/orders/${orderID3}/items`)
        .set(authHeader2)
        .send(item4)
      const { id } = response.body
      itemID4 = id.toString()
      expect(response.status).toBe(200)
    })
    it('Show all items in order 1', async () => {
      const response = await request.get(`/api/orders/${orderID1}/items`).set(authHeader)
      expect(response.status).toBe(200)
    })
    it('Show all items in order 3', async () => {
      const response = await request.get(`/api/orders/${orderID3}/items`).set(authHeader2)
      expect(response.status).toBe(200)
    })
    it(`Trying to access other users' order items returns a 401 error`, async () => {
      const response = await request.get(`/api/orders/${orderID3}/items`).set(authHeader)
      expect(response.status).toBe(401)
    })
    it(`Trying to access an empty order's items returns a 404 error`, async () => {
      const response = await request.get(`/api/orders/${orderID2}/items`).set(authHeader)
      expect(response.status).toBe(404)
    })
    it('Update item 4 quantity', async () => {
      const response = await request
        .put(`/api/orders/${orderID3}/items/${itemID4}`)
        .set(authHeader2)
        .send({ quantity: 20 })
      expect(response.status).toBe(200)
    })
    it('Delete item 3', async () => {
      const response = await request
        .delete(`/api/orders/${orderID3}/items/${itemID3}`)
        .set(authHeader2)
      expect(response.status).toBe(200)
    })

    it('Get a detailed list of completed orders by user 1', async () => {
      const response = await request.get(`/api/users/${userID1}/orders/completed`).set(authHeader)
      expect(response.status).toBe(200)
    })

    it('Get a detailed list of active orders for user 2', async () => {
      const response = await request.get(`/api/users/${userID2}/orders/active`).set(authHeader2)
      expect(response.status).toBe(200)
    })
  })

  describe('Test /dashboard endpoints response', () => {
    it('/most_expensive endpoint returns a list of 5 most expensive products', async () => {
      const response = await request.get('/api/dashboard/most_expensive')
      expect(response.status).toBe(200)
    })

    it('/most_popular endpoint returns a list of 5 most popular products', async () => {
      const response = await request.get('/api/dashboard/most_popular')
      expect(response.status).toBe(200)
    })

    it('/most_recent endpoint returns a list of 5 most recent purchases made by the logged in user', async () => {
      const response = await request.get('/api/dashboard/most_recent').set(authHeader)
      expect(response.status).toBe(200)
    })
  })
})
