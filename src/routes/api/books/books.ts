import express from 'express'
import { Book, BookStore } from '../../../models/books'
import { verifyTokenChain } from '../../../utilities/auth'

const books = express.Router()
const store = new BookStore()

const Index = async (_req: express.Request, res: express.Response): Promise<void> => {
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

const Create = async (req: express.Request, res: express.Response): Promise<void> => {
  const book: Book = {
    title: req.body.title,
    author: req.body.author,
    total_pages: req.body.total_pages,
    type: req.body.type,
    summary: req.body.summary
  }
  try {
    const newBook = await store.create(book)
    res.status(200).send(newBook)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Update = async (req: express.Request, res: express.Response): Promise<void> => {
  const book: Book = {
    id: req.params.id as unknown as number,
    title: req.body.title,
    author: req.body.author,
    total_pages: req.body.total_pages,
    type: req.body.type,
    summary: req.body.summary
  }
  try {
    const updated = await store.update(book)
    res.status(200).send(updated)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

const Remove = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const deleted = await store.delete(req.params.id as unknown as number)
    res.status(200).send(deleted)
  } catch (err) {
    res.status(500).json((err as Error).message)
  }
}

books.get('/', Index)
books.get('/:id', getByID)
books.post('/', verifyTokenChain, Create)
books.put('/:id', verifyTokenChain, Update)
books.delete('/:id', verifyTokenChain, Remove)

export default books
