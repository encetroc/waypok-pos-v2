import { DataTable } from '@/components/common/data-table'
import { columns } from '@/components/other/checkpoint-columns'
import { CreateCheckpoint } from '@/components/other/create-checkpoint'
import { H1 } from '@/components/ui/typography'
import { db } from '@/db/client'

type PageProps = {
  params: {
    vehicleId: number
  }
}

export default async function page({ params }: PageProps) {
  const checkpoints = await db.query.checkpoint.findMany({
    where: (checkpoint, { eq }) => eq(checkpoint.vehicleId, params.vehicleId),
  })
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <H1>create checkpoint</H1>
        <CreateCheckpoint vehicleId={params.vehicleId} />
      </div>
      <DataTable data={checkpoints} columns={columns} />
    </div>
  )
}
