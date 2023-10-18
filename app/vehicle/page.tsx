import { CreateVehicle } from '@/components/other/create-vehicle'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

export default async function page() {
  const { userId } = auth()
  if (!userId) return
  const vehicles = await db.query.vehicle.findMany({
    where: (vehicle, { eq }) => eq(vehicle.userId, userId),
    with: { stops: true },
  })
  console.log(vehicles)
  return <CreateVehicle />
}
