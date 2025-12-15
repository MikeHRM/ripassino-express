import "dotenv/config";
import express from "express";
import users from "./users/index.js";
import restaurants from "./restaurants/index.js";
import { initDB } from "./db/mongodb.js";

const app = express();
app.use(express.json()); // for parsing application/json

const port = process.env.PORT;

app.use("/users", users);
app.use("/restaurants", restaurants);

app.get("/", async (req, res) => {
  // logic

  const resp = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const response = await resp.json();

  // res.status(500).json({error: 'an error has occured' })
  res.status(200).json({
    message: "hello world!",
    response,
  });
});

app.post("/", (req, res) => {
  // res.status(500).json({error: 'an error has occured' })
  res.status(200).json({
    number: Math.random(),
  });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message,
  });
});

initDB(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
