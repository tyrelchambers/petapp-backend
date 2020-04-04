import express from 'express'
import knex from '../../db/index'
import {authHandler} from '../../middleware/middleware'
import { v4 as uuidv4 } from 'uuid'

const app = express.Router();

app.post('/new', authHandler, async (req ,res, next) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber
    } = req.body;

    const contact = await knex('contacts').insert({
      uuid: uuidv4(),
      firstName,
      lastName,
      phoneNumber,
      user_id: res.locals.userId
    }).returning('*')

    res.send(contact[0])
  } catch (error) {
    next(error)
  }
})

app.delete('/:id', authHandler, async (req, res, next) => {
  try {
    const {
      id
    } = req.params;

    await knex('contacts').where({
      uuid: id
    }).del();

    res.sendStatus(200)

  } catch (error) {
    next(error)
  }
})

app.get('/', authHandler, async (req, res, next) => {
  try {
    const contacts = await knex('contacts').where({
      user_id: res.locals.userId
    })

    res.send(contacts)
  } catch (error) {
    next(error)
  }
})

module.exports = app;