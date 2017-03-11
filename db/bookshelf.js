import knex from './knex'
const bookshelf = require('bookshelf')(knex)

bookshelf.plugin(['visibility', 'pagination', 'bookshelf-camelcase'])

export default bookshelf
