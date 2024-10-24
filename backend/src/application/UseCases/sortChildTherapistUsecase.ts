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
            
            const sortedTherapists = await userRepository.getSortedTherapists(sortCriteria);
            

            return { status: true, data: sortedTherapists };
            
        } catch (error) {
            console.error("Error in sorting therapist use case...", error);
            return { status: false, message: ResponseMessages.ERROR_FETCHING_SORTED_THERAPIST }
        }
    }
    return { executeFunction }
}