import express from 'express'
import { Book, BookStore } from '../../../models/books'
const books = express.Router()

const store = new BookStore()

const index = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const books = await store.index()
    res.status(200).send(books)
  } catch (err) {
    res.status(400).json(err)
  }
}

const getByID = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const book = await store.getByID(req.params.id as unknown as number)
    res.status(200).send(book)
  } catch (err) {
    res.status(400).json(err)
  }
}

const create = async (req: express.Request, res: express.Response): Promise<void> => {
  const book: Book = {
    title: req.body.title,
    author: req.body.author,
    total_pages: req.body.total_pages,
    type: req.body.type,
    summary: req.body.type
  }
  try {
    const newBook = await store.create(book)
    res.status(200).send(newBook)
  } catch (err) {
    res.status(400).json(err)
  }
}

const update = async (req: express.Request, res: express.Response): Promise<void> => {
  const book: Book = {
    id: req.params.id as unknown as number,
    title: req.body.title,
    author: req.body.author,
    total_pages: req.body.total_pages,
    type: req.body.type,
    summary: req.body.type
  }
  try {
    const updated = await store.update(book)
    res.status(200).send(updated)
  } catch (err) {
    res.status(400).json(err)
  }
}

const remove = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const deleted = await store.delete(req.params.id as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(400).json(err)
  }
}

books.get('/', index)
books.get('/:id', getByID)
books.post('/', create)
books.put('/:id', update)
books.delete('/:id', remove)

export default books
