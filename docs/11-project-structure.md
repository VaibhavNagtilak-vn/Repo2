# 11 – Project Structure

Proposed file/folder layout. This is a guide for when coding begins — nothing here exists yet.

```text
/ (repo root)
├── README.md
├── .gitignore
├── docs/                     ← project documentation (this folder)
│   ├── 01-architecture.md
│   ├── 02-database-models.md
│   ├── 03-api-reference.md
│   ├── 04-authentication.md
│   ├── 05-admin-panel.md
│   ├── 06-public-website.md
│   ├── 07-cart-checkout-orders.md
│   ├── 08-validation-security.md
│   ├── 09-ui-ux-guidelines.md
│   ├── 10-demo-flow.md
│   ├── 11-project-structure.md
│   └── 12-setup-installation.md
│
├── client/                   ← React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                  ← VITE_API_URL (gitignored)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css         ← Tailwind directives
│       ├── api/
│       │   └── axios.js      ← Axios instance + interceptors
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── CategoryFilter.jsx
│       │   ├── Toast.jsx
│       │   ├── Loader.jsx
│       │   ├── EmptyState.jsx
│       │   ├── ConfirmDialog.jsx
│       │   └── admin/
│       │       ├── Sidebar.jsx
│       │       └── DataTable.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── MyOrders.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── Categories.jsx
│       │       ├── Products.jsx
│       │       ├── Orders.jsx
│       │       └── OrderDetails.jsx
│       ├── routes/
│       │   └── ProtectedRoute.jsx  ← auth + admin guards
│       └── utils/
│           └── format.js           ← currency, dates
│
└── server/                   ← Node + Express backend
    ├── package.json
    ├── .env                  ← PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN (gitignored)
    ├── server.js             ← app entry (connect DB, mount routes)
    └── src/
        ├── config/
        │   └── db.js         ← Mongoose connection
        ├── models/
        │   ├── User.js
        │   ├── Category.js
        │   ├── Product.js
        │   └── Order.js
        ├── controllers/
        │   ├── authController.js
        │   ├── categoryController.js
        │   ├── productController.js
        │   └── orderController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── categoryRoutes.js
        │   ├── productRoutes.js
        │   ├── orderRoutes.js
        │   └── adminRoutes.js
        ├── middleware/
        │   ├── auth.js       ← protect
        │   ├── admin.js      ← admin role guard
        │   └── error.js      ← central error handler
        ├── utils/
        │   └── jwt.js        ← sign/verify helpers
        └── seed/
            └── seedAdmin.js  ← create the initial admin user
```

---

## Conventions

- **client** and **server** are independent packages (separate `package.json`).
- Frontend uses `VITE_API_URL` to point at the backend base URL.
- Backend keeps all secrets in `.env` (never committed).
- One model per file; controllers grouped by resource; routes grouped by resource.
- Admin-only endpoints live under `/api/admin/*` plus guarded write routes on categories/products.

---

## Route → Controller → Model map

| Route file          | Controller            | Model(s)          |
| ------------------- | --------------------- | ----------------- |
| `authRoutes`        | `authController`      | User              |
| `categoryRoutes`    | `categoryController`  | Category          |
| `productRoutes`     | `productController`   | Product, Category |
| `orderRoutes`       | `orderController`     | Order, Product, User |
| `adminRoutes`       | `orderController`     | Order             |
