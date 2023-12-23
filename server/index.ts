import { db } from '@/db/client'
import { addUserId } from '@/lib/utils'
import {
  address as addressDrizzleSchema,
  insertAddressSchema,
  insertParcelSchema,
  insertTimeSlotSchema,
  insertVehicleSchema,
  parcel as parcelDrizzleSchema,
  timeSlotAddress as timeSlotAddressDrizzleSchema,
  timeSlot as timeSlotDrizzleSchema,
  vehicle as vehicleDrizzleSchema,
} from '@/schema/drizzle'
import { protectedProcedure, router } from '@/server/trpc'
import { inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

export const appRouter = router({
  createVehicle: protectedProcedure
    .input(insertVehicleSchema)
    .mutation(({ input, ctx }) => {
      const vehicle = db
        .insert(vehicleDrizzleSchema)
        .values(addUserId(ctx.auth.userId, input))
      return vehicle
    }),
  createParcel: protectedProcedure
    .input(insertParcelSchema)
    .mutation(({ input, ctx }) => {
      const parcel = db
        .insert(parcelDrizzleSchema)
        .values(addUserId(ctx.auth.userId, input))
      return parcel
    }),
  createTimeSlot: protectedProcedure
    .input(
      insertTimeSlotSchema.extend({
        addresses: z.array(
          z.object({
            id: z.coerce.number().gt(0, 'Select a word or delete.'),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const timeSlot = await db.insert(timeSlotDrizzleSchema).values(input)

      const newtimeSlotAddresses = input.addresses.map((address) => ({
        timeSlotId: parseInt(timeSlot.insertId),
        addressId: address.id,
      }))
      const timeSlotAddress = await db
        .insert(timeSlotAddressDrizzleSchema)
        .values(newtimeSlotAddresses)
      return timeSlot
    }),
  createAddress: protectedProcedure
    .input(insertAddressSchema)
    .mutation(({ input, ctx }) => {
      const address = db
        .insert(addressDrizzleSchema)
        .values(addUserId(ctx.auth.userId, input))
      return address
    }),
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
