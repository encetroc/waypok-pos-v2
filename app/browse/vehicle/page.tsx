import { VehicleCard } from '@/components/other/vehicle-card'
import { H1 } from '@/components/ui/typography'
import { getAllVehiclesWithNextNStops } from '@/server/queries'

export default async function page() {
  const vehicles = await getAllVehiclesWithNextNStops(2)
  return (
    <div className="flex flex-col gap-6">
      <H1>all vehicles</H1>
      <ul className="grid grid-cols-fluid gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </ul>
    </div>
  )
}
