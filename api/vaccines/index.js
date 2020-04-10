import express from 'express';
import knex from '../../db/index'
import {authHandler} from '../../middleware/middleware'
import { v4 as uuidv4 } from 'uuid'

const app = express.Router();

app.post('/new', authHandler, async (req, res, next) => {
  try {
    const {
      serialId,
      vaccines
    } = req.body;

    const vaccinesToInsert = vaccines.map(x => 
      x.type ? ({uuid:uuidv4(), serial_id: serialId, type: x.type, administered: x.administered, expiry: x.expiry}) : null
    )

    await knex('vaccines').insert(vaccinesToInsert) 

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

app.put('/edit', authHandler, async (req, res, next) => {
  try {
    const {
      serialId,
      vaccines
    } = req.body;
    
    if (vaccines.length === 0) return res.sendStatus(200)

    vaccines.forEach(async x => {
      if ( x.uuid ) {
        await knex('vaccines').where({
          uuid: x.uuid
        }).update({
          type: x.type,
          administered: x.administered,
          expiry: x.expiry
        }) 
      } else {
        await knex('vaccines').insert({
          uuid: uuidv4(),
          type: x.type,
          administered: x.administered,
          expiry: x.expiry,
          serial_id: serialId

        })
      }
    })

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

app.delete('/:uuid', authHandler, async (req, res, next) => {
  try {
    const {
      uuid
    } = req.params;

    await knex('vaccines').where({
      uuid
    }).del();

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

module.exports = app;