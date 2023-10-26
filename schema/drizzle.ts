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
import { z } from 'zod'

// pokemon table is used to testing

export const pokemon = mysqlTable('pokemon', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
})

export const insertPokemonSchema = createInsertSchema(pokemon)

export const selectPokemonSchema = createSelectSchema(pokemon)

// relation with FK constrain are not allowed in planetscale, we use virtual relation instead with drizzle

export const vehicle = mysqlTable('vehicle', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
  type: mysqlEnum('type', ['van', 'truck', 'car']).notNull(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  isGrouped: boolean('isGrouped').default(false).notNull(),
  isPublished: boolean('isPublished').default(true).notNull(),
  isAutoBook: boolean('isAutoBook').default(true).notNull(),
})
export const insertVehicleSchema = createInsertSchema(vehicle).omit({
  userId: true,
})
export const selectVehicleSchema = createSelectSchema(vehicle)
export type Vehicle = z.infer<typeof selectVehicleSchema>

export const stop = mysqlTable('stop', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  address: varchar('address', { length: 255 }).notNull(),
  arrivalDateTime: datetime('arrivalDateTime').notNull(),
  departureDateTime: datetime('departureDateTime').notNull(),
  vehicleId: smallint('vehicleId').notNull(),
})
export const insertStopSchema = createInsertSchema(stop)
export const selectStopSchema = createSelectSchema(stop)
export type Stop = z.infer<typeof selectStopSchema>

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
  userId: char('userId', { length: 32 }).notNull(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  type: mysqlEnum('type', ['pallet', 'box', 'envelope']).notNull(),
  isGrouped: boolean('isGrouped').default(false).notNull(),
  isPublished: boolean('isPublished').default(true).notNull(),
  isAutoBook: boolean('isAutoBook').default(true).notNull(),
})
export const insertParcelSchema = createInsertSchema(parcel).omit({
  userId: true,
})
export const selectParcelSchema = createSelectSchema(parcel)
export type Parcel = z.infer<typeof selectParcelSchema>

export const operation = mysqlTable('operation', {
  id: smallint('id').primaryKey().autoincrement(),
  parcelId: smallint('parcelId').notNull(),
  stopId: smallint('stopId').notNull(),
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
