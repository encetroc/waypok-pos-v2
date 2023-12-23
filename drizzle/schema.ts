import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, smallint, char, varchar, mysqlEnum, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const address = mysqlTable("address", {
	id: smallint("id").autoincrement().notNull(),
	userId: char("userId", { length: 32 }).notNull(),
	city: varchar("city", { length: 45 }).notNull(),
	street: varchar("street", { length: 45 }),
	number: varchar("number", { length: 45 }),
},
(table) => {
	return {
		addressId: primaryKey(table.id),
		addressIdUnique: unique("address_id_unique").on(table.id),
	}
});

export const operation = mysqlTable("operation", {
	id: smallint("id").autoincrement().notNull(),
	type: mysqlEnum("type", ['load','unload']).notNull(),
	parcelId: smallint("parcelId").notNull(),
	addressInstanceId: smallint("addressInstanceId").notNull(),
},
(table) => {
	return {
		operationId: primaryKey(table.id),
		operationIdUnique: unique("operation_id_unique").on(table.id),
	}
});

export const parcel = mysqlTable("parcel", {
	id: smallint("id").autoincrement().notNull(),
	userId: char("userId", { length: 32 }).notNull(),
},
(table) => {
	return {
		parcelId: primaryKey(table.id),
		parcelIdUnique: unique("parcel_id_unique").on(table.id),
	}
});

export const timeSlot = mysqlTable("timeSlot", {
	id: smallint("id").autoincrement().notNull(),
	start: datetime("start", { mode: 'string'}).notNull(),
	end: datetime("end", { mode: 'string'}).notNull(),
	vehicleId: smallint("vehicleId").notNull(),
},
(table) => {
	return {
		timeSlotId: primaryKey(table.id),
		timeSlotIdUnique: unique("timeSlot_id_unique").on(table.id),
	}
});

export const timeSlotAddress = mysqlTable("timeSlotAddress", {
	id: smallint("id").autoincrement().notNull(),
	timeSlotId: smallint("timeSlotId").notNull(),
	addressId: smallint("addressId").notNull(),
},
(table) => {
	return {
		timeSlotAddressId: primaryKey(table.id),
		timeSlotAddressIdUnique: unique("timeSlotAddress_id_unique").on(table.id),
	}
});

export const vehicle = mysqlTable("vehicle", {
	id: smallint("id").autoincrement().notNull(),
	userId: char("userId", { length: 32 }).notNull(),
},
(table) => {
	return {
		vehicleId: primaryKey(table.id),
		vehicleIdUnique: unique("vehicle_id_unique").on(table.id),
	}
});