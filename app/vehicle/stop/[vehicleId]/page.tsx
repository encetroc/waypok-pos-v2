import { DataTable } from '@/components/common/data-table'
import { CreateStop } from '@/components/other/create-stop'
import { columns } from '@/components/other/stop-columns'
import { H1 } from '@/components/ui/typography'
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
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <H1>create stop</H1>
        <CreateStop vehicleId={params.vehicleId} />
      </div>
      <DataTable data={stops} columns={columns} />
    </div>
  )
}
