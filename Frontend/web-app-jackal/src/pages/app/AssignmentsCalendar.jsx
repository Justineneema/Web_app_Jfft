function Toolbar() {
  return (
    <div className="flex items-center justify-between mb-4">
      <input placeholder="Find Assignment" className="w-[420px] bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm" />
      <div className="flex items-center gap-3">
        <button className="btn-secondary">+ Add New</button>
        <button className="px-4 py-2 rounded-md border border-neutral-700">Filters</button>
        <button className="px-3 py-2 rounded-md border border-neutral-700">▦</button>
      </div>
    </div>
  )
}

function ActivityItem() {
  return (
    <div className="card-surface p-3 flex items-center gap-3">
      <img src="/avatar.png" className="h-8 w-8 rounded-full" />
      <div className="text-xs">
        <div className="text-neutral-200">Assignment</div>
        <div className="text-neutral-400">Grade 9 · 25,August, 2024 · 02:48:24 PM</div>
      </div>
    </div>
  )
}

export default function AssignmentsCalendar() {
  return (
    <div>
      <Toolbar />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">September 2024</div>
            <div className="flex gap-2"><button>‹</button><button>›</button></div>
          </div>
          <div className="grid grid-cols-7 text-center text-neutral-400 text-sm">
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 border-t border-neutral-800">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-[6/4] border-r border-b border-neutral-800 relative">
                <div className="absolute top-1 left-2 text-xs text-neutral-500">22</div>
                {i===9 && (
                  <span className="absolute left-2 top-6 bg-emerald-700/80 text-white text-xs px-2 py-1 rounded">Grade 13</span>
                )}
                {i===25 && (
                  <span className="absolute left-2 bottom-3 bg-emerald-700/80 text-white text-xs px-2 py-1 rounded">Grade 9</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white">Upcoming Activities</div>
            <a className="text-sm text-neutral-400" href="#">See All</a>
          </div>
          {Array.from({ length: 7 }).map((_, i) => <ActivityItem key={i} />)}
        </div>
      </div>
    </div>
  )
}




