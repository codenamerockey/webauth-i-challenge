const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./user-model.js');
const db = require('../data/db-config');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h1>Welcome to my user router</h1>');
});

router.post('/register', (req, res) => {
  let user = req.body;

  // validate the user

  // hash the password
  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;
  Users.add(user)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message: 'There was a problem saving the user to the database'
        });
    });
});

module.exports = router;
