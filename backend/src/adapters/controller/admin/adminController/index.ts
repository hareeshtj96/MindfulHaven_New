
import adminLoginController from "./adminLoginController";
import adminGetTherapist from "./adminGetTherapist";
import adminGetUsers from "./adminGetUsers";
import adminTherapistVerification from "./adminTherapistVerification";

export default (dependencies: any) => {
    return {
        adminLoginController: adminLoginController(dependencies),
        adminGetTherapist: adminGetTherapist(dependencies),
        adminGetUsers: adminGetUsers(dependencies),
        adminTherapistVerification: adminTherapistVerification(dependencies),
        
    }
}