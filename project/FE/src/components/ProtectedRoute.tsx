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
    // Nếu không có dữ liệu xác thực, chuyển hướng đến trang đăng nhập
    if (!authData) {
      navigate(adminOnly ? "/admin/login" : "/");
      return;
    }

    // Nếu route yêu cầu quyền admin nhưng người dùng không phải admin
    if (adminOnly && !authData.user.isAdmin) {
      navigate("/"); // Hoặc trang thông báo lỗi
      return;
    }
  }, [authData, navigate, adminOnly]);

  // Nếu không có dữ liệu xác thực hoặc không đủ quyền, không render con
  if (!authData || (adminOnly && !authData.user.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
