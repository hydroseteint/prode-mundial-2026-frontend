import api from "../../../shared/services/api.js";

export const loginRequest = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
}

export const currentRequest = async () => {
    const response = await api.get("/auth/current");
    return response.data;
}

export const logoutRequest = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};