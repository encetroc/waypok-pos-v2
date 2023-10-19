'use client'

import { type Vehicle } from '@/schema/drizzle'
import { ColumnDef } from '@tanstack/react-table'
import { CalendarDays, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'vehicleType',
    header: 'vehicle',
  },
  {
    accessorKey: 'weight',
    header: 'Weight (kg)',
    cell: ({ row }) => {
      const { weight } = row.original
      return weight / 1000
    },
  },
  {
    header: 'Volume (m3)',
    cell: ({ row }) => {
      const { length, width, height } = row.original
      return (length * width * height) / 1000 / 1000 / 1000
    },
  },
  {
    accessorKey: 'isGrouped',
    header: 'Grouped',
  },
  {
    accessorKey: 'isPublished',
    header: 'Published',
  },
  {
    accessorKey: 'isAutoBook',
    header: 'Autobook',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div>
          <Button title="delete vehicle" variant="ghost" size="icon">
            <Trash2 />
          </Button>
          <Link title="view schedule" href={`/vehicle/stop/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <CalendarDays />
            </Button>
          </Link>
        </div>
      )
    },
  },
]
