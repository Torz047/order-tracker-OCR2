const STATUS_STYLES = {
  Pending:    'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-green-100 text-green-800',
  Delivered:  'bg-teal-100 text-teal-800',
  Cancelled:  'bg-red-100 text-red-800',
  Unknown:    'bg-gray-100 text-gray-600',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Unknown
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status || 'Unknown'}
    </span>
  )
}
