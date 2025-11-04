import { Router } from "express";

const apiRouter = Router();

/**
 * @description POST method for registering a new user
 * @param {string} email  has to be a valid email
 * @param {string} password has to fullfill the password strength
 */
apiRouter.post("/register", (req, res) => {
  res.status(200).json({
    message: "hello from register",
  });
});

export default apiRouter;
