import Koa from 'koa'
import bodyParser from 'koa-body'
import convert from 'koa-convert'
import logger from 'koa-logger'
import cors from 'koa-cors'
import passport from 'koa-passport'
import config from '../config'
import errorMiddleware from '../src/middleware/error'

const app = new Koa()

if (process.env.NODE_ENV !== 'test') {
  app.use(logger())
}

app.use(convert(cors()))
app.use(bodyParser())

app.use(errorMiddleware())

require('../config/passport')
app.use(passport.initialize())

const modules = require('../src/modules')
modules(app)

app.listen(config.port, () => {
  console.log(`Magic happens on ${config.port}`)
})

export default app
