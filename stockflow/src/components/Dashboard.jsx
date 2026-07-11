import './Dashboard.css'

const dashboardCards = [
  { label: 'Total Products', value: '0', note: 'Items in inventory' },
  { label: 'Inventory Value', value: 'LKR 0.00', note: 'Current stock value' },
  { label: 'Out of Stock', value: '0', note: 'Need restock' },
  { label: 'Categories', value: '0', note: 'Product groups' },
]

function Dashboard() {
  return (
    <section className="dashboard-shell">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Track products, stock levels, categories, and inventory value.</p>
      </div>

      <div className="metrics-grid">
        {dashboardCards.map((item) => (
          <article className="metric-card" key={item.label}>
            <div className="metric-topline">
              <span>{item.label}</span>
            </div>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
