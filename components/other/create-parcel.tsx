'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { insertParcelSchema, type Parcel } from '@/schema/drizzle'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  type: insertParcelSchema.shape.type,
  weight: z.coerce
    .number({
      invalid_type_error: 'weight must be a number.',
    })
    .min(1000, {
      message: 'min 1000',
    })
    .max(100000, {
      message: 'max 100000',
    }),
  length: z.coerce
    .number({
      invalid_type_error: 'length must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    }),
  width: z.coerce
    .number({
      invalid_type_error: 'width must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    }),
  height: z.coerce
    .number({
      invalid_type_error: 'height must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    }),
  isGrouped: insertParcelSchema.shape.isGrouped,
  isPublished: insertParcelSchema.shape.isPublished,
  isAutoBook: insertParcelSchema.shape.isAutoBook,
})

export const CreateParcel = () => {
  const router = useRouter()
  const { mutate: createParcel } = trpc.createParcel.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `Parcel created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating parcel',
        description: error.message,
      })
    },
  })

  const form = useForm<Omit<Parcel, 'id'>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 1000,
      length: 100,
      width: 100,
      height: 100,
      isGrouped: false,
      isPublished: true,
      isAutoBook: true,
    },
  })

  const onSubmit = (data: Omit<Parcel, 'id'>) => {
    createParcel(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>parcel type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="select parcel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {insertParcelSchema.shape.type.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name={'weight'}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>weight (g)</FormLabel>
                <FormControl>
                  <Input placeholder={'weight (g)'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'length'}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>length (mm)</FormLabel>
                <FormControl>
                  <Input placeholder={'length (mm)'} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'width'}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>width (mm)</FormLabel>
                <FormControl>
                  <Input placeholder={'width (mm)'} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'height'}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>height (mm)</FormLabel>
                <FormControl>
                  <Input placeholder={'height (mm)'} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isGrouped"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>is grouped</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>is published</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAutoBook"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>is autobook</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">
          submit
        </Button>
      </form>
    </Form>
  )
}
