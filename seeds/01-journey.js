exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('journeys').del()
    .then(() => Promise.all([
      knex('journeys').insert({
        id: 0,
        name: 'First journey',
        author: 'Jesse Emond',
        distance: '2500',
        duration: '1200'
      }),
    ]))
};
