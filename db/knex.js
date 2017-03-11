import config from '../config'
const knex = require('knex')(config.database)

export default knex
