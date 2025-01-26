export const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Resource not found',
    method: req.method,
    url: req.originalUrl,
  });
};
