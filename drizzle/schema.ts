import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, smallint, mysqlEnum, mediumint, varchar, tinyint, int, text, unique, datetime, char } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const operation = mysqlTable("operation", {
	id: smallint("id").autoincrement().notNull(),
	parcelId: smallint("parcelId"),
	stopId: smallint("stopId"),
	operation: mysqlEnum("operation", ['load','unload']).notNull(),
},
(table) => {
	return {
		operationId: primaryKey(table.id),
	}
});

export const parcel = mysqlTable("parcel", {
	id: smallint("id").autoincrement().notNull(),
	weight: mediumint("weight").notNull(),
	length: smallint("length").notNull(),
	width: smallint("width").notNull(),
	height: smallint("height").notNull(),
	reference: varchar("reference", { length: 50 }),
	type: mysqlEnum("type", ['pallet','box','envelope']).notNull(),
	isPublished: tinyint("isPublished").default(1),
	isAutoBook: tinyint("isAutoBook").default(1),
},
(table) => {
	return {
		parcelId: primaryKey(table.id),
	}
});

export const pokemon = mysqlTable("pokemon", {
	id: int("id").autoincrement().notNull(),
	name: text("name").notNull(),
},
(table) => {
	return {
		pokemonId: primaryKey(table.id),
	}
});

export const stop = mysqlTable("stop", {
	id: smallint("id").autoincrement().notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	arrivalDateTime: datetime("arrivalDateTime", { mode: 'string'}).default('2023-10-18 07:39:29'),
	departureDateTime: datetime("departureDateTime", { mode: 'string'}).default('2023-10-18 07:39:29'),
	startDateTime: datetime("startDateTime", { mode: 'string'}),
	endDateTime: datetime("endDateTime", { mode: 'string'}),
	vehicleId: smallint("vehicleId"),
},
(table) => {
	return {
		stopId: primaryKey(table.id),
		stopIdUnique: unique("stop_id_unique").on(table.id),
	}
});

export const vehicle = mysqlTable("vehicle", {
	id: smallint("id").autoincrement().notNull(),
	userId: char("userId", { length: 32 }).notNull(),
	transportationType: mysqlEnum("transportationType", ['grouped','individual']).default('individual').notNull(),
	description: varchar("description", { length: 255 }),
	reference: varchar("reference", { length: 50 }),
	vehicleType: mysqlEnum("vehicleType", ['van','truck','car']).notNull(),
	weight: mediumint("weight").notNull(),
	length: smallint("length").notNull(),
	width: smallint("width").notNull(),
	height: smallint("height").notNull(),
	isPublished: tinyint("isPublished").default(1),
	isAutoBook: tinyint("isAutoBook").default(1),
},
(table) => {
	return {
		vehicleId: primaryKey(table.id),
		vehicleIdUnique: unique("vehicle_id_unique").on(table.id),
	}
});