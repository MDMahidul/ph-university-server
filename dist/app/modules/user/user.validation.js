"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userSchemaValidation = zod_1.z.object({
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be string",
    })
        .max(20, { message: "Password can't be more than 20 characters" }),
});
exports.UserValidation = {
    userSchemaValidation,
};
