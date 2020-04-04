import express from 'express';
import {authHandler} from '../../middleware/middleware'
import knex from '../../db/index'
import { v4 as uuidv4 } from 'uuid'

const app = express.Router();

app.post('/new', authHandler, async (req, res ,next) => {
  try {
    const {
      number,
      pet,
      breed
    } = req.body;

    const serial = await knex('serials').insert({
      uuid: uuidv4(),
      serialNumber: number,
      petName: pet,
      breed,
      user_id: res.locals.userId
    }).returning('*')

    res.send(serial[0])
  } catch (error) {
    next(error)
  }
})

app.get('/', authHandler, async (req,res,next) => {
  try {
    const serials = await knex.select(knex.ref('uuid').as('UserId')).from('users').where({
      uuid: res.locals.userId
    }).then(rows => {
      return knex('serials').where({
        user_id: rows[0].UserId
      })
    });

    res.send(serials)
  } catch (error) {
    next(error)
  }
})

app.get('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;

    const serial = await knex('serials').where({
      serialNumber: id
    })

    const vaccines = await knex('vaccines').where({
      serial_id: serial[0].uuid
    })


    res.send({
      serial: serial[0],
      vaccines
    })
  } catch (error) {
    next(error);
  }
})

app.delete('/:id', authHandler, async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    
    await knex('serials').where({
      uuid: id
    }).del();

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})
module.exports = app;