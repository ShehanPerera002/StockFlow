# StockFlow

StockFlow is a frontend inventory management system for tracking products, stock levels, categories, and inventory value.

Live site: https://stockflow7.netlify.app/

This project uses React for the UI and `localStorage` for data persistence. There is no backend or database, so the app can run fully in the browser.

## Run Locally

Go into the app folder:

```bash
cd stockflow
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Netlify Deployment

The project is deployed on Netlify as a static frontend app.

Use these settings when creating the Netlify site:

```text
Base directory: stockflow
Build command: npm run build
Publish directory: dist
Functions directory: leave empty
```

## CI

GitHub Actions is used only to check that the project builds successfully.

The workflow runs:

```bash
npm ci
npm run build
```

## Features Implemented

- Add, edit, and delete products
- Auto-generated product IDs
- Form validation with Formik and Yup
- Store products, categories, theme, and activity history in `localStorage`
- Create custom categories
- Search by product name or product ID
- Filter products by category
- Filter products by stock status
- Restock products
- Record sales by decreasing stock
- Prevent sales when stock is not available
- Dashboard with product count, inventory value, out-of-stock count, and category count
- Product count by category
- Activity history with timestamps
- Export products to CSV
- Light and dark theme toggle
- Responsive layout for desktop and mobile


