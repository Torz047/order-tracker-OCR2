import { useState } from 'react'
import { Package, Trash2, ChevronDown } from 'lucide-react'
import { useOrders, useApiKey } from './hooks/useOrders'
import { useToast } from './hooks/useToast'
import { extractText, getFileType } from './utils/ocr'
import { extractOrderFields } from './utils/parser'
import ApiKeyInput from './components/ApiKeyInput'
import UploadZone from './components/UploadZone'
import OrderCard from './components/OrderCard'
import StatsBar from './components/StatsBar'
import Toast from './components/Toast'

const STATUS_OPTIONS = ['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function App() {
  const { orders, addOrder, updateStatus, deleteOrder, clearAll } = useOrders()
  const { apiKey, setApiKey } = useApiKey()
  const { toast, show: showToast } = useToast()

  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  async function handleFiles(files) {
    if (!apiKey.trim()) {
      showToast('Please enter your free OCR.space API key first', 'error')
      return
    }
    setProcessing(true)
    for (const file of files) {
      setProcessingLabel(`Reading "${file.name}" (${getFileType(file) === 'image' ? 'image' : 'PDF'})…`)
      try {
        const rawText = await extractText(file, apiKey.trim())
        const fields = extractOrderFields(rawText)
        addOrder({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ...fields,
          orderId: fields.orderId || file.name.replace(/\.[^.]+$/, ''),
          rawText: rawText.substring(0, 2000),
          fileName: file.name,
          importedAt: new Date().toLocaleString(),
        })
        showToast(`Imported: ${fields.orderId || file.name}`, 'success')
      } catch (err) {
        showToast(`Error: ${err.message}`, 'error')
      }
    }
    setProcessing(false)
    setProcessingLabel('')
  }

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Package size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Order Tracker</h1>
          <span className="text-xs bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full font-medium">
            Free OCR
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-14">
          Upload order PDFs — text is extracted free via OCR.space
        </p>

        {/* API Key */}
        <div className="mb-4">
          <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
        </div>

        {/* Upload */}
        <UploadZone onFiles={handleFiles} disabled={processing} />

        {/* Progress */}
        {processing && (
          <div className="mt-3">
            <div className="h-1 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full shimmer rounded-full" />
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">{processingLabel}</p>
          </div>
        )}

        {/* Stats */}
        {orders.length > 0 && (
          <div className="mt-8">
            <StatsBar orders={orders} />
          </div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Orders
              </span>

              {/* Filter */}
              <div className="relative flex items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-lg pl-2.5 pr-7 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.filter(Boolean).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => { if (window.confirm('Remove all orders?')) clearAll() }}
                className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={12} /> Clear all
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No orders match the selected filter.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteOrder}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && !processing && (
          <div className="mt-10 text-center text-gray-400">
            <Package size={36} className="mx-auto opacity-20 mb-3" />
            <p className="text-sm">No orders yet. Upload a PDF to get started.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-10">
          OCR powered by{' '}
          <a
            href="https://ocr.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            OCR.space
          </a>
          {' '}· Free tier: 500 requests/day · Data deleted after processing
        </p>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
