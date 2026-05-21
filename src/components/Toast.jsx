import { CheckCircle, AlertCircle, Info } from 'lucide-react'

const ICONS = {
  success: <CheckCircle size={15} className="text-green-500" />,
  error:   <AlertCircle size={15} className="text-red-500" />,
  info:    <Info size={15} className="text-blue-500" />,
}

export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
      {ICONS[toast.type] || ICONS.info}
      {toast.message}
    </div>
  )
}
