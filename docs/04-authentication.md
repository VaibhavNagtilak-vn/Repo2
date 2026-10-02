# 04 – Authentication & Authorization

## Approach

- **Password hashing:** bcrypt (salt rounds 10). Plaintext passwords are never stored.
- **Tokens:** JSON Web Tokens (JWT) signed with a server secret (`JWT_SECRET`).
- **Roles:** `customer` and `admin`, stored on the User document and embedded in the JWT payload.

---

## Token Payload

```json
{ "id": "<userId>", "role": "customer", "iat": 1730000000, "exp": 1730086400 }
```

- Signed with `JWT_SECRET`.
- Expiry controlled by `JWT_EXPIRES_IN` (e.g. `7d`).

---

## Registration Flow (customer)

```text
POST /api/auth/register { name, email, password, confirmPassword }
  → Validate all fields present
  → Validate email format
  → Validate password length >= 6
  → Validate password === confirmPassword
  → Check email uniqueness (409 if taken)
  → Hash password with bcrypt
  → Create User (role: customer)
  → Sign JWT
  → Return { token, user }
```

> Admins are **not** created through public registration. Seed an admin directly or via a
> guarded script.

---

## Login Flow (customer & admin)

```text
POST /api/auth/login { email, password }
  → Find user by email (explicitly select password)
  → If not found → 401 invalid credentials
  → bcrypt.compare(password, user.password)
  → If mismatch → 401 invalid credentials
  → Sign JWT with { id, role }
  → Return { token, user }
```

The same endpoint serves admins and customers; the `role` in the returned user/token
drives which UI and routes are accessible.

---

## Logout

Logout is client-side: clear the stored token and user from state/storage, then redirect.
Because JWT is stateless, no server call is required.

---

## Middleware

### `protect` (auth middleware)

```text
Read Authorization header → expect "Bearer <token>"
  → Verify signature + expiry with JWT_SECRET
  → Attach req.user = { id, role } (load user if needed)
  → On failure → 401
```

Applied to: `POST /api/orders`, `GET /api/orders/my-orders`, and all admin routes.

### `admin` (admin middleware)

```text
Requires `protect` to have run
  → If req.user.role !== 'admin' → 403
  → Else next()
```

Applied to: all category write routes, all product write routes, `/api/admin/*`.

---

## Client Token Handling

- Store token + user in an auth context, persisted to `localStorage` (or sessionStorage).
- Axios instance attaches `Authorization: Bearer <token>` via a request interceptor.
- On `401` from any call, the client clears auth state and redirects to login.

---

## Route Protection Summary

| Route group                     | Middleware         |
| ------------------------------- | ------------------ |
| `/api/auth/*`                   | none (public)      |
| `GET /api/categories`           | none (public)      |
| `GET /api/products`, `/:id`     | none (public)      |
| `POST/PUT/DELETE categories`    | `protect` + `admin`|
| `POST/PUT/DELETE products`      | `protect` + `admin`|
| `/api/orders` (place, my-orders)| `protect`          |
| `/api/admin/*`                  | `protect` + `admin`|

## Security Notes

- Never trust client-sent prices — see [Validation & Security](08-validation-security.md).
- Keep `JWT_SECRET` in environment variables only; never commit it.
- Use short, informative auth error messages ("Invalid credentials") to avoid leaking
  whether an email exists.
