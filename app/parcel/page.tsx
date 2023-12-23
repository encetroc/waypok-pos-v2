import { Card } from '@/components/common/card'
import { CreateParcel } from '@/components/other/create-parcel'
import { db } from '@/db/client'

export default async function page() {
  const parcels = await db.query.parcel.findMany()
  return (
    <div className="flex flex-col gap-4 items-start">
      <CreateParcel />
      <ul className="flex gap-2">
        {parcels.map((parcel) => (
          <li key={parcel.id}>
            <Card>{`parcel ${parcel.id}`}</Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
