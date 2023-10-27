'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { insertCheckpointSchema } from '@/schema/drizzle'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
  type: insertCheckpointSchema.shape.type,
  start: insertCheckpointSchema.shape.start,
  end: insertCheckpointSchema.shape.end,
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
})

type CreateCheckpointProps = {
  vehicleId: number
}

export const CreateCheckpoint = ({ vehicleId }: CreateCheckpointProps) => {
  const router = useRouter()
  const { mutate: createCheckpoint } = trpc.createCheckpoint.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `checkpoint created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating checkpoint',
        description: error.message,
      })
    },
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'exact',
      start: new Date(),
      end: new Date(),
      startHour: 0,
      endHour: 0,
      vehicleId,
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const checkpoint = {
      type: data.type,
      vehicleId: data.vehicleId,
      start: new Date(data.start.setHours(data.startHour)),
      end: new Date(data.end.setHours(data.endHour)),
    }
    createCheckpoint(checkpoint)
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
              <FormLabel>checkpoint type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="select checkpoint type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {insertCheckpointSchema.shape.type.options.map((option) => (
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
        <Button type="submit">create checkpoint</Button>
      </form>
    </Form>
  )
}
