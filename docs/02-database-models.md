# 02 – Database Models

Four Mongoose models only: **User**, **Category**, **Product**, **Order**.

All timestamps (`createdAt`, `updatedAt`) are enabled via Mongoose `{ timestamps: true }`.

---

## User

Represents both customers and admins, distinguished by `role`.

| Field      | Type     | Rules                                              |
| ---------- | -------- | -------------------------------------------------- |
| `name`     | String   | Required, trimmed                                  |
| `email`    | String   | Required, unique, lowercase, valid email format    |
| `password` | String   | Required, min 6 chars, **hashed with bcrypt**, `select: false` |
| `role`     | String   | Enum: `customer` \| `admin`. Default `customer`    |

Notes:
- `password` is never returned by default queries (`select: false`).
- A pre-save hook (or controller step) hashes the password with bcrypt before persisting.
- An instance method `comparePassword(candidate)` verifies a plaintext password.
- Admin accounts are seeded/created directly in the DB or via a guarded route — not via public register.

---

## Category

| Field         | Type   | Rules                       |
| ------------- | ------ | --------------------------- |
| `name`        | String | Required, unique, trimmed   |
| `description` | String | Optional / short text       |

---

## Product

| Field         | Type     | Rules                                             |
| ------------- | -------- | ------------------------------------------------- |
| `name`        | String   | Required, trimmed                                 |
| `description` | String   | Required                                          |
| `price`       | Number   | Required, **> 0** (positive)                      |
| `image`       | String   | Image URL / path                                  |
| `category`    | ObjectId | Ref `Category`, required (must be a valid category) |
| `stock`       | Number   | Required, integer, **>= 0** (never negative)      |

Notes:
- `category` can be populated for display (`name`).
- Stock is decremented atomically when an order is placed (see Order flow).

---

## Order

| Field             | Type       | Rules                                              |
| ----------------- | ---------- | -------------------------------------------------- |
| `user`            | ObjectId   | Ref `User`, required                               |
| `products`        | Array      | List of order items (see below), at least one item |
| `totalAmount`     | Number     | Required, computed **server-side**, > 0            |
| `shippingAddress` | Object     | Required (see below)                               |
| `status`          | String     | Enum: `Pending` \| `Confirmed` \| `Shipped` \| `Delivered` \| `Cancelled`. Default `Pending` |
| `createdAt`       | Date       | Auto (timestamps)                                  |

### Order item (`products[]` element)

| Field      | Type     | Notes                                  |
| ---------- | -------- | -------------------------------------- |
| `product`  | ObjectId | Ref `Product`                          |
| `name`     | String   | Snapshot of product name at order time |
| `price`    | Number   | **Snapshot of DB price** at order time |
| `quantity` | Number   | Integer, >= 1                          |
| `image`    | String   | Snapshot of product image              |

### Shipping address (`shippingAddress`)

| Field     | Type   | Rules                |
| --------- | ------ | -------------------- |
| `name`    | String | Required             |
| `phone`   | String | Required             |
| `address` | String | Required             |
| `city`    | String | Required             |
| `pincode` | String | Required             |

Notes:
- Payment method is **Cash on Delivery** only (no payment fields stored).
- Item price/name/image are snapshots so historical orders stay accurate even if the
  product later changes.
- `totalAmount` is the sum of `price * quantity` computed from **DB values**, never from
  the client payload.

---

## Relationships

```text
User 1 ──────< N Order
Category 1 ──< N Product
Product 1 ───< N OrderItem (embedded in Order.products)
```
