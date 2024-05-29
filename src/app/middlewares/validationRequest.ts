import { NextFunction, Request, Response } from "express";
import { AnyObject } from "mongoose";

const validateRequest = (schema: AnyObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // zod parse data
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;