/**
 * ocr.js
 * Calls the OCR.space free API and returns raw extracted text from a PDF or image.
 * Supported: PDF, JPG, PNG, BMP, TIFF, GIF, WEBP
 * Free tier: 500 requests/day, no credit card required.
 * Get your free key at: https://ocr.space/ocrapi/freekey
 */

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif', 'image/webp']
const PDF_TYPE = 'application/pdf'

export function isSupportedFile(file) {
  return file.type === PDF_TYPE || IMAGE_TYPES.includes(file.type)
}

export function getFileType(file) {
  if (file.type === PDF_TYPE) return 'pdf'
  if (IMAGE_TYPES.includes(file.type)) return 'image'
  return null
}

export async function extractText(file, apiKey) {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('apikey', apiKey)
  formData.append('language', 'eng')
  formData.append('isOverlayRequired', 'false')
  formData.append('detectOrientation', 'true')
  formData.append('scale', 'true')
  formData.append('OCREngine', '2')

  // Only set filetype explicitly for PDFs; images are auto-detected
  if (file.type === PDF_TYPE) {
    formData.append('filetype', 'PDF')
  }

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`OCR.space API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.[0] || 'OCR processing failed')
  }

  const pages = data.ParsedResults || []
  const text = pages.map((p) => p.ParsedText || '').join('\n')

  if (!text || text.trim().length < 10) {
    throw new Error('No readable text found. The file may be blank or unreadable.')
  }

  return text
}

// Keep old export as alias for backwards compatibility
export const extractTextFromPDF = extractText
