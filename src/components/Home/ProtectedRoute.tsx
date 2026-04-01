import { Navigate, Outlet } from "react-router";
import { useAppData } from "../../context/AppDataContext";
import Loading from "./Loading";

/**
 * Wrap any <Route> with this component to require authentication.
 * - While the session check is running  → shows a loading indicator
 * - Not authenticated after the check   → redirects to /login
 * - Authenticated                       → renders the child route
 */
const ProtectedRoute = () => {
    const { isAuthenticated, appLoading } = useAppData();

    if (appLoading) {
        return (
            <Loading />
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
