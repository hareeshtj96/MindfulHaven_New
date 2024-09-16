import express, {Express} from "express";
import cors from "cors";
import http from "http";
import path from 'path'

const cookieParser = require("cookie-parser");

const expressConfig = (app: Express) => {
    const server = http.createServer(app);

    app.use('/uploads', express.static(path.join(__dirname, '../src/public/uploads')));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser(process.env.COOKIEPARSERSECRET || 'default_secret'));
    app.use(express.static("public"));
    // app.use('/src/uploads', express.static('src/uploads'));

    app.use(
        cors({
            origin: ["http://localhost:5173"],
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        })
    );
};

export default expressConfig;

