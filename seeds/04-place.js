const fetch = require('node-fetch')
const maps = require('../lib/maps')

exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex)
  // Deletes ALL existing entries
  return knex('journey_step_places').del()
    .then(() => Promise.all([
      maps.place({ placeid: 'ChIJO3XLCfYayUwRg35RT57oQq4' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 1,
          description: 'Best beer in town!',
          place: JSON.stringify(place.json.result)
        })
      ),
      maps.place({ placeid: 'ChIJAUCQ8a8byUwRPbs0Rks0E6s' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 2,
          description: 'Great puzzles',
          place: JSON.stringify(place.json.result)
        })
      )
    ]))
};
