import { Card } from '@/components/common/card'
import { db } from '@/db/client'
import { formatAddress, formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs'

type PageProps = {
  params: {
    vehicleId: number
  }
}

export default async function page({ params }: PageProps) {
  const { userId } = auth()
  if (!userId) return
  const timeSlots = await db.query.timeSlot.findMany({
    where: (timeSlot, { eq }) => eq(timeSlot.vehicleId, params.vehicleId),
    with: {
      timeSlotAddresses: {
        with: {
          address: true,
        },
      },
    },
  })

  return (
    <>
      time slots for vehicle {params.vehicleId}
      <ul className="flex gap-2 flex-wrap">
        {timeSlots.map((timeSlot) => (
          <li key={timeSlot.id}>
            <Card>
              {`slot ${timeSlot.id}`}
              <ul>
                <li>{`start ${formatDateTime(timeSlot.start)}`}</li>
                <li>{`end ${formatDateTime(timeSlot.end)}`}</li>
              </ul>
              <ul>
                {timeSlot.timeSlotAddresses.map(
                  (timeSlotAddress, index: number) => (
                    <li key={timeSlotAddress.id}>
                      {`address #${index + 1} ${formatAddress(
                        timeSlotAddress.address
                      )}`}
                    </li>
                  )
                )}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
