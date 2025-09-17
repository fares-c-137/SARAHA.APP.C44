import logUtil from '../utils/logUtil.js';

export const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  logUtil.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
};