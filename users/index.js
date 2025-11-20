import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth-middleware.js";

// recreate __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRouter = Router();

/**
 * @description POST method for registering a new user
 * @param {string} email  has to be a valid email
 * @param {string} password has to fullfill the password strength
 */
apiRouter.post("/register", async (req, res) => {
  // bad request - cannot continue
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      message: "Please provide both email and password",
    });
  } else {
    // add user to DB
    const filePath = path.join(__dirname, "../db/db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // verify if the user with given email already exists
    const userAlreadyExists = data.users.find(
      (user) => user.email === req.body.email
    );

    if (userAlreadyExists) {
      res.status(407).json({
        message: "user already exists",
      });
    } else {
      // crypt password
      const cryptedPassword = await bcrypt.hash(req.body.password, 5);

      const newUsers = [
        ...data.users,
        {
          id: v4(),
          email: req.body.email,
          password: cryptedPassword,
        },
      ];

      fs.writeFileSync(filePath, JSON.stringify({ users: newUsers }));

      res.status(200).json({
        message: "registration successfull",
      });
    }
  }
});

/**
 * @description POST method for authenticating an existing user
 * @param {string} email  has to be a valid email
 * @param {string} password has to fullfill the password strength
 */
apiRouter.post("/login", async (req, res) => {
  // bad request - cannot continue
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      message: "Please provide both email and password",
    });
  } else {
    // add user to DB
    const filePath = path.join(__dirname, "../db/db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // verify if the user with given email already exists
    const userAlreadyExists = data.users.find(
      (user) => user.email === req.body.email
    );

    if (!userAlreadyExists) {
      console.log("user does not exist");
      res.status(407).json({
        message: "authentication failed",
      });
    } else {
      // verify password
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        userAlreadyExists.password
      );

      // if correct => token
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            email: req.body.email,
          },
          process.env.LOGIN_SECRET
        );

        res.status(200).json({
          message: "ok",
          token,
        });
      } else {
        console.log("password does not match");
        // if error =>
        res.status(407).json({
          message: "authentication failed",
        });
      }
    }
  }
});

/**
 * @description GET method for retrieving account info of the given email
 * @param {string} email  has to be a valid email
 */
apiRouter.get("/account", authMiddleware, (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      message: "Please provide valid email",
    });
  } else {
    // given an email
    // add user to DB
    const filePath = path.join(__dirname, "../db/db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // verify if the user with given email already exists
    const userAlreadyExists = data.users.find(
      (user) => user.email === req.body.email
    );

    // if email exists => account object
    if (userAlreadyExists) {
      res.status(200).json({
        email: userAlreadyExists.email,
        id: userAlreadyExists.id,
      });
    } // if email does not exist => error
    else {
      res.status(404).json({
        message: "user does not exist",
      });
    }
  }
});

export default apiRouter;
