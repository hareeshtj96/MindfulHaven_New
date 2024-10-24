import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        userId: string;
    }    

    const executeFunction = async ({ userId }: StatusParams) => {
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:",  userId)
            const response = await userRepository.walletDetails({ userId});
            console.log("response from wallet details use case:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_WALLET_USECASE };
        }
    }
    return {executeFunction}
}