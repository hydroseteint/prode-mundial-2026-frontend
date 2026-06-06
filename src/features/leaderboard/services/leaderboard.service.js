import api from "../../../shared/services/api";

export const getLeaderboardRequest = async () => {
    const response = await api.get("/leaderboard");
    return response.data;
};  