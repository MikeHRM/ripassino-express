import "dotenv/config";
import express from "express";
import users from "./users/index.js";

const app = express();
app.use(express.json()); // for parsing application/json

const port = process.env.PORT;

app.use("/users", users);

app.get("/", (req, res) => {
  // logic

  // res.status(500).json({error: 'an error has occured' })
  res.status(200).json({
    message: "hello world!",
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
