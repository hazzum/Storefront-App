import { Product, ProductStore } from '../../models/products'
const store: ProductStore = new ProductStore()

const product1: Product = {
  name: 'King-sized Bed',
  price: 800
}

const product2: Product = {
  name: 'Coffee Table',
  price: 100
}

const product3: Product = {
  name: 'Kitchen Sink',
  price: 150
}

describe('Test Product model', () => {
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
    it('Create a new product 1', async () => {
      await expectAsync(store.create(product1)).toBeResolved()
    })

    it('Create a new product 2', async () => {
      await expectAsync(store.create(product2)).toBeResolved()
    })
  })

  describe('Product Table CRUD Operations', () => {
    it('index method should return a list of products', async () => {
      const result = await store.index()
      expect(result).toBeInstanceOf(Array<Product>)
    })

    it('create method should create a new product', async () => {
      const result = await store.create(product3)
      expect(result).toEqual({ id: 3 as unknown as string, ...product3 })
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID('1')
      expect(result).toEqual({ id: 1 as unknown as string, ...product1 })
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID('2')
      expect(result).toEqual({ id: 2 as unknown as string, ...product2 })
    })

    it('update method should update product info', async () => {
      const newProduct = {
        id: 3 as unknown as string,
        name: 'Lamp',
        price: 50
      }
      const result = await store.update(newProduct)
      expect(result).toEqual(newProduct)
    })

    it('delete method should remove the product', async () => {
      await store.delete('1')
      const result = await store.getByID('1')
      expect(result).toEqual(undefined as unknown as Product)
    })
  })
})
