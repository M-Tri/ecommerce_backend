# Ecommerce Backend API

A RESTful ecommerce backend built with Express, Sequelize, and SQLite.
The API supports product browsing/search, cart management, delivery options, order creation, and payment summary calculation for a React ecommerce frontend.

## Features

- Product listing, search, creation, update, and deletion
- Cart item creation, quantity updates, and deletion
- Delivery option support
- Order creation from current cart contents
- Payment summary calculation with shipping and tax
- SQLite persistence through Sequelize ORM
- MVC-style route/model organization
- Seed and reset scripts for local development data
- API tests for core product and cart workflows

## Tech Stack

- Node.js
- Express
- Sequelize
- SQLite
- JavaScript ES Modules
- ESLint
- Vitest
- node-mocks-http

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Reset and seed the database:

```bash
npm run db:reset
```

4. Start the API:

```bash
npm start
```

The API runs on `http://localhost:3000` by default.

For development with automatic restarts:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the API server |
| `npm run dev` | Start the API with Nodemon |
| `npm run seed` | Insert default data into empty tables |
| `npm run db:reset` | Recreate the database and seed default data |
| `npm run lint` | Run ESLint |
| `npm test` | Run API tests |

## Testing

Run the API test suite:

```bash
npm test
```

The tests run against the exported Express app in `app.js`, so you do not need to start the server first.

Current test coverage:

| Test File | What It Checks |
|---|---|
| `tests/products.test.js` | `GET /api/products` returns seeded products |
| `tests/products.test.js` | `GET /api/products?search=shirt` filters products by name or keyword |
| `tests/cartItems.test.js` | `POST /api/cart-items` adds a valid product to the cart |
| `tests/cartItems.test.js` | `POST /api/cart-items` rejects invalid quantities |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health/info response |
| GET | `/api` | API home response |
| GET | `/api/products` | List products |
| GET | `/api/products?search=shirt` | Search products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/cart-items` | List cart items |
| GET | `/api/cart-items?expand=product` | List cart items with product details |
| GET | `/api/cart-items/:productId` | Get a cart item |
| POST | `/api/cart-items` | Add item to cart |
| PUT | `/api/cart-items/:productId` | Update cart item |
| DELETE | `/api/cart-items/:productId` | Delete cart item |
| GET | `/api/delivery-options` | List delivery options |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/:id?expand=products` | Get order with products |
| POST | `/api/orders` | Create order from current cart |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |
| GET | `/api/payment-summary` | Get cart payment summary |
| POST | `/api/reset` | Clear database tables |

## Example Requests

Create a product:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cotton T-Shirt",
    "image": "images/products/cotton-shirt.jpg",
    "priceCents": 1299,
    "keywords": ["shirt", "cotton", "apparel"],
    "rating": {
      "stars": 4.5,
      "count": 20
    }
  }'
```

Add an item to the cart:

```bash
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
    "quantity": 1,
    "deliveryOptionId": "1"
  }'
```

## Project Structure

```text
ecommerce_backend/
├─ controllers/
├─ defaultData/
├─ images/
├─ models/
├─ routes/
├─ scripts/
│  ├─ resetDb.js
│  └─ seed.js
├─ tests/
├─ app.js
├─ db.js
├─ server.js
├─ package.json
└─ README.md
```

## Development Notes

- `server.js` handles startup only: environment loading, database connection, sync, and listening.
- `app.js` exports the Express app so tests can run against routes without starting a network server.
- Database seeding is handled by `scripts/seed.js`.
- `npm run db:reset` is the only workflow that force-resets the SQLite database.
- Order creation uses a transaction so order rows, order-product rows, and cart clearing succeed or fail together.

## License

This project is open source and free to use.
