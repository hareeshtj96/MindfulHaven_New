
import therapistRegisterController from "./therapistRegisterController"
import verifyOTP from "./verifyOTP"
import therapistLogin from "./therapistLoginController"
import therapistDetailsController from "./therapistDetailsController"

export default (dependencies: any) => {
    return {
        therapistRegisterController: therapistRegisterController(dependencies),
        verifyOTP: verifyOTP(dependencies),
        therapistLogin: therapistLogin(dependencies),
        therapistDetailsController: therapistDetailsController(dependencies),
    }
}