'use client'

import { formatDateTime } from '@/lib/utils'
import { type Stop } from '@/schema/drizzle'
import { useCalendar } from '@h6s/calendar'
import { add, differenceInDays, format, getDate, isSameDay } from 'date-fns'

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

  console.log(stopsInCalendar.flat(1))

  return (
    <>
      <ul>
        {stops.map((stop) => (
          <li key={stop.id}>{`${stop.address}, in:${formatDateTime(
            stop.arrivalDateTime
          )}h, out:${formatDateTime(stop.departureDateTime)}h`}</li>
        ))}
      </ul>
      <table>
        <thead>
          <tr>
            {headers.weekDays.map(({ key, value }) => {
              return <th key={key}>{format(value, 'E')}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {body.value.map(({ key, value: days }) => (
            <tr key={key}>
              {days.map(({ key, value }) => {
                const event = stopsInCalendar
                  .flat(1)
                  .find((event) => isSameDay(event.date, value))
                if (event) {
                  switch (event.type) {
                    case 'start':
                      return (
                        <td key={key} className="bg-primary rounded-l-full">
                          {getDate(value)}
                        </td>
                      )
                    case 'end':
                      return (
                        <td key={key} className="bg-primary rounded-r-full">
                          {getDate(value)}
                        </td>
                      )
                    case 'middle':
                      return (
                        <td key={key} className="bg-primary">
                          {getDate(value)}
                        </td>
                      )
                    case 'standalone':
                      return (
                        <td key={key} className="bg-primary rounded-full">
                          {getDate(value)}
                        </td>
                      )
                  }
                }
                return <td key={key}>{getDate(value)}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
