import { BookVehicle } from '@/components/other/book-vehicle'
import { VehicleCard } from '@/components/other/vehicle-card'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

type PageProps = {
  params: {
    vehicleId: number
  }
  searchParams: {
    parcelId?: number
  }
}

export default async function page({ params, searchParams }: PageProps) {
  const { userId } = auth()
  if (!userId) return null
  const vehicle = await db.query.vehicle.findFirst({
    where: (vehicle, { eq }) => eq(vehicle.id, params.vehicleId),
    with: {
      stops: {
        where: (stop, { gt }) => gt(stop.arrivalDateTime, new Date()),
        orderBy: (stop, { asc }) => [asc(stop.arrivalDateTime)],
      },
    },
  })

  const parcels = await db.query.parcel.findMany({
    where: (parcel, { eq }) => eq(parcel.userId, userId),
  })

  if (!vehicle) return null

  return (
    <div>
      <VehicleCard vehicle={vehicle} showStops={false} />
      <BookVehicle stops={vehicle.stops} parcels={parcels} />
    </div>
  )
}
