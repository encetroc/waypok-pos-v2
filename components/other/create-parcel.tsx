'use client'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

export function CreateParcel() {
  const router = useRouter()
  const { mutate: createparcel } = trpc.createParcel.useMutation({
    onSuccess() {
      toast({
        title: 'Success!',
        description: `parcel created`,
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

  return <Button onClick={() => createparcel({})}>create parcel</Button>
}
