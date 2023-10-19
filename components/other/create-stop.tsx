'use client'
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { toast } from '../ui/use-toast'

type CreateStopProps = {
  vehicleId: number
}

export function CreateStop({ vehicleId }: CreateStopProps) {
  const formSchema = z.object({
    address: z.string({
      required_error: 'Address is required.',
    }),
    arrivalDateTime: z.coerce.date(),
    arrivalHour: z.coerce.number().min(0).max(23).default(0),
    departureDateTime: z.coerce.date(),
    departureHour: z.coerce.number().min(0).max(23).default(0),
    vehicleId: z.coerce.number().default(vehicleId),
  })

  const router = useRouter()
  const { mutate: createStop } = trpc.createStop.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `Stop created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating stop',
        description: error.message,
      })
    },
  })
  return (
    <AutoForm
      onSubmit={(data) => {
        createStop({
          ...data,
          arrivalDateTime: new Date(
            data.arrivalDateTime.setHours(data.arrivalHour)
          ),
          departureDateTime: new Date(
            data.departureDateTime.setHours(data.departureHour)
          ),
        })
      }}
      formSchema={formSchema}
      fieldConfig={{
        vehicleId: {
          inputProps: {
            disabled: true,
          },
        },
      }}
    >
      <AutoFormSubmit>create</AutoFormSubmit>
    </AutoForm>
  )
}
