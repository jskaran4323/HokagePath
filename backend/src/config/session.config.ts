import session from 'express-session';
import MongoStore from 'connect-mongo';

const isProduction = process.env.NODE_ENV === 'production';

export const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || '',
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 7 days
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
};