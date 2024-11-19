import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './models'; // Импорт моделей и ассоциаций
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    await sequelize.sync();
    logger.info('Database synchronization completed successfully.');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Unable to connect to the database: ${error.message}`);
    } else {
      logger.error('Unable to connect to the database: Unknown error occurred.');
    }
    process.exit(1);
  }
};

startServer();
