const knexConfig = require('../config').db;

module.exports = require('knex')(knexConfig);
