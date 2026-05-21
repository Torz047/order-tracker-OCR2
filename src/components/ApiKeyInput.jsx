import { useState } from 'react'
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react'

export default function ApiKeyInput({ apiKey, onChange }) {
  const [show, setShow] = useState(false)

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-sm">
      <Key size={15} className="text-gray-400 shrink-0" />
      <input
        type={show ? 'text' : 'password'}
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your free OCR.space API key…"
        className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
        autoComplete="off"
      />
      <button
        onClick={() => setShow((v) => !v)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title={show ? 'Hide key' : 'Show key'}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <a
        href="https://ocr.space/ocrapi/freekey"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap transition-colors"
      >
        Get free key <ExternalLink size={11} />
      </a>
    </div>
  )
}
