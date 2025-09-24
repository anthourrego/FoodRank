import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router";

export const PrivateGuard = () => {
  const isLogin = useAuthStore((state) => state.isLogged);
  return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};