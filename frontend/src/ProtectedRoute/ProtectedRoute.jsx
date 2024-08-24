import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  console.log(isAuthenticated);
  
  const navigate = useNavigate();

  useEffect(() => {

    if (isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
        return children
  }



};

export default ProtectedRoute;
