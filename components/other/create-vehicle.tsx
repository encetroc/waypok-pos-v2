'use client'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

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

  return <Button onClick={() => createVehicle({})}>create vehicle</Button>
}
