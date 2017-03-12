const fetch = require('node-fetch')

exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex)
  // Deletes ALL existing entries
  return knex('murals').del()
    .then(() => fetch('http://donnees.ville.montreal.qc.ca/dataset/53d2e586-6e7f-4eae-89a1-2cfa7fc29fa0/resource/d325352b-1c06-4c3a-bf5e-1e4c98e0636b/download/murales.json'))
    .then(res => res.json())
    .then(res => Promise.all(
      res.features.map(e =>
                       knex('murals').insert({
                         id: e.properties.id,
                         artist: e.properties.artiste,
                         address: e.properties.adresse,
                         image_url: e.properties.image,
                         organisation: e.properties.organisation,
                         pos: st.makePoint(e.properties.longitude, e.properties.latitude)
                       })
                      )))
};
