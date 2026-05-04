import express from "express";
import type {  Express, Request, Response, NextFunction } from "express";

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response, next:NextFunction) => {
  res.send("Hello, World!");
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});