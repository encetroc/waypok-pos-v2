import { relations } from 'drizzle-orm'
import {
  char,
  datetime,
  mysqlEnum,
  mysqlTable,
  smallint,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const vehicle = mysqlTable('vehicle', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
})
export const insertVehicleSchema = createInsertSchema(vehicle).omit({
  userId: true,
})
export const selectVehicleSchema = createSelectSchema(vehicle)
export type Vehicle = z.infer<typeof selectVehicleSchema>

export const timeSlot = mysqlTable('timeSlot', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  start: datetime('start').notNull(),
  end: datetime('end').notNull(),
  vehicleId: smallint('vehicleId').notNull(),
})
export const insertTimeSlotSchema = createInsertSchema(timeSlot)
export const selectTimeSlotSchema = createSelectSchema(timeSlot)
export type TimeSlot = z.infer<typeof selectTimeSlotSchema>

export const address = mysqlTable('address', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
  city: varchar('city', { length: 45 }).notNull(),
  street: varchar('street', { length: 45 }),
  number: varchar('number', { length: 45 }),
})
export const insertAddressSchema = createInsertSchema(address).omit({
  userId: true,
})
export const selectAddressSchema = createSelectSchema(address)
export type Address = z.infer<typeof selectAddressSchema>

export const timeSlotAddress = mysqlTable('timeSlotAddress', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  timeSlotId: smallint('timeSlotId').notNull(),
  addressId: smallint('addressId').notNull(),
})
export const insertTimeSlotAddressSchema = createInsertSchema(timeSlotAddress)
export const selectTimeSlotAddressSchema = createSelectSchema(timeSlotAddress)
export type TimeSlotAddress = z.infer<typeof selectTimeSlotAddressSchema>

export const parcel = mysqlTable('parcel', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  userId: char('userId', { length: 32 }).notNull(),
})
export const insertParcelSchema = createInsertSchema(parcel).omit({
  userId: true,
})
export const selectParcelSchema = createSelectSchema(parcel)
export type Parcel = z.infer<typeof selectParcelSchema>

export const operation = mysqlTable('operation', {
  id: smallint('id').primaryKey().autoincrement().unique(),
  type: mysqlEnum('type', ['load', 'unload']).notNull(),
  parcelId: smallint('parcelId').notNull(),
  addressInstanceId: smallint('addressInstanceId').notNull(),
})

export const timeSlotsInVehicle = relations(vehicle, ({ many }) => ({
  timeSlots: many(timeSlot),
}))

export const vehicleInTimeSlot = relations(timeSlot, ({ one }) => ({
  vehicle: one(vehicle, {
    fields: [timeSlot.vehicleId],
    references: [vehicle.id],
  }),
}))

export const operationsInParcel = relations(parcel, ({ many }) => ({
  operations: many(operation),
}))

export const parcelInOperation = relations(operation, ({ one }) => ({
  parcel: one(parcel, {
    fields: [operation.parcelId],
    references: [parcel.id],
  }),
}))

export const operationsInAddress = relations(address, ({ many }) => ({
  operations: many(operation),
}))

export const addressInOperation = relations(operation, ({ one }) => ({
  address: one(address, {
    fields: [operation.addressInstanceId],
    references: [address.id],
  }),
}))

export const addressesInTimeSlot = relations(timeSlot, ({ many }) => ({
  timeSlotAddresses: many(timeSlotAddress),
}))

export const timeSlotsInAddress = relations(address, ({ many }) => ({
  timeSlotAddresses: many(timeSlotAddress),
}))

export const timeSlotAddressRelations = relations(
  timeSlotAddress,
  ({ one }) => ({
    timeSlot: one(timeSlot, {
      fields: [timeSlotAddress.timeSlotId],
      references: [timeSlot.id],
    }),
    address: one(address, {
      fields: [timeSlotAddress.addressId],
      references: [address.id],
    }),
  })
)
