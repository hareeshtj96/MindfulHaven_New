import express, {Express} from "express";
import cors from "cors";
import http from "http";
import path from 'path'
import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const cookieParser = require("cookie-parser");

const expressConfig = (app: Express) => {
    const server = http.createServer(app);

    app.use('/uploads', express.static(path.join(__dirname, '../src/public/uploads')));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(express.static("public"));
    // app.use('/src/uploads', express.static('src/uploads'));

    app.use(
        cors({
            origin: allowedOrigins,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
            
        })
    );
};

export default expressConfig;

