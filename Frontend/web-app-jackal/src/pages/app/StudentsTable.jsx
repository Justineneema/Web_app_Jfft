function Toolbar() {
  return (
    <div className="flex items-center justify-between mb-4">
      <input placeholder="Find Student" className="w-[420px] bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm" />
      <div className="flex items-center gap-3">
        <button className="btn-secondary">+ Add New</button>
        <button className="px-4 py-2 rounded-md border border-neutral-700">Filters</button>
      </div>
    </div>
  )
}

export default function StudentsTable() {
  const rows = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    username: 'jose',
    first: 'Joseph',
    last: 'Sherman',
    assignments: '50, 80, 90, 30',
    goal: 80,
    wpm: 55,
    accuracy: 80,
    performance: 'PASS',
  }))
  const headers = ['','Username','First Name','Last Name','Assignments','Goal','Avg. WPM','Avg. Accuracy','Performance','']
  return (
    <div>
      <Toolbar />
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800/60 text-neutral-300">
            <tr>
              {headers.map(h => <th key={h} className="text-left font-medium p-3 border-b border-neutral-800">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-neutral-800">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{r.username}</td>
                <td className="p-3">{r.first}</td>
                <td className="p-3">{r.last}</td>
                <td className="p-3">{r.assignments}</td>
                <td className="p-3">{r.goal}</td>
                <td className="p-3">{r.wpm}</td>
                <td className="p-3">{r.accuracy}</td>
                <td className="p-3 text-emerald-400">{r.performance}</td>
                <td className="p-3">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-6 text-sm text-neutral-400 mt-4">
        <span>‹ Previous</span>
        <div className="flex items-center gap-2">
          {[1,2,3].map(n => <button key={n} className={`h-8 w-8 rounded ${n===2? 'bg-neutral-800 text-white' : ''}`}>{n}</button>)}
        </div>
        <span>Next ›</span>
      </div>
    </div>
  )
}




