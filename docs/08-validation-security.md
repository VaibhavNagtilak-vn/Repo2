# 08 – Validation & Security

Validation happens on **both** the frontend (fast feedback) and the backend (the real gate).
Never rely on client validation alone.

---

## Validation Rules

| Rule                        | Where        | Detail                                   |
| --------------------------- | ------------ | ---------------------------------------- |
| Required fields             | FE + BE      | No empty required inputs                 |
| Valid email                 | FE + BE      | Standard email format                    |
| Password min 6 characters   | FE + BE      | Reject shorter passwords                 |
| Confirm password matches    | FE + BE      | `password === confirmPassword`           |
| Unique email                | BE           | DB unique index → `409` on conflict      |
| Positive product price      | FE + BE      | `price > 0`                              |
| Stock cannot be negative    | FE + BE      | `stock >= 0`                             |
| Valid category              | BE           | Category id must reference an existing Category |
| Quantity within stock       | BE           | Order item `quantity <= product.stock`   |
| Order status enum           | BE           | Only the 5 allowed statuses              |

---

## Security Controls

### Password hashing
- bcrypt with salt rounds 10.
- `password` field has `select: false`; it is only read explicitly during login.

### JWT authentication
- Signed with a server-only `JWT_SECRET` (env var, never committed).
- Token carries `id` + `role`; verified by `protect` middleware.

### Protected admin routes
- `admin` middleware enforces `role === 'admin'` → `403` otherwise.
- All catalog writes and `/api/admin/*` require it.

### Never trust the client for money
- **Product price is read from MongoDB at order time.** Any price in the client payload is
  ignored. `totalAmount` is computed server-side.
- This prevents price tampering (e.g. editing the cart payload to pay less).

### Stock integrity
- Stock is validated before an order is created and decremented so it can never go negative.
- Guard against overselling when stock is insufficient → reject the order.

---

## Input Sanitization / Hardening

- Validate and cast ids (ObjectId) — reject malformed ids with `400`/`404`.
- Trim strings; enforce sensible max lengths on text fields.
- Use parameterized Mongoose queries (no string-built queries) to avoid injection.
- Enable CORS restricted to the client origin.
- Return generic auth errors ("Invalid credentials") — do not reveal whether an email exists.
- Keep secrets (`MONGO_URI`, `JWT_SECRET`) in `.env`; add `.env` to `.gitignore`.
- Consider `express-rate-limit` on auth endpoints and `helmet` for headers (optional hardening).

---

## Error Handling

- Central Express error handler returns consistent JSON: `{ message }` with proper status.
- Mongoose validation errors and duplicate-key errors are mapped to `400` / `409`.
- Never leak stack traces or internal details to the client in production.

---

## Frontend Validation UX

- Inline field errors on blur/submit.
- Disable submit while a request is in flight.
- Surface server error messages via toasts.
