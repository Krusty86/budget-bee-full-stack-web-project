import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectToken } from "../../selectors/authSelector";

const isValidToken = (val) =>
  Boolean(val && val !== "null" && val !== "undefined");

const ProtectedRoute = () => {
  const location = useLocation();
  const token = useSelector(selectToken);
  const storageToken = localStorage.getItem("token");

  if (!isValidToken(token) && !isValidToken(storageToken)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;