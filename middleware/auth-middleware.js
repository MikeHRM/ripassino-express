import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Beader _SPACE_ token

    const verified = jwt.verify(token, process.env.LOGIN_SECRET);

    console.log("verified", verified);

    req.body.iat = verified.iat;

    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).json({
      message: "NOT_AUTHORIZED",
    });
  }
};
