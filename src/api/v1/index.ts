// ensures that all necessary environment variables are defined after reading from .env
import dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });
// this package is used to parse decorators for building sql queries.
import 'reflect-metadata';

// Express
import express from 'express';
// Cors
import cors from 'cors';
// Middleware
import session from './middleware/session';
// Routes
import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import locationRoutes from './routes/locationRoutes';
import menuRoutes from './routes/menuRoutes';
import foodRoutes from './routes/foodRoutes';
import countryRoutes from './routes/countryRoutes';
import orderRoutes from './routes/orderRoutes';
// Constants, Helpers & Types
import { API_VERSION, SERVER_PORT, SERVER_HOST, serverReady } from './constants';
import { postgresConnect } from './helpers';

// server startup
const initializeApp = () => {
  const app = express();

  // enable this if you run behind a proxy (e.g. nginx) for example, rate limiting
  app.enable('trust proxy');

  // setup cors
  app.use(
    cors({
      credentials: true,
      origin: [`http://${SERVER_HOST}:${SERVER_PORT}`],
    }),
  );

  // middleware that parses json request
  app.use(express.json());

  // session
  app.use(session);
  // user related routes
  app.use(`${API_VERSION}/user`, userRoutes);
  // restaurant related routes
  app.use(`${API_VERSION}/restaurant`, restaurantRoutes);
  // location related routes
  app.use(`${API_VERSION}/location`, locationRoutes);
  // menu related routes
  app.use(`${API_VERSION}/menu`, menuRoutes);
  // food related routes
  app.use(`${API_VERSION}/food`, foodRoutes);
  // country related routes
  app.use(`${API_VERSION}/country`, countryRoutes);
  // order related routes
  app.use(`${API_VERSION}/order`, orderRoutes);

  // main route server status
  app.get(API_VERSION, (_, res) => res.send(serverReady));

  return app;
};

const startServer = async () => {
  // start database server
  await postgresConnect();

  const app = initializeApp();

  // Modified server startup
  await new Promise<void>((resolve) => app.listen(SERVER_PORT, resolve));

  console.log(serverReady);
};

startServer();
