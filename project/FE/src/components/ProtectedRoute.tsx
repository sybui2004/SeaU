import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { authData } = useSelector((state: any) => state.authReducer);

  useEffect(() => {
    if (!authData) {
      navigate(adminOnly ? "/admin/login" : "/");
      return;
    }

    if (adminOnly && !authData.user.isAdmin) {
      navigate("/");
      return;
    }
  }, [authData, navigate, adminOnly]);

  if (!authData || (adminOnly && !authData.user.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
