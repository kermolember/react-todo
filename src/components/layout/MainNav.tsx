'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/categories', label: 'Categories' },
  { href: '/priorities', label: 'Priorities' },
  { href: '/tasks', label: 'Tasks' },
]

export default function MainNav() {
  const pathname = usePathname()
  return (
    <nav>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
