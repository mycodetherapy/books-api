export const notFound = (err: any, req: any, res: any) => {
  if (req.accepts("json")) {
    res.status(404).send({ error: err.message });
  } else {
    res.status(404).render("errors/404");
  }
};
