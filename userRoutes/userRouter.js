const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./user-model.js');
const restricted = require('./restricted-middleware.js');

const router = express.Router();

/*router.get('/', (req, res) => {
  res.send('<h1>Welcome to my user router</h1>');
});*/

router.get('/', restricted, (req, res) => {
  console.log('username', req.session.username);
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
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        res
          .status(200)
          .json({ message: `${user.username} You have been logged in !` });
      } else {
        res
          .status(401)
          .json({ message: `Sorry please provide valid credentials` });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Not able to login to the database' });
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: `unable to log you out` });
      } else {
        res.status(200).json({
          message: 'You have successfully logged out'
        });
      }
    });
  } else {
    res
      .status(200)
      .json({
        message:
          "You have already been logged out now go....Be — don't try to become"
      });
  }
});
module.exports = router;
