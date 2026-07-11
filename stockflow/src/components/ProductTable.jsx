import { useMemo, useState } from 'react'
import { defaultCategories, defaultProducts, formatLkr } from '../utils/inventory'
import './ProductTable.css'

const stockFilters = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
]

function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return defaultProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch)
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && product.stock > 0) ||
        (stockFilter === 'out-of-stock' && product.stock === 0)

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [categoryFilter, searchTerm, stockFilter])

  return (
    <section className="products-section">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>{filteredProducts.length} of {defaultProducts.length} shown</p>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search name or Product ID..."
          aria-label="Search products"
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {defaultCategories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="stock-filter" aria-label="Filter by stock status">
          {stockFilters.map((filter) => (
            <button
              type="button"
              className={stockFilter === filter.value ? 'active' : ''}
              onClick={() => setStockFilter(filter.value)}
              key={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td data-label="Product ID">{product.id}</td>
                <td data-label="Name">{product.name}</td>
                <td data-label="Category">{product.category}</td>
                <td data-label="Price">{formatLkr(product.price)}</td>
                <td data-label="Stock">
                  <span className={product.stock === 0 ? 'stock-badge out' : 'stock-badge'}>
                    {product.stock}
                  </span>
                </td>
                <td data-label="Value">{formatLkr(product.price * product.stock)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <strong>No products found</strong>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductTable
