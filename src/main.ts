import compression from "compression";
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./User/router";
import postRouter from "./posts/router";

const app: Application = express();
const port = 7000;

app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(cors());

app.use("/user", userRouter);
app.use("/post", postRouter);

const start = () => {
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
  });
};

start();
