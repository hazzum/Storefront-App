import { Product, ProductStore } from '../../models/products'
const store: ProductStore = new ProductStore()

describe('Test Product model', () => {
  let pID1: string
  let pID2: string
  let pID3: string
  const product1: Product = {
    name: 'King-sized Bed',
    url: '',
    description: 'For kangs!',
    price: 800
  }

  const product2: Product = {
    name: 'Coffee Table',
    url: '',
    description: 'Best table money could buy!',
    price: 100
  }

  const product3: Product = {
    name: 'Kitchen Sink',
    url: '',
    description: '5-year warranty!',
    price: 150
  }
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
      const result = await store.create(product1)
      pID1 = result.id as string
      expect(result).toEqual({ id: pID1, ...product1 })
    })

    it('Create a new product 2', async () => {
      const result = await store.create(product2)
      pID2 = result.id as string
      expect(result).toEqual({ id: pID2, ...product2 })
    })
  })

  describe('Product Table CRUD Operations', () => {
    it('index method should return a list of products', async () => {
      const result = await store.index()
      expect(result).toBeInstanceOf(Array<Product>)
    })

    it('create method should create a new product', async () => {
      const result = await store.create(product3)
      pID3 = result.id as string
      expect(result).toEqual({ id: pID3, ...product3 })
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID(pID1)
      expect(result.id).toEqual(pID1)
    })

    it('show one method should return the correct product', async () => {
      const result = await store.getByID(pID2)
      expect(result.id).toEqual(pID2)
    })

    it('update method should update product info', async () => {
      const newProduct = {
        id: pID2,
        name: 'Lamp',
        url: '',
        description: 'Recommended by all moths!',
        price: 50
      }
      const result = await store.update(newProduct)
      expect(result).toEqual(newProduct)
    })

    it('delete method should remove the product', async () => {
      await store.delete(pID1)
      const result = await store.getByID(pID1)
      expect(result).toBeUndefined()
    })
  })
})
