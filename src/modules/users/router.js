import { isAuthenticated, isAuthorized } from '../../middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      user.create
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      isAuthenticated,
      user.list
    ]
  },
  {
    method: 'GET',
    route: '/me',
    handlers: [
      isAuthenticated,
      user.get
    ]
  },
  {
    method: 'PUT',
    route: '/me',
    handlers: [
      isAuthenticated,
      user.get,
      user.update
    ]
  },
  {
    method: 'DELETE',
    route: '/me',
    handlers: [
      isAuthenticated,
      user.get,
      user.remove
    ]
  }
]
