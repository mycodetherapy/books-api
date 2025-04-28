export const badRequest = (err: any, req: any, res: any, next: any) => {
  if (err.status === 400) {
    if (req.accepts("json")) {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(400).render("errors/400", { message: err.message });
    }
  }
  next(err);
};
