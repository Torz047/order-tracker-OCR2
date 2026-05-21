import { useState } from 'react'
import { Trash2, Code2, ChevronDown } from 'lucide-react'
import StatusBadge from './StatusBadge'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

function Field({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  )
}

export default function OrderCard({ order, onUpdateStatus, onDelete }) {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            {order.orderId || 'Unnamed Order'}
          </span>
          {order.fileName && (
            <span className="text-xs text-gray-400 hidden sm:inline">— {order.fileName}</span>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
        <Field label="Customer"      value={order.customer} />
        <Field label="Order date"    value={order.date} />
        <Field label="Total"         value={order.total} />
        <Field label="Tracking #"    value={order.trackingNumber} />
        <Field label="Carrier"       value={order.carrier} />
        <Field label="Est. delivery" value={order.deliveryDate} />
        {order.address && (
          <div className="col-span-2 sm:col-span-3 flex flex-col gap-0.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Shipping address</span>
            <span className="text-sm text-gray-800">{order.address}</span>
          </div>
        )}
        {order.items && order.items.length > 0 && (
          <div className="col-span-2 sm:col-span-3 flex flex-col gap-0.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Items</span>
            <span className="text-sm text-gray-800">{order.items.join(' · ')}</span>
          </div>
        )}
        {order.importedAt && (
          <div className="col-span-2 sm:col-span-3">
            <span className="text-xs text-gray-400">Imported {order.importedAt}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex-wrap">
        {/* Status selector */}
        <div className="relative flex items-center">
          <select
            className="text-xs bg-white border border-gray-200 rounded-lg pl-2.5 pr-7 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) onUpdateStatus(order.id, e.target.value)
              e.target.value = ''
            }}
          >
            <option value="" disabled>Update status…</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowRaw((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
        >
          <Code2 size={12} />
          {showRaw ? 'Hide raw' : 'Raw text'}
        </button>

        <button
          onClick={() => onDelete(order.id)}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg px-2.5 py-1.5 transition-colors"
          title="Remove order"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Raw text */}
      {showRaw && (
        <div className="px-5 pb-4">
          <pre className="text-xs font-mono text-gray-500 bg-gray-50 rounded-xl p-3 max-h-36 overflow-y-auto whitespace-pre-wrap break-words border border-gray-100">
            {order.rawText || '(no raw text saved)'}
          </pre>
        </div>
      )}
    </div>
  )
}
