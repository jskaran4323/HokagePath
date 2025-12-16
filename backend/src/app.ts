// src/app.ts
import express, { Express } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { applyMiddleware } from './middleware';
import { registerRoutes } from './v1/routes';

const app: Express = express();

// Create logger
const logger = pino({ level: 'info' });

// Apply Pino HTTP logger as middleware for all requests
app.use(pinoHttp({ logger }));

// Apply your other middlewares (CORS, body parser, etc.)
applyMiddleware(app);

// Register versioned routes
registerRoutes(app);

export default app;
