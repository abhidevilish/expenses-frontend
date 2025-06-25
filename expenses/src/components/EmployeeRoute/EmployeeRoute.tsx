import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

type EmployeeRouteProps = {
  children: ReactNode
}

const EmployeeRoute = ({ children }: EmployeeRouteProps) => {
  const role = useSelector((state: RootState) => state.user.role)
  if (role != "employee") return <Navigate to='/' replace />
  return children;
}

export default EmployeeRoute;