```markdown
# Ecommerce Backend API

---

## Overview

This backend API is built with **Express** and **Sequelize** and follows the **MVC pattern** (without a view layer). It serves as the backend for an ecommerce application, providing RESTful endpoints for products, carts, orders, and more.

---

## Request Flow

```

Browser (Client)
↓
HTTP Request
↓
Express App (server.js / app.js)
↓
Middleware (e.g., express.json(), cors())
↓
Routes (via app.use, matched by path & method)
↓
Controllers (handle requests, send responses)
↓
HTTP Response (JSON, text, etc.)

````

---

## Setup and Commands

Initialize a new Node.js project:

```bash
npm init -y
````

> The `-y` flag automatically accepts all defaults.

Install dependencies:

```bash
npm install express dotenv
```

Start the server:

```bash
node server.js
```

---

## Code Structure & MVC Pattern

### Model

* Defined using **Sequelize** to represent database tables.
* Provides built-in methods like `findAll()`, `create()`, `findByPk()`.
* These methods are called by controllers but do not execute on their own.

### Controller (Route Handlers)

* Handle application logic.
* Call model methods in response to HTTP requests.
* Send JSON responses directly to clients.

### No View Layer

* This is a pure API backend.
* No frontend views or templates — data is sent in JSON format.

---

## Important Notes

### Export Syntax

* `export`:
  Must export and import with **exact names** using `{}`.

  ```js
  export function foo() { }
  import { foo } from './file.js';
  ```

* `export default`:
  Export and import using **any name** without `{}`.

  ```js
  export default function foo() { }
  import anyName from './file.js';
  ```

---

## Development Log

### July 29

* Temporary use of `await sequelize.sync({ force: true });` resets DB on every start — remove after testing.
* Data models need refining for `NOT NULL` constraints to avoid missing fields errors.
* Temp data available at `http://localhost:3000/api/products`.

### July 31

* Changed API endpoint:
  from `/api/products` to `/products`.
* Note: Tables are dropped and recreated on every server restart.
* Run lint fix:

  ```bash
  npx eslint . --fix
  ```

### August 2

* Added PUT request for updating cart items (quantity, delivery option).

* Sample PUT request in Postman:

  ```
  URL: cart-items/8c9c52b5-5a19-4bcb-a5d1-158a74287c53
  Body:
  {
    "quantity": 5,
    "deliveryOption": 2
  }
  ```

* Database reset behavior should be checked—SQLite appears to persist some data.

### August 3

* Tested PUT requests with JSON body:

  ```json
  {
    "quantity": 3,
    "deliveryOption": "2"
  }
  ```

* Some routes require **admin authorization** (to be implemented).

* Investigate Sequelize many-to-many setup between Orders and Products:

  ```js
  Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
  Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });
  ```

### August 7

* Many-to-Many relationship explained:

  * One Order can contain many Products.
  * One Product can belong to many Orders.
  * A join table (`OrderProduct`) is required to map this relationship.

---

## Next Steps

* Remove forced DB sync in production.
* Implement admin authorization middleware.
* Complete and refine data models.
* Expand API functionality (e.g., order management, user authentication).

---

## License

This project is open source and free to use.
