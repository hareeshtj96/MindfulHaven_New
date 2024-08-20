import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import session, { MemoryStore } from 'express-session';
import serverConfig from './server';
import expressConfig from './express';
import dependencies from './frameworks/config/dependencies';
import connectDB from './config/db.connect';
import config from './config/config';
import { routes } from './adapters/router';

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

app.use('/api', routes(dependencies))

serverConfig(server, config).startServer()