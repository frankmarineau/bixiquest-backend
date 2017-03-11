require('dotenv').config({ silent: true })

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: './seeds'
    }
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: './seeds'
    }
  }
}
