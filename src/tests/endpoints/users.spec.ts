import supertest from 'supertest'
import { User } from '../../models/users'
import app from '../../index'

// create a request object
const request = supertest(app)

describe('Test users endpoints response', () => {
  let userID: string
  let userID2: string
  let authHeader: { Authorization: string }
  let authHeader2: { Authorization: string }
  const user: User = {
    first_name: 'Lulu',
    last_name: 'Addams',
    user_name: 'lulu',
    password: 'spicegirls'
  }
  const user2: User = {
    first_name: 'Lee',
    last_name: 'Ji-eun',
    user_name: 'lulucrush',
    password: 'spicegirls'
  }

  describe('Test /api/users endpoints response', () => {
    it('Sign_up endpoint #1', async () => {
      const response = await request.post('/api/users/sign_up').send(user)
      const { user_id, authToken } = response.body
      userID = user_id.toString()
      authHeader = { Authorization: `Bearer ${authToken}` }
      expect(response.status).toBe(200)
    })

    it('Sign_up endpoint #2', async () => {
      const response = await request.post('/api/users/sign_up').send(user2)
      const { user_id, authToken } = response.body
      userID2 = user_id.toString()
      authHeader2 = { Authorization: `Bearer ${authToken}` }
      expect(response.status).toBe(200)
    })

    it('Trying to sign up with the same user name gives a 500 error', async () => {
      const response = await request.post('/api/users/sign_up').send(user)
      expect(response.status).toBe(500)
    })

    it('Trying to sign up with forbidden data returns a 400 error', async () => {
      const response = await request.post('/api/users/sign_up').send({
        first_name: ';--Lulu',
        last_name: 'Addams',
        user_name: 'monke',
        password: 'spicegirls'
      })
      expect(response.status).toBe(400)
    })

    it('Sign_in endpoint #1', async () => {
      const response = await request
        .post('/api/users/sign_in')
        .send({ user_name: user.user_name, password: user.password })
      expect(response.status).toBe(200)
    })

    it('Sign_in endpoint #2', async () => {
      const response = await request
        .post('/api/users/sign_in')
        .send({ user_name: user2.user_name, password: user2.password })
      expect(response.status).toBe(200)
    })

    it('trying to sign in with wrong password gives 400 error code', async () => {
      const response = await request
        .post('/api/users/sign_in')
        .send({ user_name: user.user_name, password: 'singingbanana' })
      expect(response.status).toBe(400)
    })

    it('show all users', async () => {
      const response = await request.get('/api/users/').set(authHeader)
      expect(response.status).toBe(200)
    })

    it('sending a request with no auth token gives 401 error', async () => {
      const response = await request.get('/api/users/')
      expect(response.status).toBe(401)
    })

    it('show one user #1', async () => {
      const response = await request.get(`/api/users/${userID}`).set(authHeader)
      expect(response.status).toEqual(200)
    })

    it('show one user #2', async () => {
      const response = await request.get(`/api/users/${userID2}`).set(authHeader2)
      expect(response.status).toEqual(200)
    })

    it('trying to access with wrong auth token gives 401 error', async () => {
      const response = await request.get(`/api/users/${userID2}`).set(authHeader)
      expect(response.status).toEqual(401)
    })

    it('update user info #1', async () => {
      const newUser: User = {
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: 'mrbombastic'
      }
      const response = await request.put(`/api/users/${userID}`).set(authHeader).send(newUser)
      expect(response.status).toBe(200)
    })

    it('update user info #2', async () => {
      const newUser: User = {
        first_name: user2.first_name,
        last_name: user2.last_name,
        user_name: 'homelander'
      }
      const response = await request.put(`/api/users/${userID2}`).set(authHeader2).send(newUser)
      expect(response.status).toBe(200)
    })

    it('delete user', async () => {
      await request.delete(`/api/users/${userID}`).set(authHeader)
      const response = await request.get(`/api/users/${userID}`).set(authHeader)
      expect(response.status).toBe(404)
    })
  })

  describe('Test /api/users/orders endpoints response', () => {
    beforeAll(async () => {
      const response = await request.post('/api/users/sign_up').send(user)
      const { user_id, authToken } = response.body
      userID = user_id.toString()
      authHeader = { Authorization: `Bearer ${authToken}` }
      await request
        .post('/api/orders')
        .set(authHeader)
        .send({ status: 'active', user_id: userID.toString() })
      await request
        .post('/api/orders')
        .set(authHeader)
        .send({ status: 'complete', user_id: userID.toString() })
      await request
        .post('/api/orders')
        .set(authHeader)
        .send({ status: 'complete', user_id: userID.toString() })
    })
    it('get user active orders', async () => {
      const response = await request.get(`/api/users/${userID}/orders/active`).set(authHeader)
      expect(response.status).toEqual(200)
    })

    it('get user completed orders', async () => {
      const response = await request.get(`/api/users/${userID}/orders/completed`).set(authHeader)
      expect(response.status).toEqual(200)
    })

    it(`trying to access other users' information gives 401 error`, async () => {
      const response = await request.get(`/api/users/${userID}/orders/completed`).set(authHeader2)
      expect(response.status).toEqual(401)
    })

    it(`trying to get orders when no order is made returns 404 error`, async () => {
      const response = await request.get(`/api/users/${userID2}/orders/completed`).set(authHeader2)
      expect(response.status).toEqual(404)
    })
  })
})
