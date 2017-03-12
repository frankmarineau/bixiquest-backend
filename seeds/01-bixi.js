const fetch = require('node-fetch')

exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex)
  // Deletes ALL existing entries
  return knex('bixi_stations').del()
    .then(() => fetch('https://secure.bixi.com/data/stations.json'))
    .then(res => res.json())
    .then(res => Promise.all(res.stations.map(e =>
      knex('bixi_stations').insert({
        id: e.id,
        num: e.n,
        name: e.s,
        pos: st.geomFromText(`POINT(${e.lo} ${e.la})`, 4326)
      })
    )))
};
