/* eslint-disable @next/next/no-img-element */
import { clerkClient } from '@clerk/nextjs'

type UserProps = {
  entity: {
    userId: string
    [key: string]: any
  }
}

export const User = async ({ entity }: UserProps) => {
  const user = await clerkClient.users.getUser(entity.userId)

  return (
    <div className="flex gap-2 items-center">
      <img
        className="rounded-full overflow-hidden"
        width={24}
        height={24}
        src={user.imageUrl}
        alt="user image"
      />
      <span>{user.firstName}</span>
    </div>
  )
}
