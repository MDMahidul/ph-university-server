import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { Server } from "http";
import seedSuperAdmin from "./app/DB";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

// handle unhandledRejection for async func
process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection is detected, shutting down server...`,err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
 
// handle unhandledRejection for sync func
process.on("uncaughtException", () => {
  console.log(`unhandled exception is detected, shutting down server...`);
  process.exit(1);
});