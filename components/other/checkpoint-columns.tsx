'use client'

import { formatDateTime } from '@/lib/utils'
import { type Checkpoint } from '@/schema/drizzle'
import { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export const columns: ColumnDef<Checkpoint>[] = [
  {
    accessorKey: 'type',
    header: 'type',
  },
  {
    accessorKey: 'start',
    header: 'start',
    cell: ({ row }) => {
      return formatDateTime(row.original.start)
    },
  },
  {
    accessorKey: 'end',
    header: 'end',
    cell: ({ row }) => {
      return formatDateTime(row.original.end)
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
