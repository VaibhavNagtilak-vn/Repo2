# 10 – Demo Flow

The complete end-to-end walkthrough the finished project must support. Use this as the
manual test script / demo script.

```text
Admin Login
   ↓
Add Category
   ↓
Add Product
   ↓
Product appears on Website
   ↓
User Register/Login
   ↓
Browse Products
   ↓
Filter by Category
   ↓
Add to Cart
   ↓
Checkout
   ↓
Place Order
   ↓
Order saved in MongoDB
   ↓
Admin sees Order
   ↓
Admin updates Order Status
```

---

## Step-by-step

### 1. Admin Login
- Go to `/login`, sign in with the seeded admin credentials.
- On success the UI shows admin navigation; navigate to `/admin`.

### 2. Add Category
- Admin → Categories → **Add**.
- Enter Name (e.g. `Electronics`) + Description → save.
- Expect: success toast, category appears in the table.

### 3. Add Product
- Admin → Products → **Add**.
- Fill: name, description, price (> 0), image URL, category (the one just added), stock (>= 0).
- Expect: success toast, product appears in the products table.

### 4. Product appears on Website
- Open the public `/products` page (logged out is fine).
- Expect: the new product card is visible with image, name, price, category, Add to Cart.

### 5. User Register / Login
- Go to `/register`, create a customer (name, email, password, confirm password).
- Or `/login` with an existing customer.
- Expect: redirected to the store, navbar shows the user menu.

### 6. Browse Products
- Visit `/products`; click a card to open `/products/:id`.
- Expect: full product details and stock indicator.

### 7. Filter by Category
- Use the category pills (`All | Electronics | Fashion | Shoes`) and the search box.
- Expect: grid updates to matching products (`?category=...&search=...`).

### 8. Add to Cart
- On a product (card or details page), click **Add to Cart**; adjust quantity.
- Expect: cart badge increments; quantity cannot exceed stock; toast confirms.

### 9. Checkout
- Open `/cart` → review items → proceed to `/checkout`.
- Fill shipping form: name, phone, address, city, pincode. Payment = **Cash on Delivery**.

### 10. Place Order
- Click **Place Order**.
- Server: validates stock → reads DB prices → creates order (`Pending`) → reduces stock → returns order.
- Expect: success toast, cart cleared, redirect to `/my-orders`.

### 11. Order saved in MongoDB
- Verify the order exists with correct items, `totalAmount`, `shippingAddress`, `status: Pending`.
- Verify product stock was reduced accordingly.

### 12. Admin sees Order
- Admin → Orders. Expect the new order in the table.
- Open it → verify items, total, and shipping details.

### 13. Admin updates Order Status
- Change status (e.g. `Pending → Confirmed → Shipped → Delivered`) via the status control.
- Expect: success toast; the customer's **My Orders** reflects the new status.

---

## Verification Checklist

- [ ] Admin routes reject non-admins (403 / redirect).
- [ ] Duplicate email registration is blocked (409).
- [ ] Product price > 0 and stock >= 0 enforced.
- [ ] Category must be valid when creating a product.
- [ ] Order total is computed from DB prices, not client input.
- [ ] Stock cannot be oversold; it decrements on order.
- [ ] Cart clears after a successful order.
- [ ] Order status is visible to both admin and customer.
- [ ] UI is responsive on mobile, tablet, and desktop.
