'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { type Stop } from '@/schema/drizzle'
import { useCalendar } from '@h6s/calendar'
import {
  add,
  compareAsc,
  differenceInDays,
  format,
  getDate,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from 'date-fns'

type StopCalendarProps = {
  stops: Stop[]
}

export const StopCalendar = ({ stops }: StopCalendarProps) => {
  const { headers, body, view } = useCalendar()

  const stopsInCalendar = stops.map((stop) => {
    if (isSameDay(stop.arrivalDateTime, stop.departureDateTime)) {
      return [{ date: stop.arrivalDateTime, type: 'standalone' }]
    }
    const daysDifference =
      differenceInDays(stop.departureDateTime, stop.arrivalDateTime) + 1
    return Array.from({ length: daysDifference }).map((_, index) => {
      if (index === 0) return { date: stop.arrivalDateTime, type: 'start' }
      if (index === daysDifference - 1)
        return { date: stop.departureDateTime, type: 'end' }
      return {
        date: add(stop.arrivalDateTime, { days: index }),
        type: 'middle',
      }
    })
  })

  const getDayStyle = (type: string | undefined) => {
    switch (type) {
      case 'start':
        return 'bg-primary rounded-l-full'
      case 'end':
        return 'bg-primary rounded-r-full'
      case 'middle':
        return 'bg-primary'
      case 'standalone':
        return 'bg-primary rounded-full'
      default:
        return ''
    }
  }

  const CalendarWithRows = ({ row }: { row: number }) => {
    const rows = [
      '-translate-x-[0]',
      '-translate-x-[280px]',
      '-translate-x-[560px]',
      '-translate-x-[840px]',
      '-translate-x-[1120px]',
    ]
    return (
      <div className="w-[280px] overflow-x-clip">
        <div className={cn('relative w-[1400px]', rows[row])}>
          <div className="absolute w-full h-full grid grid-rows-1 grid-cols-35">
            {stops
              .sort((a, b) => compareAsc(a.arrivalDateTime, b.arrivalDateTime))
              .map((stop) => {
                const span =
                  differenceInDays(
                    stop.departureDateTime,
                    stop.arrivalDateTime
                  ) + 1

                const day = stop.arrivalDateTime.getDate()

                const monthStart = body.value
                  .flatMap((week) => week.value)[0]
                  .value.getDate()

                const start = day - monthStart + 1

                return (
                  <Popover key={stop.id}>
                    <PopoverTrigger
                      className="hover:bg-primary/20 bg-primary/10 h-10 rounded-full"
                      style={{
                        gridColumnStart: `${start}`,
                        gridColumnEnd: `span ${span}`,
                      }}
                    ></PopoverTrigger>
                    <PopoverContent>
                      Place content for the popover here.
                    </PopoverContent>
                  </Popover>
                )
              })}
          </div>
          <div className="grid grid-cols-35">
            {body.value
              .flatMap((week) => week.value)
              .map(({ key, value }) => (
                <div
                  key={key}
                  className="w-10 h-10 flex justify-center items-center"
                >
                  {getDate(value)}
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  type Day = {
    type: 'day' | 'event'
    day: Date
    start: number
    span: number
    stop?: Stop
  }

  const days = body.value.flatMap((week) => week.value)

  const newDays = days.reduce((acc, day, index) => {
    const stop = stops.find((stop) =>
      isWithinInterval(day.value, {
        start: startOfDay(stop.arrivalDateTime),
        end: stop.departureDateTime,
      })
    )

    if (!stop) {
      acc.push({ type: 'day', day: day.value, span: 1, start: index + 1 })
      return acc
    }

    if (
      !isSameDay(stop.arrivalDateTime, stop.departureDateTime) &&
      isWithinInterval(day.value, {
        start: stop.arrivalDateTime,
        end: stop.departureDateTime,
      })
    ) {
      return acc
    }

    let span = 1

    if (!isSameDay(stop.departureDateTime, stop.arrivalDateTime))
      span = differenceInDays(stop.departureDateTime, stop.arrivalDateTime) + 1

    acc.push({
      type: 'event',
      day: stop.arrivalDateTime,
      start: index + 1,
      span,
      stop,
    })

    return acc
  }, [] as Day[])

  const Calendar = () => {
    return (
      <div className="w-full overflow-x-scroll">
        <div className={cn('relative w-[1400px]')}>
          <div className="grid grid-cols-35">
            {newDays.map((day) => {
              if (day.type === 'day')
                return (
                  <Popover key={day.day.toDateString()}>
                    <PopoverTrigger className="w-10 h-10 flex justify-center items-center">
                      {day.day.getDate()}
                    </PopoverTrigger>
                    <PopoverContent>{day.day.getDate()}</PopoverContent>
                  </Popover>
                )
              return (
                <Popover key={day.stop?.id}>
                  <PopoverTrigger
                    className="hover:bg-primary/20 bg-primary/10 h-10 w-full rounded-full"
                    style={{
                      gridColumnStart: `${day.start}`,
                      gridColumnEnd: `span ${day.span}`,
                    }}
                  >
                    {day.day.getDate()}
                  </PopoverTrigger>
                  <PopoverContent>{day.day.getDate()}</PopoverContent>
                </Popover>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const CalendarOneRow = () => {
    return (
      <div className="w-full overflow-x-scroll">
        <div className={cn('relative w-[1400px]')}>
          <div className="absolute w-full h-full grid grid-rows-1 grid-cols-35">
            {stops
              .sort((a, b) => compareAsc(a.arrivalDateTime, b.arrivalDateTime))
              .map((stop) => {
                const span =
                  differenceInDays(
                    stop.departureDateTime,
                    stop.arrivalDateTime
                  ) + 1

                const day = stop.arrivalDateTime.getDate()

                const monthStart = body.value
                  .flatMap((week) => week.value)[0]
                  .value.getDate()

                const start = day - monthStart + 1

                return (
                  <Popover key={stop.id}>
                    <PopoverTrigger
                      className="hover:bg-primary/20 bg-primary/10 h-10 rounded-full"
                      style={{
                        gridColumnStart: `${start}`,
                        gridColumnEnd: `span ${span}`,
                      }}
                    ></PopoverTrigger>
                    <PopoverContent>
                      Place content for the popover here.
                    </PopoverContent>
                  </Popover>
                )
              })}
          </div>
          <div className="grid grid-cols-35">
            {body.value
              .flatMap((week) => week.value)
              .map(({ key, value }) => (
                <Popover key={key}>
                  <PopoverTrigger className="w-10 h-10 flex justify-center items-center">
                    {getDate(value)}
                  </PopoverTrigger>
                  <PopoverContent>
                    Place content for the popover here.
                  </PopoverContent>
                </Popover>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Calendar />
      {/* <CalendarOneRow /> */}
      {/* <div className="relative">
        <div className="w-full h-full absolute grid grid-cols-7 grid-rows-5">
          <div className="border-2 rounded-full row-start-2 col-start-7 col-span-2"></div>
        </div>
        <div className="grid grid-cols-7 grid-rows-5">
          {body.value
            .flatMap((week) => week.value)
            .map(({ key, value }) => (
              <div key={key} className="flex justify-center items-center">
                {getDate(value)}
              </div>
            ))}
        </div>
      </div> */}
      {/* {Array(5)
        .fill(0)
        .map((_, index) => (
          <CalendarWithRows key={index} row={index} />
        ))} */}
      <table>
        <thead>
          <tr className="flex">
            {headers.weekDays.map(({ key, value }) => {
              return (
                <th
                  key={key}
                  className="flex justify-center items-center w-10 h-10"
                >
                  {format(value, 'E')}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {body.value.map(({ key, value: days }) => (
            <tr key={key} className="flex">
              {days.map(({ key, value }) => {
                const event = stopsInCalendar
                  .flat(1)
                  .find((event) => isSameDay(event.date, value))
                return (
                  <td
                    key={key}
                    className={cn(
                      'flex justify-center items-center w-10 h-10',
                      getDayStyle(event?.type)
                    )}
                  >
                    {getDate(value)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
