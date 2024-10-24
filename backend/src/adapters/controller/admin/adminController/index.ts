
import adminLoginController from "./adminLoginController";
import adminGetTherapist from "./adminGetTherapist";
import adminGetUsers from "./adminGetUsers";
import adminTherapistVerification from "./adminTherapistVerification";
import adminUserBlock from "./adminUserBlock";
import getTherapistDetails from "./getTherapistDetails";
import adminDashboardDetails from "./adminDashboardDetails";
import adminFetchIssues from "./adminFetchIssues";
import adminIssueResolve from "./adminIssueResolve";

export default (dependencies: any) => {
    return {
        adminLoginController: adminLoginController(dependencies),
        adminGetTherapist: adminGetTherapist(dependencies),
        adminGetUsers: adminGetUsers(dependencies),
        adminTherapistVerification: adminTherapistVerification(dependencies),
        adminUserBlock: adminUserBlock(dependencies),
        getTherapistDetails: getTherapistDetails(dependencies),
        adminDashboardDetails: adminDashboardDetails(dependencies),
        adminFetchIssues: adminFetchIssues(dependencies),
        adminIssueResolve: adminIssueResolve(dependencies),
    }
}