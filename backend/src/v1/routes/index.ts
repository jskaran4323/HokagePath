import { Express } from 'express';
import authRoutes from '../../v1/routes/authRoutes';
import workoutRoutes from '../../v1/routes/workoutRoutes';
import mealRoutes from '../../v1/routes/mealRoutes';
import postRoutes from '../../v1/routes/postRoutes';
import commentRoutes from '../../v1/routes/commentRoutes';
import aiRoutes from '../../v1/routes/aiRoutes';
import fitnessProfileRoutes from '../../v1/routes/fitnessProfileRoutes';
import userRoutes from '../../v1/routes/userRoutes';
import uploadRoutes from '../../v1/routes/uploadroutes';

const API_VERSION = 'v1';

export const registerRoutes = (app: Express): void => {
  const baseUrl = `/api/${API_VERSION}`;

  app.use(`${baseUrl}/auth`, authRoutes);
  app.use(`${baseUrl}/workouts`, workoutRoutes);
  app.use(`${baseUrl}/meals`, mealRoutes);
  app.use(`${baseUrl}/posts`, postRoutes);
  app.use(`${baseUrl}/comments`, commentRoutes);
  app.use(`${baseUrl}/ai`, aiRoutes);
  app.use(`${baseUrl}/fitness-profile`, fitnessProfileRoutes);
  app.use(`${baseUrl}/users`, userRoutes);
  app.use(`${baseUrl}/upload`, uploadRoutes);
};
