import { Card } from '@/components/common/card'
import { User } from '@/components/other/user'
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
    where: (vehicle, { ne }) => ne(vehicle.userId, userId),
  })
  return (
    <div className="flex flex-col gap-4 items-start">
      <ul className="flex gap-2 flex-wrap">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <Card>
              <Link
                href={`/browse/vehicle/timeSlot/${vehicle.id}`}
              >{`vehicle ${vehicle.id}`}</Link>
              <User entity={vehicle} />
            </Card>
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}
