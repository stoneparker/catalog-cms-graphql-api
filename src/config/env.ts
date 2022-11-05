import dotenv from 'dotenv';

dotenv.config();

const env = {
  secret: process.env.JWT_SECRET || '',
};

export default env;
