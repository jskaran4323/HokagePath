// src/app.ts
import express, { Express } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import session from 'express-session';
import cors from 'cors';

import { sessionConfig } from './config/session.config';
import { corsConfig } from './config/cors.config';
import { applyMiddleware } from './middleware';
import { registerRoutes } from './v1/routes';

const app: Express = express();

// Create logger
const logger = pino({ level: 'info' });

// Apply Pino HTTP logger as middleware for all requests
app.use(pinoHttp({ logger }));

// Enable CORS
app.use(cors(corsConfig));

// Parse JSON
app.use(express.json());

// Session middleware
app.use(session(sessionConfig));

// Remove Cache-Control to allow cookies
app.use((req, res, next) => {
  res.removeHeader('Cache-Control');
  next();
});

// Apply your other middlewares if any
applyMiddleware(app);

// Register versioned routes
registerRoutes(app);

export default app;
