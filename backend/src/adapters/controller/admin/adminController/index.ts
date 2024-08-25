
import adminLoginController from "./adminLoginController";

export default (dependencies: any) => {
    return {
        adminLoginController: adminLoginController(dependencies),
    }
}