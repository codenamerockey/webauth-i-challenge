const db = require('../data/db-config.js');

module.exports = {
  find,
  findBy,
  add
};

function find() {
  return db('users').select('id', 'username', 'password');
}

function findById(id) {
  //Expects a scheme id as its only parameter
  return db('users') //Resolve to a single scheme object.
    .where({ id }) // looks to match the column id in the table
    .first(); // first id that it matches return that single object not an array with that object inside of the array.
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findBy(filter) {
  return db('users').where(filter);
}
