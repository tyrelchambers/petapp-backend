import express from 'express';
import bodyParser from 'body-parser';
require('dotenv').config();

import cors from 'cors';
import helmet from 'helmet';
import expressSanitizer from 'express-sanitizer'
import auth from './api/auth/index'
import profile from './api/profile/index'
import serials from './api/serials/index'
import vaccines from './api/vaccines/index'
import contacts from './api/contacts/index'

const app = express();

app.use(helmet())

const port = process.env.PORT || '3001';
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());
app.use(cors());

app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/serials', serials);
app.use('/api/vaccines', vaccines);
app.use('/api/contacts', contacts)

app.use(function (err, req, res, next) {
  console.error(err.message)
  res.status(500).send(err.message)
})

app.listen(port, () => console.log("App running on " + port));