const db = require('../data/db-config.js');

module.exports = {
  find,
  findById,
  add
};

function find() {
  //Calling find returns a promise that resolves to an array of all schemes in the database
  return db('users');
}

function findById(id) {
  //Expects a scheme id as its only parameter
  return db('users') //Resolve to a single scheme object.
    .where({ id }) // looks to match the column id in the table
    .first(); // first id that it matches return that single object not an array with that object inside of the array.
}

function add(user) {
  return db('users').insert(user, 'id');
}
