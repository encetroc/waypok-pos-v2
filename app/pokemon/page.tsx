import { CreatePokemon } from '@/components/other/create-pokemon'
import { db } from '@/db/client'

export default async function page() {
  const pokemons = await db.query.pokemon.findMany()
  return (
    <div className="flex flex-col gap-4">
      <CreatePokemon />
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  )
}
