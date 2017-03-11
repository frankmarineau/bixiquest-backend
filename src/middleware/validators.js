import { User } from '../models/user'
import { verify } from 'jsonwebtoken'
import config from '../../config'

export async function isAuthenticated(ctx, next) {
  const { authorization } = ctx.headers

  if (!authorization) {
    ctx.throw(401)
  }

  try {
    const { id } = verify(authorization, config.jwtSecret)
    const user = await User.where({ id }).fetch({
      require: true
    })

    ctx.user = user
  } catch (err) {
    ctx.throw(401, err.message)
  }

  return next()
}

// for routes that need to handle both anon and authed user actions
export async function ifAuthenticatedFetchUser(ctx, next) {
  const { authorization } = ctx.headers

  if (!authorization) {
    return next()
  }

  const { id } = verify(authorization, config.jwtSecret)
  const user = await User.where({ id }).fetch({ require: true })
  ctx.user = user

  return next()
}

export function isAuthorized(ctx, next) {
  const { id } = ctx.user
  const role = ctx.user.get('role')

  if (role === 'admin') {
    return next()
  }

  if (+ctx.params.userId === id) {
    return next()
  }

  if (ctx.body.sale) {
    const host = ctx.body.sale.related('host')
    if (+host.id === id) {
      return next()
    }
  }

  ctx.throw(403)
}
