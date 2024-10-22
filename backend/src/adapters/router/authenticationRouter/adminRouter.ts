import express from "express";
import {  adminController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";


export default (dependencies:any) => {
    const router = express();

    const {
        adminLoginController,
        adminGetTherapist,
        adminGetUsers,
        adminTherapistVerification,
        adminUserBlock,
        getTherapistDetails,
        adminDashboardDetails
    } = adminController(dependencies);

    router.post('/admin_login', adminLoginController);
    router.get('/admin_getTherapist', adminGetTherapist);
    router.get('/admin_getUsers', adminGetUsers);
    router.patch('/therapist_getVerified/:id', adminTherapistVerification);
    router.patch('/user_blockUnblock/:id', adminUserBlock);
    router.get('/admin_getTherapistDetails/:id', getTherapistDetails);
    router.get('/admin_dashboard', adminDashboardDetails);

    
    router.use('/*', roleMiddleware(['admin']));

    return router;


}