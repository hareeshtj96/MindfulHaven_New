import express from 'express'
import authenticationRouter from "./authenticationRouter";


export const routes=(dependencies:any) => {
    const router = express.Router();
    router.use('/', authenticationRouter(dependencies))
    return router
}