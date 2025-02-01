export const notFound = (req, res, next) => {
  res.status(404).render('errors/404');
};
