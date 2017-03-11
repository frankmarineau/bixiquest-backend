require('dotenv').config({ silent: true })

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'awesome-jwt-secret',
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: false
  },
  sendgrid: {
    email: 'info@bon-debarras.ca',
    key: process.env.SENDGRID_KEY
  },
  maps: {
    key: process.env.GOOGLE_MAPS_API_KEY
  }
}
