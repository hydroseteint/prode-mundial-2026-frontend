import { Navigate, Outlet } from "react-router-dom";
import { Center, Loader } from "@mantine/core";

import { useAuth } from "../../app/providers/AuthProvider";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;