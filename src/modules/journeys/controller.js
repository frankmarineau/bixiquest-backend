import { Journey } from '../../models/journey'
import Promise from 'bluebird'
import { Mural } from '../../models/mural'

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

  const steps = await Promise.all(
    journey.steps.map(
      s => Mural.query(
        qb => qb.whereRaw(`ST_DWithin(ST_SetSRID(ST_MakePoint(${s.bixiStation.pos.coordinates.join(',')}), 4326), pos, 1)`)
      ).fetchAll().then(m => ({...s, murals: m.toJSON()}))
    ));

  journey.steps = steps;

  // const journey = await Journey.query(qb => {
  //   qb.crossJoin('murals')
  //     .whereRaw('ST_DWithin(murals.pos, bixi_stations.pos, 1000000')
  // }).where({ id: ctx.params.id })
  //       .fetch({ withRelated: ['steps', 'steps.bixiStation', 'steps.places'] })
  ctx.body = { journey }
  await next()
}

export async function update(ctx) {

}

export async function remove(ctx) {

}
