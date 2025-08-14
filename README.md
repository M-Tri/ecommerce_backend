````markdown
# Ecommerce Backend API

---

## Overview

This backend API is built with **Express** and **Sequelize** using the **MVC pattern** (without a view layer).  
It provides RESTful endpoints for products, carts, orders, and more, serving as the backend for an ecommerce application.

---

## Features

- RESTful API endpoints for products, carts, and orders  
- Sequelize ORM for database management  
- Follows the MVC pattern (Models → Controllers → Routes)  
- JSON responses only (no frontend rendering)  

---

## Setup & Installation

1. **Clone the repository**  

```bash
git clone <repository-url>
cd ecommerce-backend
````

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
node server.js
```

> The API will run on `http://localhost:3000` by default.
---

## Project Structure

```
ecommerce-backend/
│
├─ models/          # Sequelize models
├─ routes/          # API routes
├─ controllers/     # Request handlers
├─ server.js        # Entry point
├─ database.sqlite  # SQLite database
├─ dist/            # Optional build output
└─ README.md
```

---

## Notes for Developers

* **Database:**

  * Temporary `sequelize.sync({ force: true })` resets the database on every start — remove in production.
  * Uses SQLite for simple persistence.

* **Relationships:**

  * Orders and Products have a many-to-many relationship via a join table (`OrderProduct`).

---

## Acknowledgments

This project was developed based on the tutorials provided by [SuperSimpleDiv](https://www.youtube.com/@SuperSimpleDev). Their tutorials on building a React ecommerce project were instrumental in creating this backend.

---

## License

This project is open source and free to use.

```