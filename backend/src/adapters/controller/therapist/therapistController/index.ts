
import therapistRegisterController from "./therapistRegisterController"
import verifyOTP from "./verifyOTP"
import therapistLogin from "./therapistLoginController"
import therapistDetailsController from "./therapistDetailsController"
import getTherapistProfile from "./getTherapistProfile"
import getBookingsController from "./getBookingsController"
import therapistUpdateTimingsController from "./therapistUpdateTimingsController"
import therapistVideoController from "./therapistVideoController"


export default (dependencies: any) => {
    return {
        therapistRegisterController: therapistRegisterController(dependencies),
        verifyOTP: verifyOTP(dependencies),
        therapistLogin: therapistLogin(dependencies),
        therapistDetailsController: therapistDetailsController(dependencies),
        getTherapistProfile: getTherapistProfile(dependencies),
        getBookingsController: getBookingsController(dependencies),
        therapistUpdateTimingsController: therapistUpdateTimingsController(dependencies),
        therapistVideoController: therapistVideoController(dependencies),
    }
}