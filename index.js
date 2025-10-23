import "dotenv/config";
import express from "express";

const app = express();
// const router = app.router()
const port = process.env.PORT;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
