import { int, mysqlTable, text } from 'drizzle-orm/mysql-core'

export const user = mysqlTable('usertest', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name'),
})
