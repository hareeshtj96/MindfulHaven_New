import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async ({ sortBy, page, limit }: { sortBy: string; page: number; limit: number }) => {
        try {
            let sortCriteria = {};

            if (sortBy === "experience") {
                sortCriteria = {  professionalExperience: -1 }
            }
            
            const sortedTherapists = await userRepository.getSortedIndividualTherapists({sortCriteria, page, limit});
            

            return { status: true, data: sortedTherapists };
            
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_FETCHING_SORTED_THERAPIST }
        }
    }
    return { executeFunction }
}