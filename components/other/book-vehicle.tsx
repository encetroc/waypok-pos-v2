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
import { formatDateTime, volume, weight } from '@/lib/utils'
import { type Parcel, type Stop } from '@/schema/drizzle'
import { useState } from 'react'
import { Button } from '../ui/button'

type BookVehicleProps = {
  stops: Stop[]
  parcels: Parcel[]
}

export const BookVehicle = ({ stops, parcels }: BookVehicleProps) => {
  const [parcelId, setParcelId] = useState<number | null>(null)
  const [bookState, setBookState] = useState<'load' | 'unload'>('load')
  const [loadStopId, setLoadStopId] = useState<number | null>(null)
  const [unloadStopId, setUnloadStopId] = useState<number | null>(null)

  const handleBook = (stopId: number) => {
    if (bookState === 'load') {
      setLoadStopId(stopId)
      setBookState('unload')
    } else {
      setUnloadStopId(stopId)
      setBookState('load')
    }
    console.log('bookState', stopId, parcelId)
  }

  const handleCancel = () => {
    setLoadStopId(null)
    setUnloadStopId(null)
    setBookState('load')
  }

  return (
    <>
      <Select
        onValueChange={(value) => setParcelId(parseInt(value))}
        value={parcelId?.toString()}
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
      <ul className="flex flex-col gap-2">
        {loadStopId && unloadStopId ? (
          <ul>
            <li>{`load at ${loadStopId}`}</li>
            <li>{`unload at ${unloadStopId}`}</li>
            <Button>book</Button>
            <Button onClick={handleCancel}>cancel</Button>
          </ul>
        ) : (
          stops
            .filter((stop) => {
              const loadStop = stops.find((stop) => stop.id === loadStopId)
              if (!loadStop) return true
              return stop.arrivalDateTime > loadStop.arrivalDateTime
            })
            .map((stop) => {
              if (stop.id === loadStopId || stop.id === unloadStopId)
                return null
              return (
                <li key={stop.id}>
                  {`${stop.address}, in: ${formatDateTime(
                    stop.arrivalDateTime
                  )}, out: ${formatDateTime(stop.departureDateTime)}`}
                  {parcelId && (
                    <Button onClick={() => handleBook(stop.id)}>
                      {bookState === 'load' ? 'load' : 'unload'} parcel
                    </Button>
                  )}
                </li>
              )
            })
        )}
      </ul>
    </>
  )
}
