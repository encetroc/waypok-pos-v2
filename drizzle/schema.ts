import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, int, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const pokemon = mysqlTable("pokemon", {
	id: int("id").autoincrement().notNull(),
	name: text("name"),
},
(table) => {
	return {
		pokemonId: primaryKey(table.id),
	}
});