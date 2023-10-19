'use client'

import { formatDateTime } from '@/lib/utils'
import { type Stop } from '@/schema/drizzle'
import { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export const columns: ColumnDef<Stop>[] = [
  {
    accessorKey: 'address',
    header: 'address',
  },
  {
    accessorKey: 'arrivalDateTime',
    header: 'arrivalDateTime',
    cell: ({ row }) => {
      return formatDateTime(row.original.arrivalDateTime)
    },
  },
  {
    accessorKey: 'departureDateTime',
    header: 'departureDateTime',
    cell: ({ row }) => {
      return formatDateTime(row.original.departureDateTime)
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div>
          <Button title="edit" variant="ghost" size="icon">
            <Trash2 />
          </Button>
        </div>
      )
    },
  },
]
