import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";

const AuthProvider = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return user ? <Outlet /> : <Navigate to={"/sign-in"} replace />;
};

export default AuthProvider;
