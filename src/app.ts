import express, { Request, Response } from "express";
import cors from 'cors';
import { UserRoutes } from "./app/modules/user/user.routes";

const app = express();

app.use(express.json());
app.use(cors());

// application route
app.use("/api/v1/users", UserRoutes);

app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});

export default app;
