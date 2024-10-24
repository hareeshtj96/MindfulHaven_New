import { Request, Response } from "express";


export default (dependencies: any) => {
    const { getIssuesUsecase } = dependencies.useCase;

    const adminFetchIssues = async (req:Request, res: Response) => {
        try {
           
            const response = await getIssuesUsecase(dependencies).executeFunction();

            if(response && response.status) {
                return res.status(200).json({ status: true, data: response.data});
            } else {
                return res.status(404).json({ status: false, message: "Data not found"})
            }
        } catch (error) {
            console.error("Error in admin fetch issues:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return adminFetchIssues;
}