#!/usr/bin/env node

const _ = require('lodash');

const args = process.argv.slice(2);
const commands = ['create', 'drop', 'recreate'];

if (args.length != 1 || !commands.includes(args[0])) {
  console.log('Tool for managing postgres database. Do not use in production!');
  console.log('');
  console.log('  Usage: db.js {' + commands.join('|') + ');');
  console.log('');
  process.exit(1);
}

const command = args[0];

const knexConfig = _.cloneDeep(require('../config').db);

// When we run postgres under specific user,
// database matching user name is always created

const database = knexConfig.connection.database;
knexConfig.connection.database = knexConfig.connection.user;
const knex = require('knex')(knexConfig);

var promise = null;

if (command === 'drop') {
  promise = dropDatabase();
} else if (command === 'create') {
  promise = createDatabase();
} else if (command === 'recreate') {
  promise = dropDatabase().then(() => createDatabase());
} else {
  throw new Error('Unknown command ' + command);
}

promise.then(() => {
  return knex.destroy();
}).catch((err) => {
  console.log(err);
  process.exit(1);
});

function createDatabase() {
  return databaseExists().then((dbExists) => {
    if (dbExists) {
      console.log('Database ' + database + ' already exists');
    } else {
      return knex.raw('CREATE DATABASE ??', [database]).then(() => {
        console.log('Database ' + database + ' created');
      });
    }
  });
}

function dropDatabase() {
  return databaseExists().then((dbExists) => {
    if (dbExists) {
      return knex.raw('DROP DATABASE ??', [database]).then(() => {
        console.log('Database ' + database + ' dropped');
      });
    } else {
      console.log('Database ' + database + ' does not exist');
    }
  });
}

function databaseExists() {
  return knex.count('*')
  .from('pg_database')
  .where({datname: database})
  .then((rows) => {
    return rows[0].count > 0;
  });
}
