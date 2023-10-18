import { DataTable } from '@/components/common/data-table'
import { CreateVehicle } from '@/components/other/create-vehicle'
import { columns } from '@/components/other/vahicle-columns'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

export default async function page() {
  const { userId } = auth()
  if (!userId) return
  const vehicles = await db.query.vehicle.findMany({
    where: (vehicle, { eq }) => eq(vehicle.userId, userId),
    with: { stops: true },
  })
  return (
    <div>
      <CreateVehicle />
      <DataTable data={vehicles} columns={columns} />
    </div>
  )
}
