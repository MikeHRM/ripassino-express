import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

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
    // verify if the user with given email already exists

    // crypt password
    const cryptedPassword = await bcrypt.hash(req.body.password, 5);

    // add user to DB
    const filePath = path.join(__dirname, "../db/db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

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
});

apiRouter.get("/", async (req, res) => {
  const message = await bcrypt.compare(
    "pluto",
    "$2b$05$GONdPNvXn5ffK5N5DXwMme0nH2tVWOHauD50SY0G6qpvVEe8yOVOq"
  );
  res.status(200).json({
    message,
  });
});

export default apiRouter;
