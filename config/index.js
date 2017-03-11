require('dotenv').config({ silent: true })

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'awesome-jwt-secret',
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: false
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  },
  sendgrid: {
    email: 'info@bon-debarras.ca',
    key: process.env.SENDGRID_KEY
  }
}
