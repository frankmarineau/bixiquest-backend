const fetch = require('node-fetch')

exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex)
  // Deletes ALL existing entries
  return knex('journey_step_places').del()
    .then(() => Promise.all([
      knex('journey_step_places').insert({
        journey_step_id: 1,
        place_id: 1337,
        name: 'Bistro-Brasserie Les Soeurs Grises',
        image_url: 'https://lh3.googleusercontent.com/proxy/tsWydHovIRLXYLaIebGcuu2muC8UCddGTGDveVEDjvrnRm3ycQw-dKPMppudVmKQX7KZMw62ii5qVPNPS6eIVS0fjgxjNb3FR5ZD4p5JClzpeRLjSHOguJEt1dGNLs0D3moZza0mv1BN-58J5J2J33URSDwSCNc=w408-h214',
        type: 'restaurant',
        description: 'Best beer in town!',
        pos: st.makePoint(-73.5557869, 45.498978)
      }),
      knex('journey_step_places').insert({
        journey_step_id: 2,
        place_id: 1338,
        name: 'SOS Labyrinthe',
        image_url: 'https://lh3.googleusercontent.com/-xLYieD3r6AA/Vx-J7uxYHxI/AAAAAAAAAD8/zxKr1f7iahgYOaMlTgFh0048N31E6f5ZwCJkC/s408-k-no/',
        type: 'tourist attraction',
        description: 'Great puzzles',
        pos: st.makePoint(-73.5550512, 45.5072606)
      }),
    ]))
};
