import Bookshelf from '../../db/bookshelf'

export const Mural = Bookshelf.Model.extend({
  tableName: 'murals',
  geometry: ['pos']
})
