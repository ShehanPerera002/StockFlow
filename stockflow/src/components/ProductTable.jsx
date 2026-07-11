import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'
import { defaultCategories, defaultProducts, formatLkr, generateProductId } from '../utils/inventory'
import './ProductTable.css'

const productInitialValues = { name: '', category: '', price: '', stock: '' }
const stockFilters = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
]

const productSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .required('Product name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  stock: Yup.number()
    .typeError('Stock must be a number')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock quantity is required'),
})

function ProductTable() {
  const [products, setProducts] = useState(defaultProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
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
  }, [categoryFilter, products, searchTerm, stockFilter])

  const openAddProduct = () => {
    setEditingProduct(null)
    setIsProductModalOpen(true)
  }

  const openEditProduct = (product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setEditingProduct(null)
    setIsProductModalOpen(false)
  }

  const saveProduct = (values) => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        name: values.name.trim(),
        category: values.category,
        price: Number(values.price),
        stock: Number(values.stock),
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === editingProduct.id ? updatedProduct : product)),
      )
      closeProductModal()
      return
    }

    const newProduct = {
      id: generateProductId(products),
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
    }

    setProducts((currentProducts) => [...currentProducts, newProduct])
    closeProductModal()
  }

  const deleteProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
  }

  const productFormValues = editingProduct
    ? {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
      }
    : productInitialValues

  return (
    <section className="products-section">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>{filteredProducts.length} of {products.length} shown</p>
        </div>
        <button type="button" className="add-product-button" onClick={openAddProduct}>
          Add Product
        </button>
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
              <th>Actions</th>
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
                <td data-label="Actions">
                  <div className="row-actions">
                    <button type="button" onClick={() => openEditProduct(product)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </td>
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

      {isProductModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <Formik
            initialValues={productFormValues}
            validationSchema={productSchema}
            enableReinitialize
            onSubmit={saveProduct}
          >
            <Form className="product-modal" aria-labelledby="product-modal-title">
              <div className="modal-header">
                <div>
                  <h2 id="product-modal-title">{editingProduct ? 'Edit product' : 'Add new product'}</h2>
                  <p>
                    {editingProduct
                      ? `Editing ${editingProduct.id}.`
                      : 'A unique Product ID will be generated automatically.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="close-button"
                  onClick={closeProductModal}
                  aria-label="Close product form"
                >
                  ×
                </button>
              </div>

              <label className="form-field">
                <span>Product name</span>
                <Field name="name" placeholder="e.g. Wireless Headphones" autoFocus />
                <ErrorMessage name="name" component="small" />
              </label>

              <label className="form-field">
                <span>Category</span>
                <Field as="select" name="category">
                  <option value="">Select category...</option>
                  {defaultCategories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="small" />
              </label>

              <div className="form-grid">
                <label className="form-field">
                  <span>Price (LKR)</span>
                  <Field name="price" type="number" min="0" step="0.01" />
                  <ErrorMessage name="price" component="small" />
                </label>

                <label className="form-field">
                  <span>Stock qty</span>
                  <Field name="stock" type="number" min="0" step="1" />
                  <ErrorMessage name="stock" component="small" />
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={closeProductModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingProduct ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </section>
  )
}

export default ProductTable
