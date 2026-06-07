import api from "../../../shared/services/api";

export const getLeaderboardRequest = async () => {
    const response = await api.get("/leaderboard");
    return response.data;
};  

export const getGroupStageLeaderboardRequest = async () => {
    const response = await api.get("/leaderboard/group-stage");
    return response.data;
};