import { log } from "console";
import { Request, Response } from "express";
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        userData?: {
            name: string;
            email: string;
            password: string;
            mobile: string;
            role: string;
        };
        otp?: string
    }
}

export default (dependencies: any) => {
    const {userRegistration} = dependencies.useCase;

    const registerController = async (req:Request, res:Response) => {
        try {

      
        const {name, email, password, mobile, role} = req.body;

        const data = {
            name,
            email,
            password,
            mobile,
            role,
        };

        req.session.userData = data;
        console.log(req.session.userData);

        const executionFunction = await userRegistration(dependencies);
        const response = await executionFunction.executionFunction(data);

        if(response.status) {
            req.session.otp = response.data;
            console.log(response);
            
         res.json({ status: true, data:response.data})
        } else {
            res.json({ status: false, data: response.data});
        }

    } catch(error) {
        console.error('Error in registration:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
    } 
    return registerController;
}