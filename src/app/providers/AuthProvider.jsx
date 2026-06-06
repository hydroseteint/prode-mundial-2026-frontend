import { createContext, useContext, useEffect, useState } from "react";
import {loginRequest, currentRequest, logoutRequest } from "../../features/auth/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        setUser(data.user);

        return data;
    }

    const checkAuth = async () => {
        try {
            const data = await currentRequest();

            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false)
        }
    };

    const logout = async () => {
        await logoutRequest();
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


