exports.up = (knex, Promise) =>
  knex.schema
    .createTable('journeys', (t) => {
      t.bigIncrements('id').primary()
      t.string('name')
      t.string('author')
      t.integer('distance')
      t.integer('duration')
      t.timestamps()
    })
    .createTable('journey_steps', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('journey_id').references('id').inTable('journeys')
      t.bigInteger('bixi_station_id').references('id').inTable('bixi_stations')
    })
    .createTable('journey_step_places', (t) => {
      t.bigIncrements('id').primary()
      t.bigInteger('journey_step_id').references('id').inTable('journey_steps')
      t.string('place_id')
      t.string('name')
      t.string('image_url')
      t.string('type')
      t.string('description')
      t.specificType('pos', 'geometry(point, 4326)')
    })

exports.down = (knex, Promise) =>
  knex.schema
    .dropTable('journey_step_places')
    .dropTable('journey_steps')
    .dropTable('journeys')
