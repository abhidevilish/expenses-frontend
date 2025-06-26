import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./features/login/LoginForm";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute/EmployeeRoute";
import EmployeeDashboard from "./features/dashboard/EmployeeDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
// import './App.css'

const App = () => {

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/dashboard" element=
            {<AdminRoute>
              < AdminDashboard />
            </AdminRoute>} />
          <Route path="/employee/dashboard" element={
            <EmployeeRoute>
              <EmployeeDashboard />
            </EmployeeRoute>
          } />
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App
