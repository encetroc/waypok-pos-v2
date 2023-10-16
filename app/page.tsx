import { ModeToggle } from '@/components/other/mode-toggle'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
