import express, { Express } from 'express';


export const applyMiddleware = (app: Express): void => {
  // Body parsing
  app.use(express.urlencoded({ extended: true }));
};
