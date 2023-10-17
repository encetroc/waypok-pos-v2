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
import { PokemonSchema } from '@/schema/form'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'

export function CreatePokemon() {
  const router = useRouter()
  const { mutate: createPokemon } = trpc.createPokemon.useMutation({
    onSuccess(data) {
      toast({
        title: 'Success!',
        description: `Pokemon created`,
      })
      router.refresh()
    },
  })

  const form = useForm<z.infer<typeof PokemonSchema>>({
    resolver: zodResolver(PokemonSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof PokemonSchema>) {
    createPokemon(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pokemon name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
