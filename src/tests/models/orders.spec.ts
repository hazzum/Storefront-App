import { Item, Order, OrderStore } from '../../models/orders'
import { UserStore } from '../../models/users'
import { ProductStore } from '../../models/products'
import { DashboardQueries } from '../../services/dashboard'
import { CartQueries } from '../../services/cart'
const cart: CartQueries = new CartQueries()
const dashboard: DashboardQueries = new DashboardQueries()
const store: OrderStore = new OrderStore()

describe('Test Order model', () => {
  let userID: string | undefined
  let orderID1: string | undefined
  let orderID2: string | undefined
  let order1: Order
  let order2: Order
  let prodId: string | undefined
  let prodId2: string | undefined
  let orderId: string | undefined
  beforeAll(async () => {
    const userStore: UserStore = new UserStore()
    const { id } = await userStore.Sign_up({
      first_name: 'Lauran',
      last_name: 'Wexler',
      user_name: 'mama',
      password: 'password_@@'
    })
    userID = id
    order1 = {
      status: 'active',
      user_id: userID?.toString()
    }
    order2 = {
      status: 'complete',
      user_id: userID?.toString()
    }
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Function definitions', () => {
    it('should have an show all completed orders method', () => {
      expect(store.index).toBeDefined()
    })

    it('should have an show all active orders method', () => {
      expect(store.showCurrent).toBeDefined()
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
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Create Method', () => {
    it('Create a new order 1', async () => {
      const result = await store.create(order1)
      orderID1 = result.id
      expect(result).toEqual({ id: orderID1 as string, ...order1 })
    })

    it('Create a new order 2', async () => {
      const result = await store.create(order2)
      orderID2 = result.id
      expect(result).toEqual({ id: orderID2 as string, ...order2 })
    })
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Show orders methods', () => {
    it('index method should return a list of completed orders by user with id 1', async () => {
      const result: Array<Order> | undefined = await store.index(userID as string)
      expect(result[0].status).toEqual('complete')
    })

    it('showCurrent method should return active orders by user with id 1', async () => {
      const result: Array<Order> | undefined = await store.showCurrent(userID as string)
      expect(result[0].status).toEqual('active')
    })

    it('show one method should return the correct order', async () => {
      const result: Order | undefined = await store.getByID(orderID1 as string)
      expect(result.id).toEqual(orderID1)
    })

    it('show one method should return the correct order', async () => {
      const result: Order | undefined = await store.getByID(orderID2 as string)
      expect(result.id).toEqual(orderID2)
    })
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Update and delete methods', () => {
    it('update method should update order status', async () => {
      const newOrder: Order | undefined = {
        id: orderID2,
        status: 'active'
      }
      const result: Order | undefined = await store.update(newOrder)
      expect(result.status).toEqual(newOrder.status)
    })

    it('delete method should remove the order', async () => {
      await store.delete(orderID1 as string)
      const result: Order | undefined = await store.getByID(orderID1 as string)
      expect(result).toBeUndefined()
    })
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Adding, Removing, Updating Items in an Order', () => {
    beforeAll(async () => {
      const productStore: ProductStore = new ProductStore()
      {
        const { id } = await productStore.create({
          name: 'Gum',
          price: 10
        })
        prodId = id
      }
      {
        const { id } = await productStore.create({
          name: 'Milkshake',
          price: 30
        })
        prodId2 = id
      }
      {
        const { id } = await store.create({
          status: 'active',
          user_id: userID
        })
        orderId = id
      }
    })
    let itemId: string | undefined
    it('adding a new item to order 1', async () => {
      const newItem: Item = {
        quantity: 5,
        order_id: orderId,
        product_id: prodId
      }
      const result = await store.addItem(newItem)
      itemId = result.id
      expect({ product_id: result.product_id, quantity: result.quantity }).toEqual({
        product_id: newItem.product_id?.toString(),
        quantity: newItem.quantity
      })
    })

    it('adding a new item to order 1', async () => {
      const newItem: Item = {
        quantity: 20,
        order_id: orderId,
        product_id: prodId2
      }
      const result = await store.addItem(newItem)
      itemId = result.id
      expect({ product_id: result.product_id, quantity: result.quantity }).toEqual({
        product_id: newItem.product_id?.toString(),
        quantity: newItem.quantity
      })
    })

    it('update the previous item quantity', async () => {
      const newItem: Item = {
        id: itemId,
        quantity: 10
      }
      const result = await store.updateQuantity(newItem)
      expect(result.quantity).toEqual(newItem.quantity)
    })

    it('remove the previous item', async () => {
      const result = await store.removeItem(itemId as string)
      expect(result.id).toEqual(itemId)
    })
  })
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('Test cart queries', () => {
    describe('Function definitions', () => {
      it('should have a get all items method', () => {
        expect(cart.getItems).toBeDefined()
      })
    })

    describe('Get all Order Items', () => {
      it('should return all Items in a given order', async () => {
        await expectAsync(cart.getItems(orderId as string)).toBeResolved()
      })
    })
  })

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  describe('Test dashboard queries', () => {
    describe('Function definitions', () => {
      it('should have a most expensive products method', () => {
        expect(dashboard.mostExpensive).toBeDefined()
      })

      it('should have a most popular products method', () => {
        expect(dashboard.mostPopular).toBeDefined()
      })

      it('should have a most recent purchases method', () => {
        expect(dashboard.mostRecent).toBeDefined()
      })
    })

    describe('Most expensive products', () => {
      it('should return 5 most expensive products by price in descending order', async () => {
        await expectAsync(dashboard.mostExpensive()).toBeResolved()
      })
    })

    describe('Most popular products', () => {
      it('should return 5 most sold products by number of sold units in descending order', async () => {
        await expectAsync(dashboard.mostPopular()).toBeResolved()
      })
    })

    describe('Most recent purchases', () => {
      it('should return 5 most recent purchases by a certain user', async () => {
        await expectAsync(dashboard.mostRecent(userID as string)).toBeResolved()
      })
    })
  })
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
})
