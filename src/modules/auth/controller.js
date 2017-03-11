import passport from 'koa-passport'

export async function authUser(ctx, next) {
  return passport.authenticate('local', (user) => {
    if (!user) {
      ctx.throw(401, 'loginFailure')
    }

    const token = user.generateToken()

    ctx.body = {
      token,
      user: user.toJSON()
    }
  })(ctx, next)
}
