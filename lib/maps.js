const config = require('../config')

const Promise = require('bluebird')

module.exports = require('@google/maps').createClient({
  key: config.maps.key,
  Promise: Promise
})
