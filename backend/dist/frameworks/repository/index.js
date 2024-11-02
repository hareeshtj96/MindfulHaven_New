"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.therapistRepository = exports.adminRepository = exports.userRepository = void 0;
const userRepository_1 = __importDefault(require("./userRepository"));
exports.userRepository = userRepository_1.default;
const adminRepository_1 = __importDefault(require("./adminRepository"));
exports.adminRepository = adminRepository_1.default;
const therapistRepository_1 = __importDefault(require("./therapistRepository"));
exports.therapistRepository = therapistRepository_1.default;
