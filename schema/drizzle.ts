import { relations } from 'drizzle-orm'
import {
  boolean,
  char,
  datetime,
  mediumint,
  mysqlEnum,
  mysqlTable,
  smallint,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// relation with FK constrain are not allowed in planetscale, we use virtual relation instead with drizzle

export const vehicle = mysqlTable('vehicle', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
  type: mysqlEnum('type', ['van', 'truck', 'car']).notNull(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  isDoorToDoor: boolean('isDoorToDoor').default(false).notNull(),
  isGrouped: boolean('isGrouped').default(false).notNull(),
  isPublished: boolean('isPublished').default(true).notNull(),
  isAutoBook: boolean('isAutoBook').default(true).notNull(),
})
export const insertVehicleSchema = createInsertSchema(vehicle).omit({
  userId: true,
})
export const selectVehicleSchema = createSelectSchema(vehicle)
export type Vehicle = z.infer<typeof selectVehicleSchema>

export const address = mysqlTable('address', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  // postalCode: varchar('postalCode', { length: 10 }).notNull(),
  street: varchar('street', { length: 100 }).notNull(),
  number: varchar('number', { length: 10 }).notNull(),
  // lat: decimal('lat', { precision: 8, scale: 6 }).notNull(),
  // lng: decimal('lng', { precision: 9, scale: 6 }).notNull(),
  checkpointId: smallint('checkpointId'),
})
export const insertAddressSchema = createInsertSchema(address)
export const selectAddressSchema = createSelectSchema(address)
export type Address = z.infer<typeof selectAddressSchema>

export const checkpoint = mysqlTable('checkpoint', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  // a checkpoint can either have a precise datetime or an interval
  type: mysqlEnum('type', ['exact', 'interval']).notNull(),
  start: datetime('start').notNull(),
  end: datetime('end').notNull(),
  vehicleId: smallint('vehicleId').notNull(),
})
export const insertCheckpointSchema = createInsertSchema(checkpoint)
export const selectCheckpointSchema = createSelectSchema(checkpoint)
export type Checkpoint = z.infer<typeof selectCheckpointSchema>

export const addressesCheckpoint = relations(address, ({ one }) => ({
  checkpoint: one(checkpoint, {
    fields: [address.checkpointId],
    references: [checkpoint.id],
  }),
}))

export const checkpointInAddress = relations(checkpoint, ({ many }) => ({
  addresses: many(address),
}))

export const vehicleInCheckpoint = relations(vehicle, ({ many }) => ({
  checkpoints: many(checkpoint),
}))

export const checkpointsInVehicle = relations(checkpoint, ({ one }) => ({
  vehicle: one(vehicle, {
    fields: [checkpoint.vehicleId],
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
  checkpointId: smallint('checkpointId').notNull(),
  operation: mysqlEnum('operation', ['load', 'unload']).notNull(),
})

export const checkpointInOperation = relations(checkpoint, ({ many }) => ({
  operations: many(operation),
}))

export const parcelInOperation = relations(parcel, ({ many }) => ({
  operations: many(operation),
}))

export const operationsInCheckpoint = relations(operation, ({ one }) => ({
  checkpoint: one(checkpoint, {
    fields: [operation.checkpointId],
    references: [checkpoint.id],
  }),
}))

export const operationsInParcel = relations(operation, ({ one }) => ({
  parcel: one(parcel, {
    fields: [operation.checkpointId],
    references: [parcel.id],
  }),
}))
