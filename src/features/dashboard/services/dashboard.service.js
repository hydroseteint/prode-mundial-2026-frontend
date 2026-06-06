import api from "../../../shared/services/api";

export const getMyStatsRequest = async () => {
    const response = await api.get("/stats/me");

    return response.data;
};

export const getLeaderboardRequest = async () => {
    const response = await api.get("/leaderboard");

    return response.data;
};

export const getNextArgentinaMatchRequest = async () => {
    const response = await api.get("/matches/next-argentina");

    return response.data;
};

export const getTodayMatchesRequest = async () => {
    const response = await api.get("/matches/today");
    return response.data;
};