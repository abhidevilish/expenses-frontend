import  { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

type AdminRouteProps = {
  children :ReactNode
}

const AdminRoute  = ({ children  }: AdminRouteProps) => {
  const role = useSelector((state: RootState) => state.user.role)
  if (role != 'admin') return <Navigate to='/' replace />
  return children
}

export default AdminRoute;