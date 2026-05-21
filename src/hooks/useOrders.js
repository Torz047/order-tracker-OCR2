import { useState, useEffect } from 'react'

const STORAGE_KEY = 'orderTracker_orders'
const API_KEY_STORAGE = 'orderTracker_apiKey'

export function useOrders() {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  function addOrder(order) {
    setOrders((prev) => [order, ...prev])
  }

  function updateStatus(id, status) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
  }

  function deleteOrder(id) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  function clearAll() {
    setOrders([])
  }

  return { orders, addOrder, updateStatus, deleteOrder, clearAll }
}

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(
    () => localStorage.getItem(API_KEY_STORAGE) || ''
  )

  function setApiKey(key) {
    setApiKeyState(key)
    localStorage.setItem(API_KEY_STORAGE, key)
  }

  return { apiKey, setApiKey }
}
