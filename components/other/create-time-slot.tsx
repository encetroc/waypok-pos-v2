'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { Address, insertTimeSlotSchema } from '@/schema/drizzle'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { setHours } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  start: insertTimeSlotSchema.shape.start,
  end: insertTimeSlotSchema.shape.end,
  startHour: z.coerce
    .number({
      invalid_type_error: 'start time must be a number.',
    })
    .min(0, {
      message: 'min 0',
    })
    .max(23, {
      message: 'max 23',
    }),
  endHour: z.coerce
    .number({
      invalid_type_error: 'end time must be a number.',
    })
    .min(0, {
      message: 'min 0',
    })
    .max(23, {
      message: 'max 23',
    }),
  vehicleId: z.coerce.number().positive(),
  addresses: z.array(
    z.object({
      id: z.coerce.number().gt(0, 'Select a word or delete.'),
    })
  ),
})

type CreateCheckpointProps = {
  vehicleId: number
  addresses: Address[]
}

export const CreateTimeSlot = ({
  vehicleId,
  addresses,
}: CreateCheckpointProps) => {
  const router = useRouter()
  const { mutate: createTimeSlot } = trpc.createTimeSlot.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `time slot created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating time slot',
        description: error.message,
      })
    },
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: new Date(),
      end: new Date(),
      startHour: 0,
      endHour: 0,
      vehicleId,
      addresses: [{ id: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    const timeSlot = {
      vehicleId: data.vehicleId,
      addresses: data.addresses,
      start: setHours(data.start, data.startHour),
      end: setHours(data.end, data.endHour),
    }
    createTimeSlot(timeSlot)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel>start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={'outline'}>
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(value) => {
                        if (!value) return
                        field.onChange(value)
                        form.setValue('end', value)
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startHour"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>start hour</FormLabel>
                <FormControl>
                  <Input placeholder="start hour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel>end date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={'outline'}>
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < form.watch('start')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endHour"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>end hour</FormLabel>
                <FormControl>
                  <Input placeholder="end hour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-end">
            <FormField
              control={form.control}
              name={`addresses.${index}.id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`address ${index}`}</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select at least one address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={String(address.id)}>
                          {address.number} {address.street}, {address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                remove(index)
              }}
            >
              remove address
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            append({ id: 0 })
          }}
        >
          add address
        </Button>

        <Button type="submit">create time slot</Button>
      </form>
    </Form>
  )
}
