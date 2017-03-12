exports.up = (knex, Promise) =>
  knex.schema.createTable('murals', (t) => {
    t.bigInteger('id').primary()
    t.string('artist')
    t.string('address')
    t.string('image_url')
    t.string('organisation')
    t.specificType('pos', 'geometry(point, 0)')
  })

exports.down = (knex, Promise) =>
  knex.schema
    .dropTable('murals')
