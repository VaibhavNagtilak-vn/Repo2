# Mini E-Commerce Demo (MERN)

A small, clean **MERN** stack e-commerce demo project. It covers the full shopping flow —
admin manages catalog, customers browse and order — without any of the heavy extras
(no payment gateway, wishlist, reviews, coupons, suppliers, multi-vendor, or analytics).

> **Status:** Documentation only. No application code has been written yet.

---

## Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Frontend      | React.js + Vite + JavaScript        |
| Styling       | Tailwind CSS                        |
| HTTP client   | Axios                               |
| Backend       | Node.js + Express.js                |
| Database      | MongoDB + Mongoose                  |
| Auth          | JWT + bcrypt                        |

## Repository Layout

```text
/client   → React frontend (Vite + Tailwind)
/server   → Node.js + Express backend
/docs     → Project documentation (this folder)
```

## Core Features

- **Authentication** — customer register / login / logout, admin login, JWT-protected routes.
- **Admin Panel** — manage categories, products, and orders (view, update status).
- **Public Website** — home, product listing with search + category filter, product details,
  cart, checkout, my-orders.
- **Cart** — add / increase / decrease / remove, stock-aware quantities, live total.
- **Checkout & Orders** — Cash on Delivery only; stock validated, order saved, stock reduced,
  cart cleared.

## Documentation Index

| Doc | Description |
| --- | ----------- |
| [01 – Architecture](docs/01-architecture.md) | High-level system design and request flow |
| [02 – Database Models](docs/02-database-models.md) | User, Category, Product, Order schemas |
| [03 – API Reference](docs/03-api-reference.md) | All REST endpoints, params, and responses |
| [04 – Authentication & Authorization](docs/04-authentication.md) | JWT flow, bcrypt, middleware |
| [05 – Admin Panel](docs/05-admin-panel.md) | Dashboard, categories, products, orders |
| [06 – Public Website](docs/06-public-website.md) | Customer-facing pages and components |
| [07 – Cart, Checkout & Orders](docs/07-cart-checkout-orders.md) | Cart rules and order placement flow |
| [08 – Validation & Security](docs/08-validation-security.md) | Frontend + backend validation rules |
| [09 – UI/UX Guidelines](docs/09-ui-ux-guidelines.md) | Tailwind design conventions |
| [10 – Demo Flow](docs/10-demo-flow.md) | End-to-end walkthrough script |
| [11 – Project Structure](docs/11-project-structure.md) | File/folder layout for client & server |
| [12 – Setup & Installation](docs/12-setup-installation.md) | Prerequisites, env vars, run steps |

## The Main Demo Flow (summary)

```text
Admin Login → Add Category → Add Product → Product appears on Website
→ User Register/Login → Browse Products → Filter by Category → Add to Cart
→ Checkout → Place Order → Order saved in MongoDB → Admin sees Order
→ Admin updates Order Status
```

See [Demo Flow](docs/10-demo-flow.md) for the detailed walkthrough.

## Scope Guardrails

Keep this a **mini** project. Explicitly **out of scope**:

- Payment gateway integration
- Wishlist
- Product reviews / ratings
- Coupons / discounts
- Suppliers / multi-vendor
- Advanced analytics / dashboards beyond basic admin views

## License

For demonstration / educational purposes.
