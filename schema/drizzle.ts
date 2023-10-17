import { relations } from 'drizzle-orm'
import {
  boolean,
  char,
  datetime,
  int,
  mediumint,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const pokemon = mysqlTable('pokemon', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
})

export const insertPokemonSchema = createInsertSchema(pokemon)

export const selectPokemonSchema = createSelectSchema(pokemon)

export const vehicle = mysqlTable('vehicle', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
  transportationType: mysqlEnum('transportationType', ['grouped', 'individual'])
    .notNull()
    .default('individual'),
  description: varchar('description', { length: 255 }),
  reference: varchar('reference', { length: 50 }),
  vehicleType: mysqlEnum('vehicleType', ['van', 'truck', 'car']).notNull(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  isPublished: boolean('isPublished').default(true),
  isAutoBook: boolean('isAutoBook').default(true),
})

export const stop = mysqlTable('stop', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  address: varchar('address', { length: 255 }).notNull(),
  arrivalDateTime: datetime('arrivalDateTime').default(new Date()),
  departureDateTime: datetime('departureDateTime').default(new Date()),
  startDateTime: datetime('startDateTime'),
  endDateTime: datetime('endDateTime'),
  vehicleId: smallint('vehicleId').references(() => vehicle.id),
})

export const vehicleInStop = relations(vehicle, ({ many }) => ({
  stops: many(stop),
}))

export const stopsInVehicle = relations(stop, ({ one }) => ({
  vehicle: one(vehicle, {
    fields: [stop.vehicleId],
    references: [vehicle.id],
  }),
}))

export const parcel = mysqlTable('parcel', {
  id: smallint('id').primaryKey().autoincrement(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  reference: varchar('reference', { length: 50 }),
  type: mysqlEnum('type', ['pallet', 'box', 'envelope']).notNull(),
  isPublished: boolean('isPublished').default(true),
  isAutoBook: boolean('isAutoBook').default(true),
})

export const operation = mysqlTable('operation', {
  id: smallint('id').primaryKey().autoincrement(),
  parcelId: smallint('parcelId').references(() => parcel.id),
  stopId: smallint('stopId').references(() => stop.id),
  operation: mysqlEnum('operation', ['load', 'unload']).notNull(),
})

export const stopInOperation = relations(stop, ({ many }) => ({
  operations: many(operation),
}))

export const parcelInOperation = relations(parcel, ({ many }) => ({
  operations: many(operation),
}))

export const operationsInStop = relations(operation, ({ one }) => ({
  stop: one(stop, {
    fields: [operation.stopId],
    references: [stop.id],
  }),
}))

export const operationsInParcel = relations(operation, ({ one }) => ({
  parcel: one(parcel, {
    fields: [operation.stopId],
    references: [parcel.id],
  }),
}))

// 2023-10-18 11:30:30
