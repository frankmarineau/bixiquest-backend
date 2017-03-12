exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('journeys').del()
    .then(() => Promise.all([
      knex('journeys').insert({
        id: 0,
        name: 'First quest',
        author: 'Jesse Emond',
        distance: '2500',
        duration: '1200'
      }),
      knex('journeys').insert({
        id: 1,
        name: 'Cultural journey',
        author: 'Frank',
        distance: '17019',
        duration: '2521'
      })
    ]))
}
