import express, { Application, Request, Response } from "express";
import cors from 'cors';
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app:Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"] }));

// application route
app.use("/api/v1", router);

app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});

//global error handler
app.use(globalErrorHandler);

//not found route
app.use(notFound);

export default app;
