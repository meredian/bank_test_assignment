module.exports = {
  db: {
    client: 'postgresql',
    connection: {
      database: 'nice-bank-app-test',
      user:     'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/../db/migrations'
    },
    seeds: {
      directory: __dirname + '/../db/seeds'
    }
  }
};
