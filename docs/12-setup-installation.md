# 12 – Setup & Installation

> These are the steps to run the project **once code exists**. Currently the repo contains
> documentation only.

---

## Prerequisites

- **Node.js** ≥ 18 (recommended 20+)
- **npm** (or yarn/pnpm)
- **MongoDB** — a local instance or a MongoDB Atlas connection string
- **Git**

---

## Environment Variables

### Server (`/server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini-ecommerce
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### Client (`/client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files. They are listed in `.gitignore`.

---

## Seed an Admin User

Admins are not created via public registration. After starting the server once, run the
seed script to create the initial admin:

```bash
cd server
node src/seed/seedAdmin.js
```

Example seeded credentials (change before any real use):

```text
email: admin@example.com
password: admin123
```

---

## Run the Backend

```bash
cd server
npm install
npm run dev        # nodemon (dev)
# or: npm start    # production
```

Server listens on `http://localhost:5000` (API under `/api`).

---

## Run the Frontend

```bash
cd client
npm install
npm run dev
```

Vite dev server on `http://localhost:5173`.

---

## Run Both Together (optional)

From the repo root, use a helper (e.g. `concurrently`) if configured:

```bash
npm run dev   # starts server + client together
```

---

## Typical Development Order

1. Set up MongoDB and `.env` files.
2. Start the server; seed the admin.
3. Log in as admin → add categories → add products.
4. Start the client; verify products appear on the public site.
5. Register a customer → browse → add to cart → checkout → place order.
6. As admin → view the order → update its status.

Follow [Demo Flow](10-demo-flow.md) as the acceptance script.

---

## Production Build (client)

```bash
cd client
npm run build      # outputs static assets to /client/dist
```

Serve `dist` via any static host; point `VITE_API_URL` at the deployed API.

---

## Troubleshooting

| Symptom                              | Likely cause / fix                                  |
| ------------------------------------ | --------------------------------------------------- |
| `MongooseServerSelectionError`       | MongoDB not running / wrong `MONGO_URI`             |
| 401 on every protected call          | Missing/expired token, or `JWT_SECRET` mismatch     |
| CORS error in browser                | `CLIENT_ORIGIN` not allowed in server CORS config   |
| Client can't reach API               | `VITE_API_URL` wrong or server not running          |
| Admin routes return 403              | Logged-in user `role` is not `admin`                |
