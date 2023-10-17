import { db } from '@/db/client'
import {
  insertPokemonSchema,
  pokemon as pokemonDrizzleSchema,
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
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
