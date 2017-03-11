exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex)
  // Deletes ALL existing entries
  return knex('journey_steps').del()
    .then(() => Promise.all([
      knex('journey_steps').insert({
        id: 0,
        journey_id: 0,
        bixi_station_id: 63
      }),
      knex('journey_steps').insert({
        id: 1,
        journey_id: 0,
        bixi_station_id: 49
      }),
      knex('journey_steps').insert({
        id: 2,
        journey_id: 0,
        bixi_station_id: 25
      }),
    ]))
};
