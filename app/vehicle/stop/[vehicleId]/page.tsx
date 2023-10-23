import { DataTable } from '@/components/common/data-table'
import { CreateStop } from '@/components/other/create-stop'
import { columns } from '@/components/other/stop-columns'
import { db } from '@/db/client'

type PageProps = {
  params: {
    vehicleId: number
  }
}

export default async function page({ params }: PageProps) {
  const stops = await db.query.stop.findMany({
    where: (stop, { eq }) => eq(stop.vehicleId, params.vehicleId),
    orderBy: (stops, { asc }) => [asc(stops.arrivalDateTime)],
  })
  return (
    <div>
      <CreateStop vehicleId={params.vehicleId} />
      <DataTable data={stops} columns={columns} />
    </div>
  )
}
