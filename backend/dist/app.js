"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importStar(require("express-session"));
const server_1 = __importDefault(require("./server"));
const express_2 = __importDefault(require("./express"));
const dependencies_1 = __importDefault(require("./frameworks/config/dependencies"));
const db_connect_1 = __importDefault(require("./config/db.connect"));
const config_1 = __importDefault(require("./config/config"));
const router_1 = require("./adapters/router");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, db_connect_1.default)(config_1.default);
(0, express_2.default)(app);
const store = new express_session_1.MemoryStore();
app.use((0, express_session_1.default)({
    store: store,
    secret: process.env.COOKIEPARSERSECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("session date:", req.session);
    next();
});
app.use((0, morgan_1.default)('combined'));
app.use('/', (0, router_1.routes)(dependencies_1.default));
// WebSocket server using the same HTTP server
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(JSON.stringify({ message: 'Message received' }));
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));
    ws.onerror = (error) => {
        console.error(`WebSocket error: ${error.message}`);
    };
});
(0, server_1.default)(server, config_1.default).startServer();
