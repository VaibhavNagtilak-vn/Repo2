# 05 – Admin Panel

A simple, responsive admin dashboard. Layout = **sidebar + top bar + content area**.
Accessible only after **admin login**; guarded on the client and the server.

---

## Access Control

- Client: an admin route guard checks `role === 'admin'`; non-admins are redirected.
- Server: every admin API call passes through `protect` + `admin` middleware.

---

## Dashboard Sections

### 1. Categories

CRUD over categories. Presented in a **table** with Add / Edit / Delete actions.

| Action | Behavior                                                     |
| ------ | ------------------------------------------------------------ |
| Add    | Modal/form with `name`, `description` → POST `/api/categories` |
| Edit   | Pre-filled form → PUT `/api/categories/:id`                  |
| Delete | **Confirmation dialog** → DELETE `/api/categories/:id`       |
| View   | List all categories                                          |

Fields: **Name**, **Description**.

### 2. Products

CRUD over products in a **table** (image thumbnail, name, price, category, stock, actions).

| Action | Behavior                                                     |
| ------ | ------------------------------------------------------------ |
| Add    | Form → POST `/api/products`                                  |
| Edit   | Pre-filled form → PUT `/api/products/:id`                    |
| Delete | **Confirmation dialog** → DELETE `/api/products/:id`         |
| View   | List all products                                            |

Fields: **Product name**, **Description**, **Price**, **Image**, **Category**, **Stock**.

Validation (client + server): price > 0, stock >= 0, category must be a valid existing category.

### 3. Orders

Read + status management (admins do not create orders).

| Action          | Behavior                                                      |
| --------------- | ------------------------------------------------------------- |
| View all        | Table of all customer orders → GET `/api/admin/orders`        |
| View details    | Order detail view: items, quantities, total, shipping address |
| Change status   | Status selector → PATCH `/api/admin/orders/:id/status`        |

Order statuses:

```text
Pending → Confirmed → Shipped → Delivered
                ↘ Cancelled (from any non-final state)
```

Status badges use distinct colors (see [UI/UX Guidelines](09-ui-ux-guidelines.md)).

---

## UX Requirements

- **Responsive:** sidebar collapses to a toggle/menu on mobile; tables scroll horizontally.
- **Loading states** on every fetch and mutation.
- **Empty states** when there are no categories / products / orders.
- **Toast messages** for success and error outcomes.
- **Confirmation dialog** before any delete.

---

## Suggested Admin Routes (client)

```text
/admin                 → Dashboard overview
/admin/categories      → Categories table
/admin/products        → Products table
/admin/orders          → Orders table
/admin/orders/:id      → Order detail
/admin/login           → Admin login (or shared login page)
```
