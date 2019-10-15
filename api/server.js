const express = require('express');
const helmet = require('helmet');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions); //<<<<for storing sessions in the db

const userRouter = require('../userRoutes/userRouter');
const knexConfig = require('../data/db-config');

const server = express();

const sessionConfig = {
  name: 'Osho', // default would be "sid"
  secret: 'If you love a flower, don’t pick it up.', // use an environment variable for this
  cookie: {
    httpOnly: true, // JS cannot access the cookies
    maxAge: 1000 * 60 * 60, // expiration time in milliseconds
    secure: false // use cookie over HTTPS only. Should be true in production
  },
  resave: false,
  saveUninitialized: true, // read about GDPR compliance about cookies

  // change to use our database instead of memory to save the sessions
  store: new KnexSessionStore({
    knex: knexConfig,
    createtable: true, // automatically create the sessions table
    clearInterval: 1000 * 60 * 30 // delete expired sessions every 30
  })
};

// global middleware
server.use(sessions(sessionConfig));
server.use(express.json());
server.use(helmet());
server.use('/api/users', userRouter);

module.exports = server;
