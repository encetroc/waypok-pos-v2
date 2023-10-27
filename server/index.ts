import { db } from '@/db/client'
import { addUserId } from '@/lib/utils'
import {
  checkpoint as checkpointDrizzleSchema,
  insertCheckpointSchema,
  insertParcelSchema,
  insertVehicleSchema,
  parcel as parcelDrizzleSchema,
  vehicle as vehicleDrizzleSchema,
} from '@/schema/drizzle'
import { protectedProcedure, router } from '@/server/trpc'
import { inferRouterOutputs } from '@trpc/server'

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
      console.log('ctx', ctx.auth.userId)
      const parcel = db
        .insert(parcelDrizzleSchema)
        .values(addUserId(ctx.auth.userId, input))
      return parcel
    }),
  createCheckpoint: protectedProcedure
    .input(insertCheckpointSchema)
    .mutation(({ input }) => {
      const checkpoint = db.insert(checkpointDrizzleSchema).values(input)
      return checkpoint
    }),
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
