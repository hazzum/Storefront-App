import { Order, OrderStore } from '../../models/orders'
import { Item, ItemStore } from '../../models/order_items'
import { UserStore } from '../../models/users'
import { ProductStore } from '../../models/products'
import { DashboardQueries } from '../../services/dashboard'
import { CartQueries } from '../../services/cart'
const cart: CartQueries = new CartQueries()
const dashboard: DashboardQueries = new DashboardQueries()
const store: OrderStore = new OrderStore()
const itemStore: ItemStore = new ItemStore()

describe('Test Order model', () => {
  let userID: string
  let orderID1: string
  let orderID2: string
  let order1: Order
  let order2: Order
  let prodId: string
  let prodId2: string
  let orderId: string
  beforeAll(async () => {
    const userStore: UserStore = new UserStore()
    const { id } = await userStore.Sign_up({
      first_name: 'Lauran',
      last_name: 'Wexler',
      user_name: 'mama',
      password: 'password_@@'
    })
    userID = id as string
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
      orderID1 = result.id as string
      expect(result).toEqual({ id: orderID1 as string, ...order1 })
    })

    it('Create a new order 2', async () => {
      const result = await store.create(order2)
      orderID2 = result.id as string
      expect(result).toEqual({ id: orderID2 as string, ...order2 })
    })
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Show orders methods', () => {
    it('index method should return a list of completed orders by user with id 1', async () => {
      const result: Array<Order> = await store.index(userID)
      expect(result[0].status).toEqual('complete')
    })

    it('showCurrent method should return active orders by user with id 1', async () => {
      const result: Array<Order> = await store.showCurrent(userID)
      expect(result[0].status).toEqual('active')
    })

    it('show one method should return the correct order', async () => {
      const result: Order = await store.getByID(orderID1)
      expect(result.id).toEqual(orderID1)
    })

    it('show one method should return the correct order', async () => {
      const result: Order = await store.getByID(orderID2)
      expect(result.id).toEqual(orderID2)
    })
  })
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  describe('Update and delete methods', () => {
    it('update method should update order status', async () => {
      const newOrder: Order = {
        id: orderID2,
        status: 'active'
      }
      const result: Order = await store.update(newOrder)
      expect(result.status).toEqual(newOrder.status)
    })

    it('delete method should remove the order', async () => {
      await store.delete(orderID1)
      const result: Order = await store.getByID(orderID1)
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
          url: '',
          description: 'You can chew on it!',
          price: 10
        })
        prodId = id as string
      }
      {
        const { id } = await productStore.create({
          name: 'Milkshake',
          url: '',
          description: 'Mmmmm, delicious!',
          price: 30
        })
        prodId2 = id as string
      }
      {
        const { id } = await store.create({
          status: 'active',
          user_id: userID
        })
        orderId = id as string
      }
    })
    let itemId: string
    it('adding a new item to order 1', async () => {
      const newItem: Item = {
        quantity: 5,
        order_id: orderId,
        product_id: prodId
      }
      const result = await itemStore.addItem(newItem)
      itemId = result.id as string
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
      const result = await itemStore.addItem(newItem)
      itemId = result.id as string
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
      const result = await itemStore.updateQuantity(newItem)
      expect(result.quantity).toEqual(newItem.quantity)
    })

    it('remove the previous item', async () => {
      const result = await itemStore.removeItem(itemId)
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
        await expectAsync(cart.getItems(orderId)).toBeResolved()
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
        await expectAsync(dashboard.mostRecent(userID)).toBeResolved()
      })
    })
  })
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
})
