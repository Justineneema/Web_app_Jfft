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

export default function AssignmentsTable() {
  const rows = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    class: 'Grade 9',
    teacher: 'You',
    goal: 50,
    text: 'Lorem Ipsum...',
    due: 'Tomorrow, 10:15 AM',
    completion: '20%',
    performance: i === 1 ? 'FAIL' : 'PASS',
  }))

  return (
    <div>
      <Toolbar />
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800/60 text-neutral-300">
            <tr>
              {['', 'Class', 'Teacher', 'Goal', 'Text', 'Due Date', 'Completion', 'Performance', ''].map((h) => (
                <th key={h} className="text-left font-medium p-3 border-b border-neutral-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-neutral-800">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{r.class}</td>
                <td className="p-3">{r.teacher}</td>
                <td className="p-3">{r.goal}</td>
                <td className="p-3">{r.text}</td>
                <td className="p-3">{r.due}</td>
                <td className="p-3">{r.completion}</td>
                <td className="p-3"><span className={r.performance === 'PASS' ? 'text-emerald-400' : 'text-red-400'}>{r.performance}</span></td>
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




