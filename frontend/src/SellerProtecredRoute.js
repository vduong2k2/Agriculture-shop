import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../backend/middleware/auth";

const SellerProtectedRoute = ({ isSeller, seller, children }) => {
  if (!isSeller) {
    return <Navigate to={`/shop/${seller._id}`} replace />;
  }
  return children;
};
export default SellerProtectedRoute;
