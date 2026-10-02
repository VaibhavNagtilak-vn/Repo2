# 01 – Architecture

## Overview

A classic three-tier MERN architecture:

```text
┌────────────────┐        HTTPS / JSON         ┌────────────────┐        Mongoose        ┌──────────────┐
│  React (Vite)  │  ─────────────────────────▶ │ Express Server │  ────────────────────▶ │   MongoDB    │
│  + Tailwind    │  ◀───────────────────────── │  (REST API)    │  ◀──────────────────── │              │
│  + Axios       │        JSON responses       │  + JWT Auth    │                        └──────────────┘
└────────────────┘                             └────────────────┘
```

- **Client** is a single-page app served by Vite during development. It talks to the
  server only through the REST API using Axios.
- **Server** is a stateless Express API. It authenticates requests with JWT, validates
  input, applies business rules (stock, pricing), and persists through Mongoose.
- **Database** holds four collections: `users`, `categories`, `products`, `orders`.

## Request Lifecycle

```text
Browser action
  → Axios call (attaches JWT from storage if present)
  → Express route
  → Middleware: auth (verify JWT) / admin (verify role) where required
  → Controller: validate input, run business logic
  → Mongoose model → MongoDB
  → JSON response
  → React state update → UI render (+ toast on success/error)
```

## Key Architectural Decisions

1. **Server is the source of truth for price and stock.** The client never dictates the
   final price; the order controller re-reads product prices from MongoDB at order time.
2. **Stateless auth.** No server-side sessions. A signed JWT carries `id` and `role`.
3. **Role separation.** Two roles — `customer` and `admin`. Admin-only operations are
   guarded by dedicated middleware.
4. **REST conventions.** Standard verbs (`GET/POST/PUT/PATCH/DELETE`) and resource paths
   under `/api`.
5. **Cash on Delivery only.** No payment provider is integrated; checkout simply records
   an order with status `Pending`.

## Client State Ownership

| Concern            | Owner                          |
| ------------------ | ------------------------------ |
| Auth token / user  | Client auth context + storage  |
| Cart contents      | Client cart context            |
| Catalog data       | Fetched per-page from API      |
| Orders             | Fetched from API (never cached as truth) |

## Environments

| Env         | Client                | Server             | Database     |
| ----------- | --------------------- | ------------------ | ------------ |
| Development | Vite dev server       | `nodemon` / node   | Local or Atlas |
| Production  | Static build served   | Node process       | MongoDB Atlas |

See [Setup & Installation](12-setup-installation.md) for how to run each tier.
