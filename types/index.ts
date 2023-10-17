type Parcel = {
  id: string
  weight: number
  length: number
  width: number
  height: number
  reference: string
  type: 'pallet' | 'box' | 'envelope'
  isPublished: boolean
  isAutoBook: boolean
}

type Operation = {
  parcel: Parcel
  Stop: Stop
  operation: 'load' | 'unload'
}

type Stop = {
  id: string
  address: string
  shippments: Operation[]
} & (exactDateTime | betweenDateTime)

type exactDateTime = {
  arrivalDateTime: Date
  departureDateTime: Date
}

type betweenDateTime = {
  startDateTime: Date
  endDateTime: Date
}

type Vehicle = {
  id: string
  userId: string
  schedule: Stop[]
  transportationType: 'grouped' | 'individual'
  description: string | null
  Reference: string
  vehicleType: 'van' | 'truck' | 'car'
  weight: number
  length: number
  width: number
  height: number
  isPublished: boolean
  isAutoBook: boolean
}
