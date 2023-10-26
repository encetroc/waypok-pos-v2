import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, smallint, mysqlEnum, mediumint, tinyint, char, int, text, unique, varchar, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const operation = mysqlTable("operation", {
	id: smallint("id").autoincrement().notNull(),
	parcelId: smallint("parcelId").notNull(),
	stopId: smallint("stopId").notNull(),
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
	type: mysqlEnum("type", ['pallet','box','envelope']).notNull(),
	isPublished: tinyint("isPublished").default(1).notNull(),
	isAutoBook: tinyint("isAutoBook").default(1).notNull(),
	isGrouped: tinyint("isGrouped").default(0).notNull(),
	userId: char("userId", { length: 32 }).notNull(),
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
	arrivalDateTime: datetime("arrivalDateTime", { mode: 'string'}).notNull(),
	departureDateTime: datetime("departureDateTime", { mode: 'string'}).notNull(),
	vehicleId: smallint("vehicleId").notNull(),
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
	isGrouped: tinyint("isGrouped").default(0).notNull(),
	type: mysqlEnum("type", ['van','truck','car']).notNull(),
	weight: mediumint("weight").notNull(),
	length: smallint("length").notNull(),
	width: smallint("width").notNull(),
	height: smallint("height").notNull(),
	isPublished: tinyint("isPublished").default(1).notNull(),
	isAutoBook: tinyint("isAutoBook").default(1).notNull(),
},
(table) => {
	return {
		vehicleId: primaryKey(table.id),
		vehicleIdUnique: unique("vehicle_id_unique").on(table.id),
	}
});