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


## Screenshots 

1.DashBoard

<img width="1901" height="1031" alt="Screenshot 2026-07-11 125936" src="https://github.com/user-attachments/assets/c8299d2e-427f-4e5c-9192-4763a7c0b7f1" />

2.Products

<img width="1918" height="1028" alt="Screenshot 2026-07-11 130442" src="https://github.com/user-attachments/assets/5cf2b40c-db5b-4c7d-9958-14c301ad66e9" />

3.Add Product

<img width="698" height="617" alt="Screenshot 2026-07-11 130904" src="https://github.com/user-attachments/assets/f08ed1f0-051b-4a9b-9d56-81eea4021e9c" />









