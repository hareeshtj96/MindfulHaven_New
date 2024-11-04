"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
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
        origin: ["http://localhost:5173", "https://mindfulhaven.life", "https://www.mindfulhaven.life"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
};
exports.default = expressConfig;
