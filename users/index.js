import { Router } from "express";

const apiRouter = Router();

/**
 * @description POST method for registering a new user
 * @param {string} email  has to be a valid email
 * @param {string} password has to fullfill the password strength
 */
apiRouter.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(401).json({
      message: "Please provide both email and password",
    });
  } else {
    res.status(200).json({
      message: "hello from register",
      body: `The body is ${JSON.stringify(req.body)}`,
    });
  }
});

export default apiRouter;
