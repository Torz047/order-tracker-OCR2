/**
 * ocr.js
 * Calls the OCR.space free API and returns raw extracted text from a PDF.
 * Free tier: 500 requests/day, no credit card required.
 * Get your free key at: https://ocr.space/ocrapi/freekey
 */

export async function extractTextFromPDF(file, apiKey) {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('apikey', apiKey)
  formData.append('language', 'eng')
  formData.append('isOverlayRequired', 'false')
  formData.append('filetype', 'PDF')
  formData.append('detectOrientation', 'true')
  formData.append('scale', 'true')
  formData.append('OCREngine', '2')

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
    throw new Error('No readable text found in this PDF. It may be image-only or password-protected.')
  }

  return text
}
