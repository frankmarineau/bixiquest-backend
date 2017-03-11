import config from '../config'

const client = require('@google/maps').createClient({ key: config.google.key })

export default client
