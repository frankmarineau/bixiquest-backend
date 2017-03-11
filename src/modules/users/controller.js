import { User } from '../../models/user'

export async function create(ctx) {
  const user = User.forge(ctx.request.body.user)

  try {
    await user.save()
  } catch (err) {
    switch (err.code) {
      case '23505': ctx.throw(409, 'emailAlreadyExists')
        break
      default : ctx.throw(422, 'defaultError')
    }
  }

  const token = user.generateToken()

  ctx.body = { token, user }
}

export async function list(ctx) {
  const users = await User.fetchAll()
  ctx.body = { users }
}

export async function get(ctx, next) {
  const { user } = ctx
  ctx.body = { user }
  await next()
}

export async function update(ctx) {
  const { user } = ctx
  const passwordUpdate = ctx.request.body.passwordUpdate
  const errors = {}

  if (passwordUpdate) {
    const passwordValidated = await user.validatePassword(passwordUpdate.oldPassword)
    if (passwordValidated) {
      user.set({password: passwordUpdate.password})
    } else {
      errors.oldPassword = 'incorrectPassword'
      errors._error = 'userUpdateFailure'
      ctx.throw(409, JSON.stringify(errors))
    }
  }

  try {
    const response = await user.save({ ...ctx.request.body.user, id: user.id }, { patch: true })
    ctx.body = { user: response }
  } catch (err) {
    errors._error = 'userUpdateFailure'
    switch (err.code) {
      case '23505': errors.email = 'already exists'
    }
    ctx.throw(409, JSON.stringify(errors))
  }
}

export async function remove(ctx) {
  const { user } = ctx

  await user.destroy()

  ctx.status = 200
  ctx.body = { success: true }
}
