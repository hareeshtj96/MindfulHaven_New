"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
const cookieParser = require("cookie-parser");
const expressConfig = (app) => {
    const server = http_1.default.createServer(app);
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../src/public/uploads')));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express_1.default.static("public"));
    // app.use('/src/uploads', express.static('src/uploads'));
    app.use((0, cors_1.default)({
        origin: allowedOrigins,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
};
exports.default = expressConfig;
