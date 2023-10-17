import { int, mysqlTable, text } from 'drizzle-orm/mysql-core'

export const pokemon = mysqlTable('pokemon', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name'),
})
