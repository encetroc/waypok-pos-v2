'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  city: z.string(),
  street: z.string().optional(),
  number: z.string().optional(),
})

export const CreateAddress = () => {
  const router = useRouter()
  const { mutate: createAddress } = trpc.createAddress.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `address created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating address',
        description: error.message,
      })
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      street: '',
      number: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createAddress(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>city</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>street</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">create address</Button>
      </form>
    </Form>
  )
}
