
import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './v1/routes/authRoutes';
// Load environment variables
import workoutRoutes from './v1/routes/workoutRoutes';
import mealRoutes from './v1/routes/mealRoutes';
import postRoutes from './v1/routes/postRoutes';
import commentRoutes from './v1/routes/commentRoutes';
import aiRoutes from './v1/routes/aiRoutes';
import fitnessProfileRoutes from './v1/routes/fitnessProfileRoutes';
import userRoutes from './v1/routes/userRoutes';
import uploadRoutes from './v1/routes/uploadroutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization", 

}));


app.use(session({
secret: process.env.SESSION_SECRET || "",
resave: false,
saveUninitialized: false,
store: MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
  ttl: 7*24*60*60
}),
cookie: {
  maxAge: 7*24*60*60*1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
}
}));


const API_VERSION = "v1";

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/fitness-profile', fitnessProfileRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Basic test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to HokeagePath API! 🍥' });
});
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;