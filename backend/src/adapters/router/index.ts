import express from 'express'
import authenticationRouter from "./authenticationRouter";
import adminRouter from './authenticationRouter/adminRouter';
import therapistRouter from './authenticationRouter/therapistRouter';


export const routes=(dependencies:any) => {
    const router = express.Router();
    router.use('/', authenticationRouter(dependencies))
    router.use('/admin', adminRouter(dependencies))
    router.use('/therapist', therapistRouter(dependencies))

    return router
}