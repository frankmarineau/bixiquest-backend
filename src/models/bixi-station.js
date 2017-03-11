import Bookshelf from '../../db/bookshelf'

import Promise from 'bluebird'

import { Journey } from './journey'

export const BixiStation = Bookshelf.Model.extend({
  tableName: 'bixi_stations',

  journeys: () => this.hasMany(Journey)
})
