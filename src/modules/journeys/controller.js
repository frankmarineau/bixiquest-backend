import { Journey } from '../../models/journey'
import { Mural } from '../../models/mural'
import maps from '../../../lib/maps'
import polyline from 'polyline'
import Promise from 'bluebird'

const ramdis = {}

async function getBikeRoute(journey) {
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

async function getWalkDistance(pos, journey) {
  const { steps: [ orig, ...rest ] } = journey

  if (!pos || pos.lng === undefined || pos.lat === undefined) return {}

  const result = await maps.distanceMatrix({
    origins: [{ lng: pos.lng, lat: pos.lat }],
    destinations: [{ lng: orig.bixiStation.pos.coordinates[0], lat: orig.bixiStation.pos.coordinates[1] }],
    mode: 'walking'
  }).asPromise()

  console.log(result)

  if (result.json && result.json.rows && result.json.rows[0] && result.json.rows[0].elements[0]) {
    const { distance, duration } = result.json.rows[0].elements[0]
    return { distance, duration }
  } else {
    return {}
  }
}

async function getLocationData(pos, journey) {
  const [ route, walk ] = await Promise.all([getBikeRoute(journey), getWalkDistance(pos, journey)])
  return { ...route, walk }
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
  const pos = { lng: ctx.query.lng, lat: ctx.query.lat }

  const journeys = await Journey.fetchAll({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] }).then((journeys) => Promise.all(
    journeys.toJSON().map((journey) => getLocationData(pos, journey).then(({ distance, duration, bounds, overview_path, legs, walk }) => ({
      ...journey, distance, duration,
      overviewBounds: bounds,
      overviewPath: overview_path,
      steps: journey.steps.map((s, i) => ({ ...s, ...(i === 0 ? walk : legs[i - 1]) }))
    })))
  ))

  ctx.body = { journeys }
}

export async function get(ctx, next) {
  const pos = { lng: ctx.query.lng, lat: ctx.query.lat }

  const journey = (await Journey.where({ id: ctx.params.id }).fetch({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] })).toJSON();

  journey.steps = await Promise.all(journey.steps.map(s =>
    Mural.query(qb =>
      qb.whereRaw(`ST_Distance(pos::geography, ST_SetSRID(ST_MakePoint(${s.bixiStation.pos.coordinates.join(',')}), 4326)) <= 1000`)
    ).fetchAll().then(m => ({...s, murals: m.toJSON()}))
  ))

  const { distance, duration, bounds, overview_path, legs, walk } = await getLocationData(pos, journey)

  ctx.body = {
    journey: {
      ...journey, distance, duration,
      overviewBounds: bounds,
      overviewPath: overview_path,
      steps: journey.steps.map((s, i) => ({ ...s, ...(i === 0 ? walk : legs[i - 1]) }))
    }
  }
  await next()
}

export async function update(ctx) {

}

export async function remove(ctx) {

}
