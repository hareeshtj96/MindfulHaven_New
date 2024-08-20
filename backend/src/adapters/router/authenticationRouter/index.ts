import express from "express";

import { userController } from "../../controller";

export default (dependencies: any) =>{
    const router = express();
    const {
       registrationController
    } = userController(dependencies);


    router.post('/register', registrationController);

    return router;
}