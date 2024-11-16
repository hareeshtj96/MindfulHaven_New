import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../Redux/Store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();

 useEffect(() => {
  if (!authUser) {
    sessionStorage.setItem('intendedRoute', location.pathname);
    navigate('/login', {replace: true})
  }
 }, [authUser, navigate, location]);


return authUser ? <>{children}</> : null;
};

export default ProtectedRoute;