import { ModeToggle } from '@/components/other/mode-toggle'
import { UserButton } from '@clerk/nextjs'

export default async function page() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
