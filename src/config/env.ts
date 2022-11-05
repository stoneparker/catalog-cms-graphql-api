import dotenv from 'dotenv';

dotenv.config();

const env = {
  secret: process.env.JWT_SECRET || '',
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
};

export default env;
