import React, { useEffect } from "react";
import { UseSelector, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/Store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const state = useSelector((state: RootState) => state.user)
  console.log("state:", state);
  console.log("is authenticated:",isAuthenticated);
  
  const navigate = useNavigate();

  useEffect(() => {

    if (isAuthenticated) {
      console.log("....authetnictd");
      
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
        return children
  }



};

export default ProtectedRoute;
