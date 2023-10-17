import { db } from '@/db/client'
import { pokemon as pokemonDrizzleSchema } from '@/schema/drizzle'
import { protectedProcedure, publicProcedure, router } from '@/server/trpc'
import { inferRouterOutputs } from '@trpc/server'
import z from 'zod'

export const appRouter = router({
  public: publicProcedure.query(() => 'this is a public route'),
  protected: protectedProcedure.query(() => 'this is a protected route'),
  createPokemon: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const pokemon = db.insert(pokemonDrizzleSchema).values(input)
      return pokemon
    }),
})

type RouterOutput = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
