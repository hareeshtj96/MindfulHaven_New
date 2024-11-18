import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

interface WalletPaymentInput {
  therapistId: string;
  userId: string;
  slot: string;
  notes: string;
  totalAmount: number;
}

export default (dependencies: any) => {
  const { userRepository } = dependencies.repository;

  const executeFunction = async ({
    therapistId,
    userId,
    slot,
    notes,
    totalAmount,
  }: WalletPaymentInput) => {
    try {
      const response = await userRepository.WalletPaymentSave({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
      });

      if (!response.status) {
        return { status: false, message: response.message}
      }

      return { status: true, data: response.data, message: response.message };
    } catch (error) {
      return { status: false, message: ResponseMessages.ERROR_WALLET_PAYMENT };
    }
  };
  return { executeFunction };
};
