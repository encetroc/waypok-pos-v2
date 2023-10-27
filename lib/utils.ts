import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export function transpose<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return []
  const result: T[][] = []
  for (let i = 0; i < arrays[0].length; i++) {
    result.push(arrays.map((array) => array[i]))
  }
  return result
}

export function pickRandom<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function addUserId<T>(userId: string, input: T): T & { userId: string } {
  return { ...input, userId }
}

export function removeTimeFromDate(date: Date): Date {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return new Date(year, month, day)
}

export const formatDateTime = (date: Date | null): string => {
  if (!date) return 'no date'
  return format(date, 'dd/MM/yyyy HH:mm')
}

export const formatDate = (date: Date | null): string => {
  if (!date) return 'no date'
  return format(date, 'dd/MM/yyyy')
}

type Entity = {
  length: number
  width: number
  height: number
  weight: number
  [key: string]: any
}

export function volume(dimensions: Entity): number {
  const { length, width, height } = dimensions
  const volume = (length * width * height) / 1000000000
  return volume
}

export function weight(dimensions: Entity): number {
  const { weight } = dimensions
  return weight / 1000
}

export function percentage(value: number, total: number): number {
  return (value / total) * 100
}
