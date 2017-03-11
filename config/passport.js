import passport from 'koa-passport'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { User } from '../src/models/user'
import { Strategy } from 'passport-local'
import FacebookStrategy from 'passport-facebook-token'
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

passport.use('facebook-token', new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  profileFields: ['name', 'email', 'friends', 'picture.type(large)'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  const user = await User
    .query({where: { facebook: profile.id }, orWhere: {email: profile._json.email}})
    .fetch()

  if (!user) {
    user.set({ accessToken })

    try {
      await user.save()
    } catch (err) {
      return done(err)
    }

    return done(null, user)
  }

  const newUser = User.forge({
    accessToken,
    facebook: profile.id,
    image: profile.photos[0].value,
    name: profile._json.first_name + ' ' + profile._json.last_name,
    email: profile._json.email
  })

  try {
    await newUser.save()
  } catch (err) {
    done(err)
  }

  return done(null, newUser)
}))
