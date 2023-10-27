/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button'
import { formatDateTime, volume, weight } from '@/lib/utils'
import { type Checkpoint, type Vehicle } from '@/schema/drizzle'
import { clerkClient } from '@clerk/nextjs'
import Link from 'next/link'
import { H3 } from '../ui/typography'

type VehicleCardProps = {
  vehicle: Vehicle & {
    checkpoints: Checkpoint[]
  }
  showStops?: boolean
}

export const VehicleCard = async ({
  vehicle,
  showStops = true,
}: VehicleCardProps) => {
  const user = await clerkClient.users.getUser(vehicle.userId)
  return (
    <div className="flex flex-col p-4 gap-2 border rounded-lg">
      <div>
        <H3>{`${vehicle.type} (id:${vehicle.id})`}</H3>
        <div className="flex gap-2 items-center">
          <img
            className="rounded-full overflow-hidden"
            width={24}
            height={24}
            src={user.imageUrl}
            alt="user image"
          />
          <span>{user.firstName}</span>
        </div>
      </div>
      <ul>
        <li>{`volume 0/${volume(vehicle)} mm3`}</li>
        <li>{`weight 0/${weight(vehicle)} kg`}</li>
        {showStops &&
          (vehicle.checkpoints.length ? (
            vehicle.checkpoints.map((checkpoint) => (
              <li key={checkpoint.id}>
                next checkpoint: {formatDateTime(checkpoint.start)}
              </li>
            ))
          ) : (
            <li>no checkpoints scheduled</li>
          ))}
      </ul>
      <Button className="self-end" variant="link">
        <Link href={`/browse/vehicle/${vehicle.id}`}>view</Link>
      </Button>
    </div>
  )
}
