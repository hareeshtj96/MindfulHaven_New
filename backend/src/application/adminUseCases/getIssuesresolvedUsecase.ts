
export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async (issueId: string) => {
        try {
            const response = await adminRepository.getIssueResolved(issueId);
            console.log("response from execute function:", response);

            if(response.status) {
                return { status: true, message: response.message};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in adminUseCase"};
        }
    }
    return {executeFunction}
}