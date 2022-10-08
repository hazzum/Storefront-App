import { Order, OrderStore } from '../../models/orders'
import { UserStore } from '../../models/users'
const store: OrderStore = new OrderStore()

const order1: Order = {
  status: 'open',
  user_id: '1'
}

const order2: Order = {
  status: 'open',
  user_id: '1'
}

describe('Test Order model', () => {
  beforeAll(async () => {
    const userStore: UserStore = new UserStore()
    await userStore.Sign_up({
      first_name: 'Lauran',
      last_name: 'Wexler',
      user_name: 'mama',
      password: 'password_@@'
    })
  })

  describe('Function definitions', () => {
    it('should have an show all method', () => {
      expect(store.index).toBeDefined()
    })

    it('should have a show one method', () => {
      expect(store.getByID).toBeDefined()
    })

    it('should have a create method', () => {
      expect(store.create).toBeDefined()
    })

    it('should have an update method', () => {
      expect(store.update).toBeDefined()
    })

    it('should have a delete method', () => {
      expect(store.delete).toBeDefined()
    })
  })

  describe('Create Method', () => {
    it('Create a new order 1', async () => {
      await expectAsync(store.create(order1)).toBeResolved()
    })
  })

  describe('Order Table CRUD Operations', () => {
    it('index method should return a list of orders by user with id 1', async () => {
      const result = await store.index('1')
      expect(result).toBeInstanceOf(Array<Order>)
    })

    it('create method should create a new product', async () => {
      const result = await store.create(order2)
      expect(result).toEqual({ id: 2 as unknown as string, ...order2 })
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID('1')
      expect(result).toEqual({ id: 1 as unknown as string, ...order1 })
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID('2')
      expect(result).toEqual({ id: 2 as unknown as string, ...order2 })
    })

    it('update method should update product info', async () => {
      const newOrder = {
        id: 2 as unknown as string,
        status: 'closed',
      }
      const result = await store.update(newOrder)
      expect(result.status).toEqual(newOrder.status)
    })

    it('delete method should remove the product', async () => {
      await store.delete('1')
      const result = await store.getByID('1')
      expect(result).toEqual(undefined as unknown as Order)
    })
  })
})
