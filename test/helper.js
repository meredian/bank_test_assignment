process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
require('mocha-subject').infect();

exports.server = require('../app.js');
const knex = exports.knex = require('../db/knex.js');

beforeEach(() => {
  return knex.migrate.rollback()
  .then(() => knex.migrate.latest())
  .then(() => knex.seed.run());
});

afterEach(() => {
  return knex.migrate.rollback();
});
