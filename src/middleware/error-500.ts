export const errorHandler = (err: any, req: any, res: any) => {
  console.error(err.stack);

  if (req.accepts("json")) {
    res.status(500).send({ error: err.message });
  } else {
    res.status(500).render("errors/500");
  }
};
