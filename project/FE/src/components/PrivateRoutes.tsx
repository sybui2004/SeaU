import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useSelector((state: any) => state.authReducer.authData);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
