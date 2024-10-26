import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const {userRepository} = dependencies.repository;

    const executeFunction = async (searchTerm: string) => {
        try {
            const therapists = await userRepository.getChildTherapistSearchResult(searchTerm)
        
            return { status: true, data: therapists}
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_SEARCHING_CHILD_THERAPIST }
            
        }
    }
    return { executeFunction }
}