import { db } from '@/db/client'

export const getAllVehicles = async () => {
  return db.query.vehicle.findMany()
}

export const getAllVehiclesWithNextNStops = async (n: number) => {
  return db.query.vehicle.findMany({
    with: {
      stops: {
        limit: n,
        where: (stop, { gt }) => gt(stop.arrivalDateTime, new Date()),
        orderBy: (stop, { asc }) => [asc(stop.arrivalDateTime)],
      },
    },
  })
}
