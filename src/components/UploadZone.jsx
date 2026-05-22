import { useRef, useState } from 'react'
import { UploadCloud, FileText, Image } from 'lucide-react'
import { isSupportedFile } from '../utils/ocr'

const ACCEPT = 'application/pdf,image/jpeg,image/png,image/bmp,image/tiff,image/gif,image/webp'

export default function UploadZone({ onFiles, disabled }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  function handleFiles(files) {
    const supported = Array.from(files).filter(isSupportedFile)
    if (supported.length > 0) onFiles(supported)
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
        accept={ACCEPT}
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
          {dragging ? 'Drop to upload' : 'Drop files here or click to browse'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Order confirmations · Invoices · Purchase orders
        </p>
      </div>

      {/* Supported formats */}
      <div className="flex items-center gap-3 mt-1">
        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          <FileText size={11} /> PDF
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          <Image size={11} /> JPG
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          <Image size={11} /> PNG
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
          <Image size={11} /> BMP · TIFF · GIF · WEBP
        </span>
      </div>
    </div>
  )
}
