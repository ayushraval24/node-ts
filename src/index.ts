require("dotenv").config();
import http from "http";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/index";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const PORT: number | string = process.env.PORT || 8000;
const MONGO_URL: string =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ts";

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", router());
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});

mongoose
  .connect(MONGO_URL)
  .then((res) => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log("Error connecting to database");
  });
