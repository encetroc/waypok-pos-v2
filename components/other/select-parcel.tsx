'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { volume, weight } from '@/lib/utils'
import { type Parcel } from '@/schema/drizzle'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SelectParcelProps = {
  parcels: Parcel[]
}

export const SelectParcel = ({ parcels }: SelectParcelProps) => {
  const router = useRouter()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const parcelId = searchParams.get('parcelId') ?? ''

  return (
    <Select
      onValueChange={(value) =>
        router.replace(`${currentPath}?parcelId=${value}`)
      }
      value={parcelId}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a parcel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>parcel</SelectLabel>
          {parcels.map((parcel) => (
            <SelectItem key={parcel.id} value={parcel.id.toString()}>
              {`${parcel.type}, ${weight(parcel)}kg, ${volume(parcel)}m3`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
