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
  id: smallint('id').primaryKey().autoincrement(),
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
  isAutoBook: boolean('isPublished').default(true),
})

export const stop = mysqlTable('stop', {
  id: smallint('id').primaryKey().autoincrement(),
  address: varchar('address', { length: 255 }).notNull(),
  arrivalDateTime: datetime('arrivalDateTime'),
  departureDateTime: datetime('departureDateTime'),
  startDateTime: datetime('startDateTime'),
  endDateTime: datetime('endDateTime'),
  vehicleId: smallint('vehicleId').references(() => vehicle.id),
})

export const parcel = mysqlTable('parcel', {
  id: smallint('id').primaryKey().autoincrement(),
  weight: mediumint('weight').notNull(),
  length: smallint('length').notNull(),
  width: smallint('width').notNull(),
  height: smallint('height').notNull(),
  reference: varchar('reference', { length: 50 }),
  type: mysqlEnum('type', ['pallet', 'box', 'envelope']).notNull(),
  isPublished: boolean('isPublished').default(true),
  isAutoBook: boolean('isPublished').default(true),
})

export const operation = mysqlTable('operation', {
  id: smallint('id').primaryKey().autoincrement(),
  parcelId: smallint('parcelId').references(() => parcel.id),
  stopId: smallint('stopId').references(() => stop.id),
  operation: mysqlEnum('operation', ['load', 'unload']).notNull(),
})
