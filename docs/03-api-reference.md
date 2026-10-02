# 03 – API Reference

Base URL: `/api`

All request/response bodies are JSON. Protected routes require an `Authorization: Bearer <token>` header.

Legend: 🔓 Public · 🔒 Auth (any logged-in user) · 🛡️ Admin only

---

## Auth

| Method | Endpoint              | Access | Description                    |
| ------ | --------------------- | ------ | ------------------------------ |
| POST   | `/api/auth/register`  | 🔓     | Register a new customer        |
| POST   | `/api/auth/login`     | 🔓     | Login customer **or** admin    |

### POST `/api/auth/register`

Request:
```json
{ "name": "Asha", "email": "asha@example.com", "password": "secret1", "confirmPassword": "secret1" }
```
Response `201`:
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Asha", "email": "asha@example.com", "role": "customer" } }
```
Errors: `400` validation / password mismatch, `409` email already exists.

### POST `/api/auth/login`

Request:
```json
{ "email": "admin@example.com", "password": "admin123" }
```
Response `200`:
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Admin", "email": "admin@example.com", "role": "admin" } }
```
Errors: `401` invalid credentials.

---

## Categories

| Method | Endpoint               | Access | Description        |
| ------ | ---------------------- | ------ | ------------------ |
| GET    | `/api/categories`      | 🔓     | List all categories|
| POST   | `/api/categories`      | 🛡️     | Create category    |
| PUT    | `/api/categories/:id`  | 🛡️     | Update category    |
| DELETE | `/api/categories/:id`  | 🛡️     | Delete category    |

Create/Update body:
```json
{ "name": "Electronics", "description": "Phones, laptops and more" }
```

---

## Products

| Method | Endpoint              | Access | Description                       |
| ------ | --------------------- | ------ | --------------------------------- |
| GET    | `/api/products`       | 🔓     | List products (filter + search)   |
| GET    | `/api/products/:id`   | 🔓     | Get one product                   |
| POST   | `/api/products`       | 🛡️     | Create product                    |
| PUT    | `/api/products/:id`   | 🛡️     | Update product                    |
| DELETE | `/api/products/:id`   | 🛡️     | Delete product                    |

### GET `/api/products` query params

| Param      | Example                 | Effect                          |
| ---------- | ----------------------- | ------------------------------- |
| `category` | `?category=electronics` | Filter by category (id or slug) |
| `search`   | `?search=phone`         | Case-insensitive name/desc match|

Example: `GET /api/products?category=electronics&search=phone`

Create/Update body:
```json
{
  "name": "Smartphone X",
  "description": "6.1 inch display, 128GB",
  "price": 19999,
  "image": "https://.../phone.png",
  "category": "<categoryId>",
  "stock": 25
}
```
Errors: `400` price <= 0 / stock < 0 / invalid category.

---

## Orders (customer)

| Method | Endpoint                  | Access | Description                        |
| ------ | ------------------------- | ------ | ---------------------------------- |
| POST   | `/api/orders`             | 🔒     | Place an order from the cart       |
| GET    | `/api/orders/my-orders`   | 🔒     | List the logged-in user's orders   |

### POST `/api/orders`

Request (client sends item ids + quantities only — **no prices**):
```json
{
  "products": [ { "product": "<productId>", "quantity": 2 } ],
  "shippingAddress": {
    "name": "Asha", "phone": "9876543210",
    "address": "12 Main St", "city": "Pune", "pincode": "411001"
  }
}
```
Server behavior: validate stock → read current prices from DB → compute `totalAmount` →
create order (`status: Pending`) → decrement stock → respond.

Response `201`:
```json
{ "order": { "id": "...", "totalAmount": 39998, "status": "Pending", "products": [ ... ] } }
```
Errors: `400` invalid item / insufficient stock, `401` unauthenticated.

---

## Orders (admin)

| Method | Endpoint                            | Access | Description                 |
| ------ | ----------------------------------- | ------ | --------------------------- |
| GET    | `/api/admin/orders`                 | 🛡️     | List all customer orders    |
| PATCH  | `/api/admin/orders/:id/status`      | 🛡️     | Update an order's status    |

### PATCH `/api/admin/orders/:id/status`

Request:
```json
{ "status": "Shipped" }
```
Allowed values: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.
Errors: `400` invalid status.

---

## Standard Response Envelope

- **Success:** entity or `{ message, ... }` with `2xx`.
- **Error:** `{ "message": "Human readable reason" }` with `4xx` / `5xx`.

## HTTP Status Codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | OK                                       |
| 201  | Created                                  |
| 400  | Validation error / bad request           |
| 401  | Missing/invalid token                    |
| 403  | Authenticated but not authorized (admin) |
| 404  | Resource not found                       |
| 409  | Conflict (e.g., duplicate email)         |
| 500  | Unexpected server error                  |
