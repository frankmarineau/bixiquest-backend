import config from '../config'

import Promise from 'bluebird'

const client = require('@google/maps').createClient({
  key: config.google.key,
  Promise: Promise
})

export default client
