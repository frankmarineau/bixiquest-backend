import Bookshelf from '../../db/bookshelf'

import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import config from '../../config'

const bcrypt = Promise.promisifyAll(require('bcrypt'))

export const User = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  hidden: ['password', 'salt', 'accessToken'],

  initialize() {
    this.on('saving', this.hashPassword, this)
  },

  generateToken() {
    const { id } = this
    return jwt.sign({ id }, config.jwtSecret)
  },

  async validatePassword(password) {
    return await bcrypt.compareAsync(password, this.get('password'))
  },

  async hashPassword() {
    const password = this.get('password')

    if (password) {
      if (this.isNew() || this.hasChanged('password')) {
        const salt = await bcrypt.genSaltAsync(10)
        const hash = await bcrypt.hashAsync(password, salt)

        this.set('password', hash)
        this.set('salt', salt)
      }
    }
  }
})
