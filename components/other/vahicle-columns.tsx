'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { selectVehicleSchema } from '@/schema/drizzle'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '../ui/button'

type Vehicle = z.infer<typeof selectVehicleSchema>

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'vehicleType',
    header: 'vehicle',
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
  },
  {
    accessorKey: 'length',
    header: 'Length',
  },
  {
    accessorKey: 'width',
    header: 'Width',
  },
  {
    accessorKey: 'height',
    header: 'Height',
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/vehicle/edit/${row.original.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/stop/${row.original.id}`}>Schedule</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
