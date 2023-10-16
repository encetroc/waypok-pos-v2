import { clsx, type ClassValue } from 'clsx'
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
