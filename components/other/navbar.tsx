import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ModeToggle } from './mode-toggle'

const links = [
  {
    href: '/book/vehicle',
    label: 'book vehicle',
  },
  {
    href: '/vehicle',
    label: 'vehicle',
  },
  {
    href: '/parcel',
    label: 'parcel',
  },
  {
    href: '/address',
    label: 'address',
  },
]

export const Navbar = () => {
  return (
    <nav className="flex px-4 py-2 border-t sm:border-b bg-primary/10 items-center">
      <ul className="flex flex-1 gap-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>
              <Button variant="ghost">{label}</Button>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}
