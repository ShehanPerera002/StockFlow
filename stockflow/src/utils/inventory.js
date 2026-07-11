export const PRODUCTS_STORAGE_KEY = 'stockflow-products'
export const CATEGORIES_STORAGE_KEY = 'stockflow-categories'
export const HISTORY_STORAGE_KEY = 'stockflow-stock-history'
export const THEME_STORAGE_KEY = 'stockflow-theme'

export const defaultCategories = ['Electronics', 'Apparel', 'Home & Kitchen', 'Groceries']

export const defaultProducts = [
  { id: 'PRD-482910', name: 'Wireless Mouse', category: 'Electronics', price: 8990, stock: 42 },
  { id: 'PRD-482911', name: 'Mechanical Keyboard', category: 'Electronics', price: 38700, stock: 15 },
  { id: 'PRD-482912', name: 'Cotton T-Shirt', category: 'Apparel', price: 5850, stock: 0 },
  { id: 'PRD-482913', name: 'Ceramic Mug', category: 'Home & Kitchen', price: 3600, stock: 88 },
  { id: 'PRD-482914', name: 'Organic Coffee 1kg', category: 'Groceries', price: 7425, stock: 30 },
]

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function formatLkr(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function generateProductId(products) {
  let id = ''

  do {
    id = `PRD-${Math.floor(100000 + Math.random() * 900000)}`
  } while (products.some((product) => product.id === id))

  return id
}

export function createActivity(type, details = {}) {
  return {
    id: `${type}-${Date.now()}`,
    type,
    timestamp: new Date().toISOString(),
    ...details,
  }
}

export function formatActivityText(entry) {
  if (entry.type === 'incoming') {
    return `Restocked ${entry.quantity}`
  }

  if (entry.type === 'outgoing') {
    return `Sold ${entry.quantity}`
  }

  if (entry.type === 'product-added') {
    return 'Product added'
  }

  if (entry.type === 'product-updated') {
    return 'Product updated'
  }

  if (entry.type === 'product-deleted') {
    return 'Product deleted'
  }

  if (entry.type === 'category-added') {
    return 'Category added'
  }

  return 'Activity recorded'
}

export function getActivityTitle(entry) {
  return entry.productName || entry.categoryName || 'Inventory'
}

export function formatActivityTime(timestamp) {
  if (!timestamp) {
    return ''
  }

  return new Date(timestamp).toLocaleString()
}
