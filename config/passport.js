import passport from 'koa-passport'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { User } from '../src/models/user'
import { Strategy } from 'passport-local'
import config from './index'

passport.serializeUser(({ id }, done) => done(null, id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.where({ id }).fetch({ require: true })
    done(null, user)
  } catch (err) {
    console.log(err)
    done(err)
  }
})

passport.use('local', new Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.where({ email }).fetch()

    if (!user) {
      return done(null, false)
    }

    try {
      const match = await user.validatePassword(password)
      if (!match) {
        return done(null, false)
      }

      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      user.set('lastSeen', now)
      await user.save()

      done(null, user)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
