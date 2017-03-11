import Bookshelf from '../../db/bookshelf'

import Promise from 'bluebird'

import { BixiStation } from './bixi-station'

export const Journey = Bookshelf.Model.extend({
  tableName: 'journeys',
  hasTimestamps: true,

  steps () {
    return this.hasMany(JourneyStep)
  }
})

export const JourneyStep = Bookshelf.Model.extend({
  tableName: 'journey_steps',

  journey () {
    return this.belongsTo(Journey)
  },
  bixiStation () {
    return this.belongsTo(BixiStation)
  },
  places () {
    return this.hasMany(JourneyStepPlace)
  }
})

export const JourneyStepPlace = Bookshelf.Model.extend({
  tableName: 'journey_step_places',
  geometry: ['pos'],

  step () {
    return this.belongsTo(JourneyStep)
  }
})
