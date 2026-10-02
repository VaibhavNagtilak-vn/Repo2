# 06 – Public Website

A modern, clean, fully responsive customer-facing storefront built with React + Tailwind.

---

## Pages

| Page             | Path               | Purpose                                          |
| ---------------- | ------------------ | ------------------------------------------------ |
| Home             | `/`                | Hero, featured/recent products, category shortcuts |
| Products         | `/products`        | Product grid with search + category filter       |
| Product Details  | `/products/:id`    | Full product info + add to cart                  |
| Cart             | `/cart`            | Review items, quantities, total                  |
| Checkout         | `/checkout`        | Shipping form + place order (COD)                |
| Login            | `/login`           | Customer / admin login                           |
| Register         | `/register`        | Customer registration                            |
| My Orders        | `/my-orders`       | Logged-in user's order history                   |

---

## Product Cards

Each card in the grid shows:

- **Product image**
- **Name**
- **Price**
- **Category**
- **Add to Cart** button

Cards sit in a **responsive grid**: 1 column (mobile) → 2–3 (tablet) → 4 (desktop).

---

## Filtering & Search

On the Products page:

- **Category filter** as pill/tab bar:
  ```text
  All | Electronics | Fashion | Shoes
  ```
  Selecting a category applies `?category=<value>`.
- **Search box** applies `?search=<term>` (case-insensitive match on name/description).
- Both combine: `GET /api/products?category=electronics&search=phone`.
- Filters update the URL query params so state is shareable/back-button friendly.

---

## Product Details

- Large image, name, price, category, description, stock indicator.
- Quantity selector (bounded by stock) + **Add to Cart**.
- "Out of stock" state disables the add button when `stock === 0`.

---

## Navbar

Responsive navbar with:

- Brand / logo → Home
- Links: Home, Products
- Search entry (on Products page)
- Cart icon with item count badge
- Auth area: Login / Register, or user menu (My Orders, Logout) when logged in
- Admin link/menu when the logged-in user has `role === 'admin'`
- Mobile: collapses into a hamburger menu

---

## UX Requirements

- **Loading states** (skeletons or spinners) while fetching products.
- **Empty states** for no search results / empty cart / no orders.
- **Toast messages** on add-to-cart, login, order placement, and errors.
- **Fully responsive** across mobile, tablet, desktop.

See [UI/UX Guidelines](09-ui-ux-guidelines.md) for shared design conventions and
[Cart, Checkout & Orders](07-cart-checkout-orders.md) for cart behavior.
