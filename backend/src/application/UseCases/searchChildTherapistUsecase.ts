import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const {userRepository} = dependencies.repository;

    const executeFunction = async (searchTerm: string) => {
        try {
            const therapists = await userRepository.getChildTherapistSearchResult(searchTerm)
            console.log("therapist result from usecasse;", therapists);

            return { status: true, data: therapists}
        } catch (error) {
            console.error("Error in search child therapist use case:", error);
            return { status: false, message: "Error while searching child therapists"}
            
        }
    }
    return { executeFunction }
}