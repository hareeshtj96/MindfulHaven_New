import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const {userRepository} = dependencies.repository;

    const executeFunction = async (searchTerm: string) => {
        try {
            const therapists = await userRepository.getSearchResult(searchTerm)
            console.log("therapist result from usecasse;", therapists);

            return { status: true, data: therapists}
        } catch (error) {
            console.error("Error in search therapist use case:", error);
            return { status: false, message: "Error while searching therapists"}
            
        }
    }
    return { executeFunction }
}