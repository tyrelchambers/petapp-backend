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
      ({uuid:uuidv4(), serial_id: serialId, type: x.type, administered: x.administered, expiry: x.expiry})
    )

    await knex('vaccines').insert(vaccinesToInsert) 

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

module.exports = app;