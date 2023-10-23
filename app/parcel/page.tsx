import { DataTable } from '@/components/common/data-table'
import { CreateParcel } from '@/components/other/create-parcel'
import { columns } from '@/components/other/parcel-columns'
import { H1 } from '@/components/ui/typography'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

export default async function page() {
  const { userId } = auth()
  if (!userId) return
  const parcels = await db.query.parcel.findMany({
    where: (parcel, { eq }) => eq(parcel.userId, userId),
  })
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <H1>create parcel</H1>
        <CreateParcel />
      </div>
      <DataTable data={parcels} columns={columns} />
    </div>
  )
}
