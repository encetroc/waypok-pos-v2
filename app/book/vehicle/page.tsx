import { BookVehicle } from '@/components/other/book-vehicle-2'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

export default async function page() {
  const { userId } = auth()
  if (!userId) return
  const vehicles = await db.query.vehicle.findMany({
    where: (vehicle, { ne }) => ne(vehicle.userId, userId),
    with: {
      timeSlots: {
        where: (TimeSlot, { gte }) => gte(TimeSlot.start, new Date()),
        with: {
          timeSlotAddresses: {
            with: {
              address: true,
            },
          },
        },
      },
    },
  })

  console.log(vehicles)

  return (
    <div>
      <BookVehicle vehicles={vehicles} />
    </div>
  )
}
