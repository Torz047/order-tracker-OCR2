const STATS = [
  { label: 'Total',      filter: () => true,                                         color: 'text-gray-800' },
  { label: 'Processing', filter: (o) => o.status === 'Processing',                   color: 'text-blue-700' },
  { label: 'Shipped',    filter: (o) => o.status === 'Shipped',                      color: 'text-green-700' },
  { label: 'Delivered',  filter: (o) => o.status === 'Delivered',                    color: 'text-teal-700' },
  { label: 'Pending',    filter: (o) => !o.status || o.status === 'Pending',         color: 'text-amber-700' },
  { label: 'Cancelled',  filter: (o) => o.status === 'Cancelled',                    color: 'text-red-600'  },
]

export default function StatsBar({ orders }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
      {STATS.map(({ label, filter, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <div className={`text-2xl font-medium ${color}`}>
            {orders.filter(filter).length}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
