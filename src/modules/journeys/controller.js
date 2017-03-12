import { Journey } from '../../models/journey'
import { Mural } from '../../models/mural'
import maps from '../../../lib/maps'
import polyline from 'polyline'
import Promise from 'bluebird'

const ramdis = {}

async function getRoute(journey) {
  if (!ramdis[journey.id]) {
    const { steps: [ orig, ...rest ] } = journey
    const dest = rest.pop()

    const result = await maps.directions({
      origin: { lng: orig.bixiStation.pos.coordinates[0], lat: orig.bixiStation.pos.coordinates[1] },
      waypoints: rest.map((s) => ({ lng: s.bixiStation.pos.coordinates[0], lat: s.bixiStation.pos.coordinates[1] })),
      destination: { lng: dest.bixiStation.pos.coordinates[0], lat: dest.bixiStation.pos.coordinates[1] },
      mode: 'bicycling'
    }).asPromise()

    if (result.json && result.json.routes && result.json.routes[0]) {
      const route = result.json.routes[0]
      ramdis[journey.id] = {
        overview_path: polyline.decode(route.overview_polyline.points),
        duration: route.legs.map(({ duration: { value } }) => value).reduce((a, b) => a + b),
        distance: route.legs.map(({ distance: { value } }) => value).reduce((a, b) => a + b),
        bounds: { ...route.bounds },
        legs: route.legs.map(({ distance, duration }) => ({ distance, duration }))
      }
    }
  }

  return ramdis[journey.id]
}

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
  const journeys = await Journey.fetchAll({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] }).then((journeys) => Promise.all(
    journeys.toJSON().map((journey) => getRoute(journey).then(({ distance, duration, bounds, overview_path, legs }) => ({
      ...journey, distance, duration,
      overviewBounds: bounds,
      overviewPath: overview_path,
      steps: journey.steps.map((s, i) => i === 0 ? s : { ...s, ...legs[i - 1] })
    })))
  ))

  ctx.body = { journeys }
}

export async function get(ctx, next) {
  const journey = (await Journey.where({ id: ctx.params.id }).fetch({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] })).toJSON();

  journey.steps = await Promise.all(journey.steps.map(s =>
    Mural.query(qb =>
      qb.whereRaw(`ST_Distance(pos::geography, ST_SetSRID(ST_MakePoint(${s.bixiStation.pos.coordinates.join(',')}), 4326)) <= 1000`)
    ).fetchAll().then(m => ({...s, murals: m.toJSON()}))
  ))

  const { distance, duration, bounds, overview_path, legs } = await getRoute(journey)

  ctx.body = {
    journey: {
      ...journey, distance, duration,
      overviewBounds: bounds,
      overviewPath: overview_path,
      steps: journey.steps.map((s, i) => i === 0 ? s : { ...s, ...legs[i - 1] })
    }
  }
  await next()
}

export async function update(ctx) {

}

export async function remove(ctx) {

}
