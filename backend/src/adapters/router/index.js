"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const authenticationRouter_1 = __importDefault(require("./authenticationRouter"));
const adminRouter_1 = __importDefault(require("./authenticationRouter/adminRouter"));
const therapistRouter_1 = __importDefault(require("./authenticationRouter/therapistRouter"));
const routes = (dependencies) => {
    const router = express_1.default.Router();
    router.use('/', (0, authenticationRouter_1.default)(dependencies));
    router.use('/admin', (0, adminRouter_1.default)(dependencies));
    router.use('/therapist', (0, therapistRouter_1.default)(dependencies));
    return router;
};
exports.routes = routes;
