"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    middleName: { String, trim: true },
    lastName: { String, required: true },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        required: true,
        trim: true,
    },
    fatherOccupation: {
        type: String,
        trim: true,
        required: true,
    },
    fatherContactNo: {
        type: String,
        trim: true,
        required: true,
    },
    motherName: {
        type: String,
        trim: true,
        required: true,
    },
    motherOccupation: {
        type: String,
        trim: true,
        required: true,
    },
    motherContactNo: {
        type: String,
        trim: true,
        required: true,
    },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: { type: String, trim: true, required: true },
    occupation: {
        type: String,
        trim: true,
        required: true,
    },
    contactNo: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
});
//main schema
const studentSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    name: { type: userNameSchema, required: true },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: "The gender field can only be one of the following: 'male', 'female', 'others'",
        },
        required: true,
    },
    dateOfBirth: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    contactNo: {
        type: String,
        trim: true,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        trim: true,
        required: true,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    presentAddress: {
        type: String,
        trim: true,
        required: true,
    },
    parmanentAddress: {
        type: String,
        trim: true,
        required: true,
    },
    guardian: { type: guardianSchema, required: true },
    localGuardian: {
        type: localGuardianSchema,
        required: true,
    },
    profileImage: { type: String },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
// 3. Create a Model.
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
