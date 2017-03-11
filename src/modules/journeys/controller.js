import { Journey } from '../../models/journey'

export async function create(ctx) {
  const journey = Journey.forge(ctx.request.body.journey)

  try {
    await journey.save()
  } catch (err) {
    ctx.throw(422, 'defaultError')
  }

  ctx.body = { token, journey }
}

export async function list(ctx) {
  const journeys = await Journey.fetchAll()
  ctx.body = { journeys }
}

export async function get(ctx, next) {
  const journey = await Journey.where({ id: this.params.id }).fetch({ withRelated: ['startingPoint', 'steps', 'steps.bixiStation', 'steps.places'] })
  ctx.body = { journey }
  await next()
}

export async function update(ctx) {

}

export async function remove(ctx) {

}
