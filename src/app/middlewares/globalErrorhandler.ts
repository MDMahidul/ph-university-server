import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../interface/error";
import { ZodError } from "zod";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  // create errorsource array of object
  let errorSources: TErrorSource = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  //check te error provider
  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errorSources = simplified?.errorSources;
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
