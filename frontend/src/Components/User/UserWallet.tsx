import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchWalletDetails } from "../../Redux/Store/Slices/userSlice";
import { useLocation } from 'react-router-dom';

const UserWallet: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { user, loading, error, walletData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?.userId && location.pathname === "/user_profile/wallet") {
      dispatch(fetchWalletDetails(user.userId));
    }
  }, [user?.userId, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Wallet</h2>
      
      {/* Display wallet balance */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold">Balance: ₹{walletData?.balance}</h3>
        <h4 className="text-md mt-4">Currency:{walletData?.currency}</h4>
      </div>
      
      {/* Display transaction history */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
        {walletData?.transactionHistory && walletData.transactionHistory.length > 0 ? (
          <ul>
            {walletData.transactionHistory.map((transaction, index) => (
              <li key={index} className="border-b py-2">
                <span>{transaction.type === 'credit' ? 'Credit' : 'Debit'}:</span> ₹{transaction.amount}
                <span className="ml-2">({transaction.status})</span>
                <span className="ml-2">{new Date(transaction.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserWallet;