import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, int, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const usertest = mysqlTable("usertest", {
	id: int("id").autoincrement().notNull(),
	name: text("name"),
},
(table) => {
	return {
		usertestId: primaryKey(table.id),
	}
});