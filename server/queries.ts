import { db } from '@/db/client'

export const getAllVehicles = async () => {
  return db.query.vehicle.findMany()
}

export const getAllVehiclesWithNextNStops = async (n: number) => {
  return db.query.vehicle.findMany({
    with: {
      checkpoints: {
        limit: n,
        where: (checkpoint, { gt }) => gt(checkpoint.start, new Date()),
        orderBy: (checkpoint, { asc }) => [asc(checkpoint.start)],
      },
    },
  })
}
