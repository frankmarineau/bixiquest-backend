import knex from './knex'
const bookshelf = require('bookshelf')(knex)

bookshelf.plugin([
  'visibility',
  'pagination',
  'bookshelf-camelcase',
  'bookshelf-postgis'
])

knex.on('query', function (query) {
  var params = query.bindings.slice();
  var q = query.sql.replace(/\?/g, function () {
    return '\'' + params.shift() + '\'';
  });
  console.log(new Date().toISOString(), '\n', q, '\n');
});

export default bookshelf
