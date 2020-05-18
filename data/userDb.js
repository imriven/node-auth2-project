const knex = require("knex");

const config = require("../knexfile.js");

const db = knex(config.development);

function add(user) {
   return db("users").insert(user)
}

function get() {
    return db("users")
}

function getById(id) {
    return db("users").where({id}).first()
}

function getByUsername(username) {
    return db("users").where({username}).first()
}




module.exports = {
  get,
  add,
  getById,
  getByUsername
};
