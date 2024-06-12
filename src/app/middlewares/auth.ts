import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/Apperror";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if the token sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        }
        req.user = decoded as JwtPayload;
        next();
      }
    );
  });
};

export default auth;
