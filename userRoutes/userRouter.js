const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./user-model.js');
const db = require('../data/db-config');

const router = express.Router();

/*router.get('/', (req, res) => {
  res.send('<h1>Welcome to my user router</h1>');
});*/

router.get('/', (req, res) => {
  Users.find()
    .then(listedUsers => {
      res.status(200).json(listedUsers);
    })
    .catch(err => {
      res.status(500).json({
        message:
          'There has been a problem retrieving the users from the database',
        err
      });
    });
});

router.post('/register', (req, res) => {
  let user = req.body;

  // validate the user
  if (!user.username || !user.password) {
    res
      .status(401)
      .json({ message: 'Invalid Credentials: You shall not pass!' });
  }

  // hash the password
  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;
  Users.add(user)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(err => {
      res.status(500).json({
        message: 'There was a problem saving the user to the database'
      });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.status(401).json({ message: 'Invalid Credentials: Please Try Again' });
  } else {
    Users.findById({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res
            .status(200)
            .json({
              message: `You have successfully logged in ${user.username}!`
            })
            .catch(err => {
              res
                .status(500)
                .json({
                  message: 'There is a problem logging into the database',
                  err
                });
            });
        }
      });
  }
});

module.exports = router;
