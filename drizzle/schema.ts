import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, smallint, varchar, mysqlEnum, datetime, mediumint, tinyint, char } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const address = mysqlTable("address", {
	id: smallint("id").autoincrement().notNull(),
	country: varchar("country", { length: 100 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	street: varchar("street", { length: 100 }).notNull(),
	number: varchar("number", { length: 10 }).notNull(),
	checkpointId: smallint("checkpointId"),
},
(table) => {
	return {
		addressId: primaryKey(table.id),
		addressIdUnique: unique("address_id_unique").on(table.id),
	}
});

export const checkpoint = mysqlTable("checkpoint", {
	id: smallint("id").autoincrement().notNull(),
	type: mysqlEnum("type", ['exact','interval']).notNull(),
	start: datetime("start", { mode: 'string'}).notNull(),
	end: datetime("end", { mode: 'string'}).notNull(),
	vehicleId: smallint("vehicleId").notNull(),
},
(table) => {
	return {
		checkpointId: primaryKey(table.id),
		checkpointIdUnique: unique("checkpoint_id_unique").on(table.id),
	}
});

export const operation = mysqlTable("operation", {
	id: smallint("id").autoincrement().notNull(),
	parcelId: smallint("parcelId").notNull(),
	checkpointId: smallint("checkpointId").notNull(),
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
	isDoorToDoor: tinyint("isDoorToDoor").default(0).notNull(),
},
(table) => {
	return {
		vehicleId: primaryKey(table.id),
		vehicleIdUnique: unique("vehicle_id_unique").on(table.id),
	}
});