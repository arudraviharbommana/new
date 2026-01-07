require('dotenv').config();

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY || 'change-me-in-production',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/new_dev',
  ACCESS_TOKEN_EXPIRE_MINUTES: parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '60', 10),
  ALGORITHM: process.env.ALGORITHM || 'HS256',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',')
};
