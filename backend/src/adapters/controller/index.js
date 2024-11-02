"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.therapistController = exports.adminController = exports.userController = void 0;
const userController_1 = __importDefault(require("./user/userController"));
exports.userController = userController_1.default;
const adminController_1 = __importDefault(require("./admin/adminController"));
exports.adminController = adminController_1.default;
const therapistController_1 = __importDefault(require("./therapist/therapistController"));
exports.therapistController = therapistController_1.default;
