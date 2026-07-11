import './ProductTable.css'

const products = [
  { id: 'PRD-1001', name: 'Wireless Mouse', category: 'Electronics', price: 'LKR 8,990.00', stock: 42 },
  { id: 'PRD-1002', name: 'Mechanical Keyboard', category: 'Electronics', price: 'LKR 38,700.00', stock: 15 },
  { id: 'PRD-1003', name: 'Cotton T-Shirt', category: 'Apparel', price: 'LKR 5,850.00', stock: 0 },
]

function ProductTable() {
  return (
    <section className="products-section">
      <div className="products-header">
        <h1>Products</h1>
        <p>View products currently available in the inventory.</p>
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
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td data-label="Product ID">{product.id}</td>
                <td data-label="Name">{product.name}</td>
                <td data-label="Category">{product.category}</td>
                <td data-label="Price">{product.price}</td>
                <td data-label="Stock">
                  <span className={product.stock === 0 ? 'stock-badge out' : 'stock-badge'}>
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProductTable
