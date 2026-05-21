/**
 * parser.js
 * Parses raw OCR text into structured order fields using regex patterns.
 * No AI needed — runs entirely in the browser.
 */

function find(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) return match[1].trim()
  }
  return null
}

export function extractOrderFields(rawText) {
  const text = rawText

  // --- Order ID ---
  const orderId = find(text, [
    /order\s*(?:#|no\.?|number|id|ref(?:erence)?)[:\s#]*([A-Z0-9\-]{4,20})/i,
    /(?:po|purchase\s*order)[:\s#]*([A-Z0-9\-]{4,20})/i,
    /invoice\s*(?:#|no\.?|number)[:\s#]*([A-Z0-9\-]{4,20})/i,
    /#\s*([A-Z0-9]{5,15})\b/i,
  ])

  // --- Customer ---
  const customer = find(text, [
    /(?:bill(?:ed)?\s*to|sold\s*to)[:\s]*\n?\s*([A-Za-z][A-Za-z\s\.,']{3,40})/i,
    /(?:customer|client|buyer)\s*(?:name)?[:\s]*([A-Za-z][A-Za-z\s\.]{3,35})/i,
    /(?:ship(?:ped)?\s*to)[:\s]*\n?\s*([A-Za-z][A-Za-z\s\.,']{3,40})/i,
  ])

  // --- Date ---
  const date = find(text, [
    /(?:order\s*date|invoice\s*date|date\s*of\s*order|date)[:\s]*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i,
    /(?:order\s*date|date)[:\s]*([A-Z][a-z]+\.?\s+[0-9]{1,2},?\s+20[0-9]{2})/i,
    /([0-9]{4}[\/\-][0-9]{2}[\/\-][0-9]{2})/,
    /([A-Z][a-z]+\.?\s+[0-9]{1,2},?\s+20[0-9]{2})/,
  ])

  // --- Total ---
  const total = find(text, [
    /(?:grand\s*total|total\s*amount|amount\s*due|total\s*due|invoice\s*total|total)[:\s]*([₱$€£¥]?\s*[0-9,]+\.?[0-9]*)/i,
    /([₱$€£¥]\s*[0-9,]+\.[0-9]{2})/,
    /([0-9,]+\.[0-9]{2}\s*(?:USD|EUR|PHP|GBP|JPY))/i,
  ])

  // --- Tracking Number ---
  const trackingNumber = find(text, [
    /(?:tracking\s*(?:number|no\.?|#|id)|track(?:ing)?)[:\s#]*([A-Z0-9]{8,30})/i,
    /(?:waybill|airway\s*bill)[:\s#]*([A-Z0-9]{8,30})/i,
  ])

  // --- Carrier ---
  const carrier = find(text, [
    /(?:shipped?\s*(?:via|by|with)|carrier|courier|delivery\s*(?:via|by|with|service))[:\s]*([A-Za-z][A-Za-z0-9\s&]{2,25})/i,
  ])

  // --- Estimated Delivery ---
  const deliveryDate = find(text, [
    /(?:est(?:imated)?\s*(?:delivery|arrival|ship)|delivery\s*(?:date|by|on|est))[:\s]*([A-Za-z0-9\s,\/\-\.]{4,30})/i,
    /(?:arrives?|expected)[:\s]*([A-Za-z0-9\s,\/\-\.]{4,30})/i,
  ])

  // --- Shipping Address ---
  let address = null
  const addrMatch = text.match(
    /(?:ship(?:ping|ped)?\s*(?:address|to)|deliver(?:y|ed)?\s*(?:to|address))[:\s\n]*([\s\S]{10,150}?)(?=\n\n|\n[A-Z][a-zA-Z ]+:|\n\n|$)/i
  )
  if (addrMatch) {
    address = addrMatch[1].replace(/\n/g, ', ').replace(/,\s*,/g, ',').trim().substring(0, 150)
  }

  // --- Status (infer from text) ---
  let status = 'Pending'
  const lower = text.toLowerCase()
  if (lower.includes('delivered') || lower.includes('completed') || lower.includes('received')) {
    status = 'Delivered'
  } else if (lower.includes('shipped') || lower.includes('dispatched') || lower.includes('in transit') || lower.includes('on the way')) {
    status = 'Shipped'
  } else if (lower.includes('processing') || lower.includes('in progress') || lower.includes('confirmed') || lower.includes('accepted')) {
    status = 'Processing'
  } else if (lower.includes('cancelled') || lower.includes('canceled') || lower.includes('refunded') || lower.includes('void')) {
    status = 'Cancelled'
  }

  // --- Line Items ---
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const items = []
  for (const line of lines) {
    if (
      /^[1-9][0-9]*\s*[xX×]\s*.{3,}/.test(line) ||
      /^\d+\s+[A-Za-z]{3,}.{3,}[₱$€£¥0-9]/.test(line)
    ) {
      const clean = line.replace(/[₱$€£¥]\s*[0-9,\.]+/g, '').trim()
      if (clean.length > 3 && clean.length < 80) items.push(clean)
    }
  }

  return {
    orderId: orderId || null,
    customer: customer || null,
    date: date || null,
    total: total || null,
    trackingNumber: trackingNumber || null,
    carrier: carrier || null,
    deliveryDate: deliveryDate || null,
    address: address || null,
    status,
    items: items.slice(0, 8),
  }
}
