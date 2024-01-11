'use client'

// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatAddress, formatDateTime } from '@/lib/utils'
import {
  Address,
  Parcel,
  TimeSlot,
  TimeSlotAddress,
  Vehicle,
  operations,
} from '@/schema/drizzle'
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
  parcels: Parcel[]
}

const formSchema = z.object({
  vehicleId: z.coerce.number(),
  timeSlotIdLoad: z.coerce.number(),
  addressId: z.coerce.string(),
  operation: z.enum(operations),
  parcelId: z.coerce.number(),
})

export const BookVehicle = ({ vehicles, parcels }: BookVehicleProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      vehicleId: vehicles[0].id,
    },
  })

  const timeSlotsLoad = vehicles.find(
    (vehicle) => vehicle.id == form.watch('vehicleId')
  )?.timeSlots

  const addressesload = timeSlotsLoad
    ?.find((timeSlot) => timeSlot.id == form.watch('timeSlotIdLoad'))
    ?.timeSlotAddresses.map((timeSlotAddress) => timeSlotAddress.address)

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
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
          <>
            <FormField
              control={form.control}
              name="addressId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>select an address</FormLabel>
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
            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>load/unload</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select at least one address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operations.map((operation) => (
                        <SelectItem key={operation} value={operation}>
                          {operation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parcelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>parcel</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select at parcel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parcels.map((parcel) => (
                        <SelectItem
                          key={parcel.id}
                          value={parcel.id.toString()}
                        >
                          {`parcel ${parcel.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit">submit</Button>
      </form>
    </Form>
  )
}
