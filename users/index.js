import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// recreate __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRouter = Router();

/**
 * @description POST method for registering a new user
 * @param {string} email  has to be a valid email
 * @param {string} password has to fullfill the password strength
 */
apiRouter.post("/register", (req, res) => {
  // bad request - cannot continue
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      message: "Please provide both email and password",
    });
  } else {
    // verify if the user with given email already exists

    // crypt password

    // add user to DB
    const filePath = path.join(__dirname, "../db/db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const newUsers = [
      ...data.users,
      {
        email: req.body.email,
        password: req.body.password,
      },
    ];

    fs.writeFileSync(filePath, JSON.stringify({ users: newUsers }));

    res.status(200).json({
      message: "hello from register",
      body: `The body is ${JSON.stringify(newUsers)}`,
    });
  }
});

export default apiRouter;
