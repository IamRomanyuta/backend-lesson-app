import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/lessons_db', {
  dialect: 'postgres',
  logging: console.log,
});


export default sequelize;
