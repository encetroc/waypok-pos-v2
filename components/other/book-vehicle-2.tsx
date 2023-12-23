'use client'

// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatAddress, formatDateTime } from '@/lib/utils'
import { Address, TimeSlot, TimeSlotAddress, Vehicle } from '@/schema/drizzle'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

type BookVehicleProps = {
  vehicles: (Vehicle & {
    timeSlots: (TimeSlot & {
      timeSlotAddresses: (TimeSlotAddress & {
        address: Address
      })[]
    })[]
  })[]
}

const formSchema = z.object({
  vehicleId: z.coerce.number(),
  timeSlotIdLoad: z.coerce.number(),
  addressIdload: z.coerce.string(),
})

export const BookVehicle = ({ vehicles }: BookVehicleProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      vehicleId: vehicles[0].id,
    },
  })

  const timeSlotsLoad = vehicles.find(
    (vehicle) => vehicle.id == form.watch('vehicleId')
  )?.timeSlots

  console.log(timeSlotsLoad)

  const addressesload = timeSlotsLoad
    ?.find((timeSlot) => timeSlot.id == form.watch('timeSlotIdLoad'))
    ?.timeSlotAddresses.map((timeSlotAddress) => timeSlotAddress.address)

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>select vehicle</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className="flex gap-2"
                >
                  {vehicles.map((vehicle) => (
                    <FormItem
                      key={vehicle.id}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={String(vehicle.id)}
                          className="flex flex-col gap-2 p-4 border rounded-md data-[state=checked]:bg-primary"
                        >
                          {`vehicle ${vehicle.id}`}
                        </RadioGroupItem>
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!timeSlotsLoad?.length && (
          <FormField
            control={form.control}
            name="timeSlotIdLoad"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>select time slot to load parcel</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    className="flex gap-2 flex-wrap"
                  >
                    {timeSlotsLoad.map((timeSlot) => (
                      <FormItem
                        key={timeSlot.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={String(timeSlot.id)}
                            className="flex flex-col gap-2 p-4 border rounded-md data-[state=checked]:bg-primary"
                          >
                            {`slot ${timeSlot.id}`}
                            <ul>
                              <li>{`start ${formatDateTime(
                                timeSlot.start
                              )}`}</li>
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
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!!addressesload?.length && (
          <FormField
            control={form.control}
            name="addressIdload"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>select address to load parcel</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    className="flex gap-2 flex-wrap"
                  >
                    {addressesload.map((address) => (
                      <FormItem
                        key={address.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={String(address.id)}
                            className="flex flex-col gap-2 p-4 border rounded-md data-[state=checked]:bg-primary"
                          >
                            {formatAddress(address)}
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">submit</Button>
      </form>
    </Form>
  )
}
