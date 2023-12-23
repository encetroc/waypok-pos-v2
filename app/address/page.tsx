import { Card } from '@/components/common/card'
import { CreateAddress } from '@/components/other/create-address'
import { db } from '@/db/client'
import { auth } from '@clerk/nextjs'

export default async function page() {
  const { userId } = auth()
  if (!userId) return
  const addresses = await db.query.address.findMany({
    where: (address, { eq }) => eq(address.userId, userId),
  })
  return (
    <div className="flex flex-col gap-4 items-start">
      <CreateAddress />
      <ul className="flex gap-2 flex-wrap">
        {addresses.map((address) => (
          <li key={address.id}>
            <Card>{`${address.number} ${address.street}, ${address.city}`}</Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
