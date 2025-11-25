import { NavLink, Outlet, useLocation } from 'react-router-dom'

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md text-sm ${
          isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
        }`
      }
    >
      <span className="w-5 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function DashboardLayout() {
  const location = useLocation()
  const segment = location.pathname.split('/')[2] || 'assignments'

  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-neutral-800 bg-neutral-900">
        <div className="h-14 flex items-center px-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-neutral-800 border border-neutral-700">J</span>
            <span>Jackal</span>
          </div>
        </div>
        <div className="p-3 space-y-1">
          <NavItem to="/app" label="Dashboard" icon="▦" />
          <NavItem to="/app/assignments" label="Assignments" icon="🗒️" />
          <NavItem to="/app/classes" label="Classes" icon="🎓" />
          <NavItem to="/app/students" label="Students" icon="🧑‍🏫" />
          <NavItem to="#settings" label="Settings" icon="⚙️" />
        </div>
        <div className="mt-auto p-3">
          <div className="card-surface p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/avatar.png" alt="me" className="h-8 w-8 rounded-full" />
              <div className="text-xs">
                <div className="text-white">Gabriel Osinde</div>
                <div className="text-neutral-400">Teacher</div>
              </div>
            </div>
            <span>▾</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-h-dvh flex flex-col">
        <header className="h-14 flex items-center px-6 border-b border-neutral-800">
          <h1 className="text-2xl font-bold text-white capitalize">{segment}</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}




