# ecommerce_backend

### Map
--- 
---
```pgsql
Browser (Client)
   ↓
HTTP Request
   ↓
Express App (e.g. defined in server.js or app.js)
   ↓
Middleware (e.g. express.json(), cors(), etc.)
   ↓
Routes (mounted via app.use and matched by path/method)
   ↓
Controllers (functions that handle the request and send a response)
   ↓
HTTP Response (JSON, text, etc. sent back to client)
```
### Commands
---
---

```bash 
npm init -y
```
The -y Automatically answers "yes" to all prompts using the defaults.
```bash
npm install express dotenv
```
```bash
node server.js
```

### Notes
--- 
---

#### export vs export default

* **`export`**: You need to export and import the **exact name**, and you must use `{}` when importing.
* **`export default`**: You can export and import using **any name**, and you **do not** use `{}` when importing.

#### July 29, things to consider for next session:
- This is temp : await sequelize.sync({ force: true }); It deletes data every time before inserting the default product. Fix after testing.
- Data models are not complete. Check if some values are must not be null. This will cause error when data for row is not complet (does not have all feilds like products does not have stars ...)
- run with node server.js
- Temp data can be seen at http://localhost:3000/api/products
#### MVC
---
#### MVC in Express + Sequelize (No View Layer)

This backend API follows the MVC pattern, but without a view layer. Here's a summary of how the components work:

---

##### ✅ Model

1. The model is defined using Sequelize and represents **the structure of a database table (table definitions)**.  
2. Sequelize automatically provides methods like `findAll()`, `create()`, and `findByPk()` on the model for interacting with the database(like a class).  
3. These methods exist on the model (e.g. `User.findAll()`), but they do not execute unless explicitly called from controller or route.

---

##### ✅ Controller (or Route)

4. The controller or route calls these model methods in response to HTTP requests.  
5. This keeps the model focused on defining and managing data, while the controller handles application logic and request flow.

---

##### 🚫 No View Layer

6. There is no "view" layer in this backend — instead, the controller sends JSON responses directly to the client.