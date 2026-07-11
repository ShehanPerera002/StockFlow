import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'
import useLocalStorage from '../hooks/useLocalStorage'
import {
  CATEGORIES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  createActivity,
  defaultCategories,
  defaultProducts,
  formatLkr,
  generateProductId,
} from '../utils/inventory'
import './ProductTable.css'

const productInitialValues = { name: '', category: '', price: '', stock: '' }
const categoryInitialValues = { name: '' }
const stockInitialValues = { quantity: '' }

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
  const [products, setProducts] = useLocalStorage(PRODUCTS_STORAGE_KEY, defaultProducts)
  const [categories, setCategories] = useLocalStorage(CATEGORIES_STORAGE_KEY, defaultCategories)
  const [, setActivityLog] = useLocalStorage(HISTORY_STORAGE_KEY, [])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [productModalMode, setProductModalMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [stockModal, setStockModal] = useState(null)

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

  const productFormValues = editingProduct
    ? {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
      }
    : productInitialValues

  const categorySchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Category must be at least 2 characters')
      .test('unique-category', 'Category already exists', (value) => {
        if (!value) {
          return true
        }

        return !categories.some((category) => category.toLowerCase() === value.trim().toLowerCase())
      })
      .required('Category name is required'),
  })

  const stockSchema = Yup.object({
    quantity: Yup.number()
      .typeError('Quantity must be a number')
      .integer('Quantity must be a whole number')
      .min(1, 'Quantity must be at least 1')
      .test('available-stock', 'Cannot sell more than current stock', (value) => {
        if (!stockModal || stockModal.type !== 'outgoing' || !value) {
          return true
        }

        return Number(value) <= stockModal.product.stock
      })
      .required('Quantity is required'),
  })

  const addActivity = (type, details) => {
    setActivityLog((currentLog) => [createActivity(type, details), ...currentLog.slice(0, 19)])
  }

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductModalMode('add')
  }

  const openEditProduct = (product) => {
    setEditingProduct(product)
    setProductModalMode('edit')
  }

  const closeProductModal = () => {
    setEditingProduct(null)
    setProductModalMode(null)
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
      addActivity('product-updated', {
        productId: updatedProduct.id,
        productName: updatedProduct.name,
      })
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
    addActivity('product-added', {
      productId: newProduct.id,
      productName: newProduct.name,
    })
    closeProductModal()
  }

  const deleteProduct = (product) => {
    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id))
    addActivity('product-deleted', {
      productId: product.id,
      productName: product.name,
    })
  }

  const saveCategory = (values, helpers) => {
    const categoryName = values.name.trim()

    setCategories((currentCategories) => [...currentCategories, categoryName])
    addActivity('category-added', { categoryName })
    helpers.resetForm()
    setIsCategoryModalOpen(false)
  }

  const adjustStock = (values, helpers) => {
    const quantity = Number(values.quantity)
    const product = stockModal.product
    const nextStock =
      stockModal.type === 'incoming' ? product.stock + quantity : product.stock - quantity

    setProducts((currentProducts) =>
      currentProducts.map((item) => (item.id === product.id ? { ...item, stock: nextStock } : item)),
    )
    addActivity(stockModal.type, {
      productId: product.id,
      productName: product.name,
      quantity,
    })
    helpers.resetForm()
    setStockModal(null)
  }

  const exportCsv = () => {
    const headers = ['Product ID', 'Product Name', 'Category', 'Price', 'Stock Quantity', 'Inventory Value']
    const rows = products.map((product) => [
      product.id,
      product.name,
      product.category,
      product.price,
      product.stock,
      product.price * product.stock,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')

    link.href = url
    link.download = 'stockflow-products.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="products-panel" aria-labelledby="products-title">
      <div className="products-heading">
        <div>
          <h1 id="products-title">Products</h1>
          <p>{filteredProducts.length} of {products.length} shown</p>
        </div>

        <div className="products-actions">
          <button type="button" className="secondary-action" onClick={exportCsv}>
            Export CSV
          </button>
          <button type="button" className="secondary-action" onClick={() => setIsCategoryModalOpen(true)}>
            Add Category
          </button>
          <button type="button" className="primary-action" onClick={openAddProduct}>
            Add Product
          </button>
        </div>
      </div>

      <div className="products-toolbar">
        <label className="search-field">
          <span aria-hidden="true">Search</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name or Product ID..."
            aria-label="Search products"
          />
        </label>

        <select
          className="category-select"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="stock-filter" aria-label="Filter by stock status">
          {stockFilters.map((filter) => (
            <button
              type="button"
              className={stockFilter === filter.value ? 'is-active' : ''}
              onClick={() => setStockFilter(filter.value)}
              key={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="products-table-wrap">
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
                <td data-label="Product ID" className="sku-cell">{product.id}</td>
                <td data-label="Name" className="name-cell">{product.name}</td>
                <td data-label="Category">
                  <span className="category-pill">{product.category}</span>
                </td>
                <td data-label="Price">{formatLkr(product.price)}</td>
                <td
                  data-label="Stock"
                  className={product.stock === 0 ? 'stock-cell out-of-stock' : 'stock-cell in-stock'}
                >
                  <span>{product.stock}</span>
                </td>
                <td data-label="Value">{formatLkr(product.price * product.stock)}</td>
                <td data-label="Actions">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="text-action restock-action"
                      onClick={() => setStockModal({ product, type: 'incoming' })}
                    >
                      Restock
                    </button>
                    <button
                      type="button"
                      className="text-action sell-action"
                      onClick={() => setStockModal({ product, type: 'outgoing' })}
                    >
                      Sell
                    </button>
                    <button type="button" className="text-action" onClick={() => openEditProduct(product)}>
                      Edit
                    </button>
                    <button type="button" className="text-action danger-action" onClick={() => deleteProduct(product)}>
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

      {productModalMode && (
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
                <button type="button" className="close-button" onClick={closeProductModal}>
                  x
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
                  {categories.map((category) => (
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

      {isCategoryModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <Formik initialValues={categoryInitialValues} validationSchema={categorySchema} onSubmit={saveCategory}>
            <Form className="product-modal compact-modal" aria-labelledby="category-modal-title">
              <div className="modal-header">
                <div>
                  <h2 id="category-modal-title">Add category</h2>
                  <p>Create a custom product category.</p>
                </div>
                <button type="button" className="close-button" onClick={() => setIsCategoryModalOpen(false)}>
                  x
                </button>
              </div>

              <label className="form-field">
                <span>Category name</span>
                <Field name="name" placeholder="e.g. Office Supplies" autoFocus />
                <ErrorMessage name="name" component="small" />
              </label>

              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setIsCategoryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create category
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      )}

      {stockModal && (
        <div className="modal-backdrop" role="presentation">
          <Formik initialValues={stockInitialValues} validationSchema={stockSchema} onSubmit={adjustStock}>
            <Form className="product-modal compact-modal" aria-labelledby="stock-modal-title">
              <div className="modal-header">
                <div>
                  <h2 id="stock-modal-title">
                    {stockModal.type === 'incoming' ? 'Restock product' : 'Record sale'}
                  </h2>
                  <p>{stockModal.product.name} currently has {stockModal.product.stock} units.</p>
                </div>
                <button type="button" className="close-button" onClick={() => setStockModal(null)}>
                  x
                </button>
              </div>

              <label className="form-field">
                <span>Quantity</span>
                <Field name="quantity" type="number" min="1" step="1" autoFocus />
                <ErrorMessage name="quantity" component="small" />
              </label>

              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setStockModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {stockModal.type === 'incoming' ? 'Add stock' : 'Decrease stock'}
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
