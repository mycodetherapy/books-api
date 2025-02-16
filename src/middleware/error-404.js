export const notFound = (err, req, res, next) => {
  if (req.accepts('json')) {
    res.status(404).send({ error: err.message });
  } else {
    res.status(404).render('errors/404');
  }
};