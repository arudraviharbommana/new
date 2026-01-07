const express = require('express');
const cors = require('cors');
const config = require('./config');

const apiRouter = require('./routes/api');

const app = express();

app.use(cors({ origin: config.CORS_ORIGINS }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
