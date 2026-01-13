
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.dev' })
}
import mongoose from 'mongoose';
import app from './app';
import pino from 'pino';



const PORT = parseInt(process.env.PORT || '4000', 10);

const MONGODB_URI = process.env.MONGODB_URI || "" ;
const logger = pino({ level: 'info' });

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    logger.info(' Connected to MongoDB: ' + MONGODB_URI);
     
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on http://0.0.0.0:${PORT}`);
    });
    
  } catch (error) {
    logger.error(error, '❌ Failed to start server');
    process.exit(1);
  }
};

startServer();
