import { useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import {
  CATEGORIES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  defaultCategories,
  defaultProducts,
  formatActivityText,
  formatActivityTime,
  formatLkr,
  getActivityTitle,
} from '../utils/inventory'
import './Dashboard.css'

function Dashboard() {
  const [products] = useLocalStorage(PRODUCTS_STORAGE_KEY, defaultProducts)
  const [categories] = useLocalStorage(CATEGORIES_STORAGE_KEY, defaultCategories)
  const [activityLog] = useLocalStorage(HISTORY_STORAGE_KEY, [])

  const stats = useMemo(() => {
    const totalStock = products.reduce((total, product) => total + product.stock, 0)
    const inventoryValue = products.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    )
    const outOfStock = products.filter((product) => product.stock === 0).length

    return [
      { label: 'Total Products', value: products.length, note: `${totalStock} units in stock` },
      { label: 'Inventory Value', value: formatLkr(inventoryValue), note: 'Current stock value' },
      { label: 'Out of Stock', value: outOfStock, note: 'Need restock' },
      { label: 'Categories', value: categories.length, note: 'Product groups' },
    ]
  }, [categories.length, products])

  const categoryCounts = useMemo(
    () =>
      categories.map((category) => ({
        name: category,
        count: products.filter((product) => product.category === category).length,
      })),
    [categories, products],
  )

  return (
    <section className="dashboard-shell">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Track products, stock levels, categories, and inventory value.</p>
      </div>

      <div className="metrics-grid">
        {stats.map((item) => (
          <article className="metric-card" key={item.label}>
            <div className="metric-topline">
              <span>{item.label}</span>
            </div>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-details">
        <section className="dashboard-panel" aria-labelledby="category-summary-title">
          <div className="section-heading">
            <h2 id="category-summary-title">Products by category</h2>
            <p>Quick count of inventory groups.</p>
          </div>

          <div className="category-list">
            {categoryCounts.map((category) => (
              <div className="category-row" key={category.name}>
                <span>{category.name}</span>
                <strong>{category.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel" aria-labelledby="activity-title">
          <div className="section-heading">
            <h2 id="activity-title">Activity history</h2>
            <p>Latest inventory updates with timestamps.</p>
          </div>

          {activityLog.length === 0 ? (
            <p className="empty-dashboard-text">No activity recorded yet.</p>
          ) : (
            <div className="activity-list">
              {activityLog.slice(0, 5).map((entry) => (
                <div className="activity-row" key={entry.id}>
                  <div>
                    <strong>{getActivityTitle(entry)}</strong>
                    <span>{formatActivityText(entry)}</span>
                  </div>
                  <time>{formatActivityTime(entry.timestamp)}</time>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default Dashboard
