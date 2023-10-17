import { z } from 'zod'

export const PokemonSchema = z.object({
  name: z.string().min(2, {
    message: 'Pokemon name must be at least 2 characters.',
  }),
})
