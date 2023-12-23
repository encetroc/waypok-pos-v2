import { Card } from '@/components/common/card'
import { CreateVehicle } from '@/components/other/create-vehicle'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  if (!userId) return
  const vehicles = await db.query.vehicle.findMany({
    where: (vehicle, { eq }) => eq(vehicle.userId, userId),
  })
  return (
    <div className="flex flex-col gap-4 items-start">
      <CreateVehicle />
      <ul className="flex gap-2 flex-wrap">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <Card>
              <Link
                href={`/vehicle/timeSlot/${vehicle.id}`}
              >{`vehicle ${vehicle.id}`}</Link>
            </Card>
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}
