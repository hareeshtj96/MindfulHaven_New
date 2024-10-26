import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        userId: string;
    }    

    const executeFunction = async ({ userId }: StatusParams) => {
        try {
            const response = await userRepository.walletDetails({ userId});
            
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_WALLET_USECASE };
        }
    }
    return {executeFunction}
}