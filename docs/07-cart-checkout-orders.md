# 07 – Cart, Checkout & Orders

## Cart

The cart lives in client state (a cart context), persisted to `localStorage` so it survives refresh.

### Cart item shape

```json
{ "product": "<id>", "name": "...", "price": 19999, "image": "...", "quantity": 1, "stock": 25 }
```

> `price` shown in the cart is for display only. The **order total is recomputed on the
> server** from DB prices at checkout.

### Operations

| Action            | Behavior                                                          |
| ----------------- | ----------------------------------------------------------------- |
| Add product       | If new → add with qty 1; if present → increment qty              |
| Increase quantity | `qty + 1`, **capped at available stock**                          |
| Decrease quantity | `qty - 1`, minimum 1 (removing at 1 is a separate action)         |
| Remove product    | Delete the item from the cart                                     |
| Total price       | Sum of `price * quantity` across items (display value)           |

### Stock rule

Quantity can **never exceed** the product's available stock. The increase control is
disabled (and/or shows a toast) at the stock limit.

### Empty state

When the cart is empty, show an empty state with a "Browse products" call to action and
disable checkout.

---

## Checkout

Requires an authenticated customer (redirect to login otherwise).

### Shipping form fields

| Field     | Required |
| --------- | -------- |
| Name      | yes      |
| Phone     | yes      |
| Address   | yes      |
| City      | yes      |
| Pincode   | yes      |

### Payment method

**Cash on Delivery only.** No payment gateway, no card/UPI fields.

---

## Place Order Flow

```text
Cart
 ↓
Validate stock (each item qty <= current DB stock)
 ↓
Create Order (read current prices from DB, compute totalAmount server-side)
 ↓
Save Order in MongoDB (status: Pending)
 ↓
Reduce Product Stock (atomic decrement per item)
 ↓
Clear Cart
```

### Server responsibilities (POST `/api/orders`)

1. Authenticate the user (`protect`).
2. Validate the payload: at least one item, valid product ids, quantities >= 1,
   complete shipping address.
3. For each item, load the product from MongoDB:
   - If product missing → `400`.
   - If `quantity > stock` → `400` insufficient stock (do not partially create).
   - Use the **DB price**, not any client-sent price.
4. Compute `totalAmount = Σ (dbPrice * quantity)`.
5. Create the Order with item snapshots (name, price, image) and `status: Pending`.
6. Decrement stock for each product (`stock -= quantity`), guarding against negatives.
7. Return the created order (`201`).

> Steps 5–6 should be performed so that a failure (e.g. concurrent stock depletion) does
> not leave an order created without stock reduction. Validate all stock **before**
> creating the order.

### Client responsibilities

- On success: clear the cart, show a success toast, redirect to **My Orders** (or an
  order-confirmation view).
- On error: show the server message (e.g. "Insufficient stock for X") and keep the cart.

---

## My Orders (customer)

`GET /api/orders/my-orders` → list of the user's orders, newest first.

Each order shows: order id/date, items (image, name, qty, price), `totalAmount`,
`shippingAddress`, and a **status badge**. Read-only for customers — status changes are
admin-only (see [Admin Panel](05-admin-panel.md)).

---

## Order Status Lifecycle

```text
Pending → Confirmed → Shipped → Delivered
   ↘         ↘          ↘
         Cancelled (admin may cancel before delivery)
```

Statuses: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.
