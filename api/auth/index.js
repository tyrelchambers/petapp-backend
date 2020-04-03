import express from 'express'
import knex from '../../db/index'
import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {fields} from '../../lib/profile'

const app = express.Router();

app.post('/register', async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if ( !email || !password ) throw new Error("No email or password provided");

    const hashPassword = bcrypt.hashSync(password, 10);
    const existingUser = await knex('users').where({email});

    if (existingUser.length > 0) throw new Error("User already exists");

    const user = await knex('users').insert({
      uuid: uuidv4(),
      email,
      password: hashPassword
    }).returning([...fields])

    const token = jwt.sign({uuid: user[0].uuid, email: user[0].email}, config.development.secret);
    
    res.status(200).send({
      token,
      user: user[0]
    })

  } catch (error) {
    next(error)
  }
})

app.get('/login', async (req, res, next) => {
  try {
    const {
      password,
      email
    } = req.query;

    let user = await knex('users').where({
      email
    });

    if (!user[0]) throw new Error("User does not exist")
    
    const hashPassword = await bcrypt.compareSync(password, user[0].password);
    if ( !hashPassword ) throw new Error("Incorrect password");

    user = await knex('users').where({
      email
    }).select([...fields])

    const token = jwt.sign({uuid: user[0].uuid, email: user[0].email}, config.development.secret, {
      expiresIn: "1d"
    });
    
    res.send({
      token,
      user: user[0]
    });
  }

  catch(err) { 
    next(err)
  }
});

module.exports = app;