import api from "../../../shared/services/api";

export const getMatchesWithPredictionsRequest = async ({ page = 1, status = "all", journey = "all" } = {}) => {
    const response = await api.get("/matches/with-predictions", {
        params: { page, status, journey },
    });
    return response.data;
};

export const savePredictionRequest = async (predictionData) => {
    const response = await api.post("/predictions", predictionData);
    return response.data;
};