import MainNav from '@/components/layout/MainNav'
import UserMenu from '@/components/layout/UserMenu'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <header>
        <h1>Todo App Dashboard</h1>
        <UserMenu />
      </header>
      <MainNav />
      <main>{children}</main>
    </div>
  )
}
