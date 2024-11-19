import express, { Request, Response, NextFunction } from 'express';
import lessonRoutes from './routes/lessonRoutes';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(compression());
app.use('/api/v1/lessons', lessonRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
