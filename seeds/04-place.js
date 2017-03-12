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
      ),
      maps.place({ placeid: 'ChIJnYQwYRMZyUwRgXnYONiYEFw' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 3,
          description: 'Incredible market. You should buy an ice cream at "Havre aux Glaces".',
          place: JSON.stringify(place.json.result)
        })
      ),
      maps.place({ placeid: 'ChIJ57_mPn4ZyUwRrTzWcGWXR9I' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 4,
          description: 'Those are literally the best bagels in the world. You need to stop here and grab one.',
          place: JSON.stringify(place.json.result)
        })
      ),
      maps.place({ placeid: 'ChIJPXGXWFcayUwRqpYNHZ_v_B8' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 5,
          description: 'A perfect place to find peace.',
          place: JSON.stringify(place.json.result)
        })
      ),
      maps.place({ placeid: 'ChIJy4EMO1gayUwR9Edi1pVv934' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 5,
          description: "An innovative way to discover Montreal's history.",
          place: JSON.stringify(place.json.result)
        })
      ),
      maps.place({ placeid: 'ChIJW6GqEl8ayUwRg5mIsKxweuU' }).asPromise().then((place) =>
        knex('journey_step_places').insert({
          journey_step_id: 6,
          description: 'Unanimously the best Italian restaurant.',
          place: JSON.stringify(place.json.result)
        })
      ),
    ]))
};
