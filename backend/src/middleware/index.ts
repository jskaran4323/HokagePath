import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import { corsConfig } from '../config/cors.config';
import { sessionConfig } from '../config/session.config';

export const applyMiddleware = (app: Express): void => {
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use(cors(corsConfig));

  // Session
  app.use(session(sessionConfig));
};
