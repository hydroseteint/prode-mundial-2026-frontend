import api from "../../../shared/services/api";

export const getMatchesWithPredictionsRequest = async () => {
    const response = await api.get("/matches/with-predictions");
    return response.data;
};

export const savePredictionRequest = async (predictionData) => {
    const response = await api.post("/predictions", predictionData);
    return response.data;
};