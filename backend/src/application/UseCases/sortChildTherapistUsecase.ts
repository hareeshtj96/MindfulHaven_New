import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (sortBy: string) => {
        try {
            let sortCriteria = {};

            if (sortBy === "experience") {
                sortCriteria = {  professionalExperience: -1 }
            }
            
            const sortedTherapists = await userRepository.getSortedTherapists(sortCriteria);
            console.log("sortedTheerapisst.....", sortedTherapists);

            return { status: true, data: sortedTherapists };
            
        } catch (error) {
            console.error("Error in sorting therapist use case...", error);
            return { status: false, message: "Error fetching sorted therapists"}
        }
    }
    return { executeFunction }
}