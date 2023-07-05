const db = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
});

module.exports = db;