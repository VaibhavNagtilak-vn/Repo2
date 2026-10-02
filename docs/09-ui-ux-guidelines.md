# 09 – UI/UX Guidelines

Styling is done with **Tailwind CSS**. The design goal is modern, clean, professional,
and **not over-designed**.

---

## Principles

- Simple, consistent spacing and typography.
- Clear visual hierarchy; one primary action per view.
- Fully responsive: mobile → tablet → desktop.
- Feedback for every state: loading, empty, error, success.

---

## Layout Building Blocks

### Cards
Used for product tiles, order summaries, and admin list items:
- Rounded corners (`rounded-lg`), subtle border/shadow (`shadow-sm`, `border`).
- Consistent padding (`p-4`).
- Image on top, content below for product cards.

### Responsive Navbar
- Sticky top bar, brand left, links center/right, cart + auth right.
- Hamburger menu on mobile that collapses links into a panel.
- Cart icon shows an item-count badge.

### Admin Sidebar
- Fixed/left sidebar on desktop with section links (Dashboard, Categories, Products, Orders).
- Collapses to a toggleable drawer on mobile.
- Content area to the right with a top bar (page title, admin name, logout).

### Tables (Admin)
- Clean rows with hover state, header row visually distinct.
- Horizontally scrollable on small screens.
- Action buttons (Edit / Delete / View) in the last column.

---

## Interactive States

| State             | Treatment                                              |
| ----------------- | ------------------------------------------------------ |
| Loading           | Spinner or skeleton placeholders                       |
| Empty             | Friendly message + icon + a call-to-action button      |
| Error             | Toast (red) with the server message                    |
| Success           | Toast (green) confirming the action                    |
| Disabled          | Reduced opacity + `cursor-not-allowed` (e.g. out of stock) |

### Toast Messages
Non-blocking notifications (top-right or bottom), auto-dismiss, for:
add-to-cart, login/logout, save/delete success, order placed, and errors.

### Confirmation Dialog
Required before **delete** actions (category, product). A modal with a clear
"Delete" (destructive, red) and "Cancel" choice.

---

## Responsive Grids

Product grid column counts:

| Breakpoint      | Columns |
| --------------- | ------- |
| Mobile (`<640`) | 1       |
| `sm` (≥640)     | 2       |
| `md` (≥768)     | 3       |
| `lg` (≥1024)    | 4       |

Use Tailwind responsive utilities, e.g. `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`.

---

## Color & Status Badges

Keep a restrained palette (one primary/accent color + neutrals). Order status badges:

| Status     | Suggested color |
| ---------- | --------------- |
| Pending    | amber / yellow  |
| Confirmed  | blue            |
| Shipped    | indigo / purple |
| Delivered  | green           |
| Cancelled  | red / gray      |

Badges are small pill labels (`rounded-full px-2 py-1 text-xs`).

---

## Accessibility & Polish

- Sufficient color contrast; focus states on interactive elements.
- Meaningful `alt` text on product images.
- Buttons large enough to tap on mobile.
- Consistent spacing scale throughout.

Keep it simple and professional — clarity over decoration.
