
exports.up = (knex, Promise) =>
  knex.schema.createTable('bixi_stations', (t) => {
    t.bigInteger('id').primary()
    t.string('num')
    t.string('name')
    t.specificType('pos', 'geometry(point, 0)')
  })

exports.down = (knex, Promise) =>
  knex.schema.dropTable('bixi_stations')
