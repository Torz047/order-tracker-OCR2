import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function UploadZone({ onFiles, disabled }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  function handleFiles(files) {
    const pdfs = Array.from(files).filter((f) => f.type === 'application/pdf')
    if (pdfs.length > 0) onFiles(pdfs)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      }}
      className={`
        relative flex flex-col items-center justify-center gap-3
        rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${dragging
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        disabled={disabled}
      />
      <div className={`p-3 rounded-xl ${dragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <UploadCloud size={28} className={dragging ? 'text-blue-500' : 'text-gray-400'} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">
          {dragging ? 'Drop to upload' : 'Drop PDF files here or click to browse'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Order confirmations · Invoices · Purchase orders
        </p>
      </div>
    </div>
  )
}
