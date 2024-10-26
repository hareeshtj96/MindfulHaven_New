import dependencies from "../../frameworks/config/dependencies";
import generateToken, {verifyToken} from "../../utils/generateToken";
import { JwtPayload } from "jsonwebtoken";
import { ResponseMessages } from "../../utils/httpStatusCode";


const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executionFunction = async (refreshToken: string) => {
        try {
            
            const decoded = verifyToken(refreshToken) as JwtPayload;

            const userId = decoded.userId;
            
            if(!userId) {
                return { status: false, message: ResponseMessages.INVALID_TOKEN_PAYLOAD };
            }

            const User = await userRepository.getUserByEmail(userId.email);

            if(!User) {
                return { status: false, message: ResponseMessages.USER_NOT_FOUND };
            }

            if(User.isBlocked) {
                return { status: false, message: ResponseMessages.USER_IS_BLOCKED };
            }
            const { accessToken, refreshToken: newRefreshToken} = generateToken({ userId });

            return { status: true, data: {accessToken, refreshToken: newRefreshToken}}
        } catch (error) {
            return { status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    }
    return { executionFunction }
}