import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './db.js';
import './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');

    await sequelize.sync();
    console.log('Database synced.');

    //Accepts cross-origin requests (client, server are from the same pc or network). This is disabled by default.
    app.use(cors());
    // Parses incoming request bodies with JSON payloads,
    // so you can access the data as a JavaScript object via req.body.
    app.use(express.json());    app.use(express.json());
    // Mounts all routes defined in 'routes' at the root path '/'. 
    // So, any routes inside 'routes' (like '/users', '/posts', etc.) will be accessible starting from '/'.
    app.use('/', routes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
