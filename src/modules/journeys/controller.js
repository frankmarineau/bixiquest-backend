import { Journey } from '../../models/journey'
import Promise from 'bluebird'
import { Mural } from '../../models/mural'
import polyline from 'polyline'

import maps from '../../../lib/maps'

const routes_cache = {}

export async function create(ctx) {
  const journey = Journey.forge(ctx.request.body.journey)

  try {
    await journey.save()
  } catch (err) {
    ctx.throw(422, 'defaultError')
  }

  ctx.body = { journey }
}

export async function list(ctx) {
  const journeys = await Journey.fetchAll({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] })
  ctx.body = { journeys }
}

export async function get(ctx, next) {
  const journey = (await Journey.where({ id: ctx.params.id }).fetch({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] })).toJSON();

  journey.steps = await Promise.all(journey.steps.map(s =>
    Mural.query(qb =>
      qb.whereRaw(`ST_Distance(pos::geography, ST_SetSRID(ST_MakePoint(${s.bixiStation.pos.coordinates.join(',')}), 4326)) <= 1000`)
    ).fetchAll().then(m => ({...s, murals: m.toJSON()}))
  ))

  let route = routes_cache[journey.id]
  if (!route) {
    const { steps: [ orig, ...rest ] } = journey
    const dest = rest.pop()
    const result = await maps.directions({
      origin: { lng: orig.bixiStation.pos.coordinates[0], lat: orig.bixiStation.pos.coordinates[1] },
      waypoints: rest.map((s) => ({ lng: s.bixiStation.pos.coordinates[0], lat: s.bixiStation.pos.coordinates[1] })),
      destination: { lng: dest.bixiStation.pos.coordinates[0], lat: dest.bixiStation.pos.coordinates[1] },
      mode: 'bicycling'
    }).asPromise()
    route = routes_cache[journey.id] = result.json && result.json.routes && result.json.routes[0]
  }

  ctx.body = { journey: { ...journey, overviewPath: polyline.decode(route.overview_polyline.points) } }
  await next()
}

export async function update(ctx) {

}

export async function remove(ctx) {

}
