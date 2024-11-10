import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/Store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useSelector((state: RootState) => state.user.user);
  const adminUser = useSelector((state: RootState) => state.admin.blockStatus);
  const navigate = useNavigate();

 useEffect(() => {
  const checkAuth = () => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const isBlocked = adminUser && authUser.userId === adminUser._id && adminUser.isBlocked;
    console.log("is blocked:", isBlocked);
    

    if (!isBlocked) {
      navigate('/login');
      return 
    }

    setIsLoading(false);
  };

  checkAuth();
 }, [authUser, adminUser, navigate]);

 return <>{children}</>
};

export default ProtectedRoute;