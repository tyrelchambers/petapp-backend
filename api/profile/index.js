import express from 'express'
import knex from '../../db/index'
import {authHandler} from '../../middleware/middleware'
import {fields} from '../../lib/profile'

const app = express.Router();

app.get('/me', authHandler, async (req, res, next) => {
  try {
    const profile = await knex("users").where({
      uuid: res.locals.userId
    }).select([...fields]);

    res.send(profile[0])
  } catch (error) {
    next(error)
  }
})

app.post('/me', authHandler, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber
    } = req.body;

    const profile = await knex('users').where({
      uuid: res.locals.userId
    }).update({
      firstName,
      lastName,
      phoneNumber
    }).returning([...fields])

    res.send(profile)
  } catch (error) {
    next(error);
  }
})

app.delete('/me', authHandler, async (req,res,next) => {
  try {
    await knex('users').where({
      uuid: res.locals.userId
    }).del();

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

module.exports = app;