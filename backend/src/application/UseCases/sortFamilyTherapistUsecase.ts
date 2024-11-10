import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (sortBy: string) => {
        try {
            let sortCriteria = {};

            if (sortBy === "experience") {
                sortCriteria = {  professionalExperience: -1 }
            }
            
            const sortedTherapists = await userRepository.getSortedFamilyTherapists(sortCriteria);
            

            return { status: true, data: sortedTherapists };
            
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_FETCHING_SORTED_THERAPIST }
        }
    }
    return { executeFunction }
}