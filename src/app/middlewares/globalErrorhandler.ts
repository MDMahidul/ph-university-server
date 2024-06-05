import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  // create errorsource array of object
  let errorSources: TErrorSources = [
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
  } else if (err?.name === "ValidationError") {
    const simplified = handleValidationError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errorSources = simplified?.errorSources;
  } else if (err?.name === "CastError") {
    const simplified = handleCastError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errorSources = simplified?.errorSources;
  } else if (err?.code === 11000) {
    const simplified = handleDuplicateError(err);
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
