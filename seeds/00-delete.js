const knexCleaner = require('knex-cleaner');

exports.seed = (knex) => knexCleaner.clean(knex, {mode: 'truncate'})
