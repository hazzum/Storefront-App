import express from 'express'
import Joi from 'joi'
import { Order } from '../models/orders'
import { Item } from '../models/order_items'
import { Product } from '../models/products'
import { User } from '../models/users'

const uSchema: Joi.ObjectSchema = Joi.object({
    first_name: Joi.string().pattern(new RegExp('^[a-zA-Z -]{2,50}$')),
    last_name: Joi.string().pattern(new RegExp('^[a-zA-Z -]{2,50}$')),
    user_name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{3,30}$')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_@!?#&*^%$]{3,30}$'))
})

const pSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9! -]{2,60}$')),
    url: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    price: Joi.number()
})

const oSchema: Joi.ObjectSchema = Joi.object({
    status: Joi.any().valid('active', 'complete'),
    user_id: Joi.string().pattern(new RegExp('^[0-9]+$'))
})

const iSchema: Joi.ObjectSchema = Joi.object({
    quantity: Joi.number().integer(),
    order_id: Joi.string().pattern(new RegExp('^[0-9]+$')),
    product_id: Joi.string().pattern(new RegExp('^[0-9]+$'))
})

const validateID = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    //validate inputs
    const { error } = Joi.object({
        id: Joi.string().pattern(new RegExp('^[0-9]+$'))
    })
        .validate({ id: req.params.id })
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateCredentials = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const user = {
        user_name: req.body.user_name,
        password: req.body.password
    }
    const { error } = Joi.object({
        user_name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{3,30}$')),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_@!?#&*^%$]{3,30}$'))
    }).validate(user)
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateUser = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        password: req.body.password
    }
    const { error } = uSchema.validate(user)
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateProduct = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const product: Product = {
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        price: req.body.price
    }
    const { error } = pSchema.validate(product)
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateOrder = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const order: Order = {
        status: req.body.status,
        user_id: res.locals.verified_user_id
    }
    //validate inputs
    const { error } = oSchema.validate(order)
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateItem = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const item: Item = {
        quantity: req.body.quantity,
        order_id: req.params.id,
        product_id: req.body.product_id
    }
    //validate inputs
    const { error } = iSchema.validate(item)
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

const validateHabal = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    //validate inputs
    const { error } = iSchema.validate({ product_id: req.params.item, order_id: req.params.id })
    if (error) {
        res.status(400).send(error.message)
        return
    }
    next()
}

export { validateUser, validateProduct, validateOrder, validateItem, validateID, validateCredentials, validateHabal }