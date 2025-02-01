export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(404).render('errors/500');
};
