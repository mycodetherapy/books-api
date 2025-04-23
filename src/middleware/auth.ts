export const isAuthenticated = (req: any, res: any, next: any): any => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
};
