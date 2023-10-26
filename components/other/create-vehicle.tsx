'use client'
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  type: z.enum(['van', 'truck', 'car']),
  weight: z.coerce
    .number({
      invalid_type_error: 'weight must be a number.',
    })
    .min(1000, {
      message: 'min 1000',
    })
    .max(100000, {
      message: 'max 100000',
    })
    .default(1000)
    .describe('weight in grams'),
  length: z.coerce
    .number({
      invalid_type_error: 'length must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    })
    .default(100)
    .describe('length in mm'),
  width: z.coerce
    .number({
      invalid_type_error: 'width must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    })
    .default(100)
    .describe('width in mm'),
  height: z.coerce
    .number({
      invalid_type_error: 'height must be a number.',
    })
    .min(100, {
      message: 'min 100',
    })
    .max(5000, {
      message: 'max 5000',
    })
    .default(100)
    .describe('height in mm'),
  isGrouped: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  isAutobook: z.boolean().optional().default(true),
})

export function CreateVehicle() {
  const router = useRouter()
  const { mutate: createVehicle } = trpc.createVehicle.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `Vehicle created`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error creating vehicle',
        description: error.message,
      })
    },
  })
  return (
    <AutoForm
      onSubmit={(data) => {
        createVehicle(data)
      }}
      formSchema={formSchema}
    >
      <AutoFormSubmit>create</AutoFormSubmit>
    </AutoForm>
  )
}
