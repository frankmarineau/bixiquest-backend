
exports.up = (knex, Promise) =>
  knex.schema
    .createTable('journeys', (t) => {
      t.bigIncrements('id').primary()
      t.string('name')
      t.string('author')
      t.decimal('distance')
      t.integer('duration')
      t.bigInteger('bixi_station_id').references('id').inTable('bixi_stations')
      t.timestamps()
    })
    .createTable('journey_steps', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('journey_id').references('id').inTable('journeys')
      t.bigInteger('bixi_station_id').references('id').inTable('bixi_stations')
    })
    .createTable('journey_step_places', (t) => {
      t.bigIncrements('id').primary()
      t.string('place_id')
      t.string('name')
      t.string('image_url')
      t.string('type')
      t.string('description')
      t.specificType('pos', 'geometry(point, 0)')
    })

exports.down = (knex, Promise) =>
  knex.schema
    .dropTable('journey_step_places')
    .dropTable('journey_steps')
    .dropTable('journeys')
