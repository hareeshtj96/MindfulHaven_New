import { Request, Response } from "express";

export default (dependencies: any) => {
    const { getIssuesresolvedUsecase } = dependencies.useCase;

    const adminIssueResolveController = async (req:Request, res: Response) => {
        try {
           
            const { issueId } = req.body;
            console.log("issue id:", issueId);
            const response = await getIssuesresolvedUsecase(dependencies).executeFunction(issueId);
            console.log("response from controller:", response);

            if(response && response.status) {
                console.log("response form controller:", response)
                return res.status(200).json({ status: true, message: response.message});
            } else {
                return res.status(404).json({ status: false, message: response.message})
            }
        } catch (error) {
            console.error("Error in admin get issues resolved:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return adminIssueResolveController;
}