import { db } from '@/db/client'

export default async function Home() {
  const result = await db.query.user.findMany()
  console.log(result)
  return <div>{process.env.TEST}</div>
}
