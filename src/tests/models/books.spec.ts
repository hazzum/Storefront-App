import { Book, BookStore } from '../../models/books'

const store: BookStore = new BookStore()

describe('Test books model CRUD operations', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a getByID method', () => {
    expect(store.getByID).toBeDefined()
  })

  it('should have an update method', () => {
    expect(store.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined()
  })

  it('index method should return a list of books', async () => {
    const result = await store.index()
    expect(result).toBeInstanceOf(Array<Book>)
  })

  it('create method should add a book', async () => {
    const result = await store.create({
      title: 'Bridge to Terabithia',
      author: 'Katherine Paterson',
      total_pages: 208,
      type: 'children',
      summary: 'A good book'
    })
    expect(result).toEqual({
      id: 1,
      title: 'Bridge to Terabithia',
      author: 'Katherine Paterson',
      total_pages: 208,
      type: 'children',
      summary: 'A good book'
    })
  })

  it('create method should add a book', async () => {
    const result = await store.create({
      title: 'To Kill A Mockingbird',
      author: 'Harper Lee',
      total_pages: 280,
      type: 'Novel',
      summary: 'Set in the small Southern town of Maycomb, Alabama, during the Depression'
    })
    expect(result).toEqual({
      id: 2,
      title: 'To Kill A Mockingbird',
      author: 'Harper Lee',
      total_pages: 280,
      type: 'Novel',
      summary: 'Set in the small Southern town of Maycomb, Alabama, during the Depression'
    })
  })

  it('getByID method should return the correct book', async () => {
    const result = await store.getByID(1)
    expect(result).toEqual({
      id: 1,
      title: 'Bridge to Terabithia',
      author: 'Katherine Paterson',
      total_pages: 208,
      type: 'children',
      summary: 'A good book'
    })
  })

  it('delete method should remove the book', async () => {
    store.delete(1);
    const result = await store.getByID(1)
    expect(result).toEqual(undefined as unknown as Book);
  });
})
