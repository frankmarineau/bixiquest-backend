exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('murals').del(),
    knex('journey_step_places').del(),
    knex('journey_steps').del(),
    knex('bixi_stations').del(),
    knex('journeys').del()
  ])
}
