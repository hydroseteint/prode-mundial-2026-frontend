import { createContext, useContext, useEffect, useState } from "react";
import {loginRequest, currentRequest, logoutRequest } from "../../features/auth/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        localStorage.setItem("token", data.token);
        setUser(data.user);

        return data;
    }

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const data = await currentRequest();
            setUser(data.user);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logoutRequest();
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, login, checkAuth, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}


