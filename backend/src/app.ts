import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import session, { MemoryStore } from 'express-session';
import serverConfig from './server';
import expressConfig from './express';
import dependencies from './frameworks/config/dependencies';
import connectDB from './config/db.connect';
import config from './config/config';
import { routes } from './adapters/router';
import morgan from 'morgan';

dotenv.config()

const app = express();
const server = http.createServer(app);
connectDB(config);
expressConfig(app);

const store = new MemoryStore();
app.use(session({
    store: store,
    secret: process.env.COOKIEPARSERSECRET as string,
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("session date:", req.session)
    next();
})

app.use(morgan('combined')); 

app.use('/', routes(dependencies))

// WebSocket server using the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`)

        ws.send(JSON.stringify({ message: 'Message received' }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));

    ws.onerror = (error) => {
        console.error(`WebSocket error: ${error.message}`);
    };
    
})

serverConfig(server, config).startServer()