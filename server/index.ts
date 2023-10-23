import { db } from '@/db/client'
import { addUserId } from '@/lib/utils'
import {
  insertParcelSchema,
  insertPokemonSchema,
  insertStopSchema,
  insertVehicleSchema,
  parcel as parcelDrizzleSchema,
  pokemon as pokemonDrizzleSchema,
  stop as stopDrizzleSchema,
  vehicle as vehicleDrizzleSchema,
} from '@/schema/drizzle'
import { protectedProcedure, publicProcedure, router } from '@/server/trpc'
import { inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  public: publicProcedure.query(() => 'this is a public route'),
  protected: protectedProcedure.query(() => 'this is a protected route'),
  createPokemon: protectedProcedure
    .input(insertPokemonSchema)
    .mutation(async ({ input }) => {
      const pokemon = db.insert(pokemonDrizzleSchema).values(input)
      return pokemon
    }),
  createVehicle: protectedProcedure
    .input(insertVehicleSchema)
    .mutation(({ input, ctx }) => {
      const vehicle = db
        .insert(vehicleDrizzleSchema)
        .values(addUserId(ctx.auth.userId, input))
      return vehicle
    }),
  createStop: protectedProcedure
    .input(insertStopSchema)
    .mutation(({ input }) => {
      const stop = db.insert(stopDrizzleSchema).values(input)
      return stop
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
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
