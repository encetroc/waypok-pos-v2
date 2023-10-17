'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { insertPokemonSchema } from '@/schema/drizzle'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'

export function CreatePokemon() {
  const router = useRouter()
  const { mutate: createPokemon } = trpc.createPokemon.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `Pokemon created`,
      })
      form.reset()
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating pokemon',
        description: error.message,
      })
    },
  })

  const form = useForm<z.infer<typeof insertPokemonSchema>>({
    resolver: zodResolver(insertPokemonSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof insertPokemonSchema>) {
    createPokemon(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pokemon name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="pokemon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
