import * as journey from './controller'

export const baseUrl = '/journeys'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      journey.create
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      journey.list
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      journey.get
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      journey.get,
      journey.update
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      journey.get,
      journey.remove
    ]
  }
]
