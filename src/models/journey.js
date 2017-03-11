import Bookshelf from '../../db/bookshelf'

import Promise from 'bluebird'

import { BixiStation } from './bixi-station'

export const Journey = Bookshelf.Model.extend({
  tableName: 'journeys',
  hasTimestamps: true,

  startingPoint: () => this.belongsTo(BixiStation)

  journeySteps: () => this.hasMany(JourneyStep)
})

export const JourneyStep = Bookshelf.Model.extend({
  tableName: 'journey_steps',

  bixiStation: () => this.belongsTo(BixiStation),

  places: () => this.hasMany(JourneyStepPlaces)
})

export const JourneyStepPlace = Bookshelf.Model.extend({
  tableName: 'journey_step_places',

  step: () => this.belongsTo(JourneyStep)
})
