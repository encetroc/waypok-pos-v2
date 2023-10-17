import { int, mysqlTable, text } from 'drizzle-orm/mysql-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const pokemon = mysqlTable('pokemon', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
})

export const insertPokemonSchema = createInsertSchema(pokemon)

export const selectPokemonSchema = createSelectSchema(pokemon)
